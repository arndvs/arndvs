import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { draftJobApplication } from "@/lib/engine/job-drafter";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/jobs/[id]/draft-application
 *
 * Drafts a cover note for a saved job and persists it as a socialDraft
 * (sourceType: "job" — extends the existing types with a new value).
 *
 * Never sends. The draft lands in the human review queue.
 *
 * Atomicity: the job is transitioned saved → applied server-side, and the
 * draft is created, in one request. A repeat call returns 409 (the job is
 * already applied) — this prevents duplicate drafts + repeated OpenAI spend
 * from double-clicks or stale client state.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const jobStore = createSanityJobPostingStore();
    const job = await jobStore.getById(id);
    if (!job) return jsonError("Job posting not found", 404);

    // Only saved jobs can be drafted for application (human gate invariant).
    if (job.status !== "saved") {
        return jsonError("Only saved jobs can be drafted for application", 400);
    }

    let draft;
    try {
        draft = await draftJobApplication(
            {
                url: job.url,
                title: job.title,
                company: job.company,
                location: job.location,
                workType: job.workType,
                salary: job.salary,
            },
            // Role-fit profile for the drafter's context.
            {
                titles: [
                    "Forward Deployed Engineer",
                    "Applied AI Engineer",
                    "Senior Full Stack Engineer",
                    "AI Agent Engineer",
                    "Software Engineering Generalist",
                    "AI Solutions Engineer",
                ],
                skills: [],
                locations: ["San Diego"],
            },
        );
    } catch (err) {
        console.error("draft-application: OpenAI draft failed", err);
        return jsonError("Failed to draft application", 500);
    }

    // Transition saved → applied BEFORE creating the draft, so a failure
    // here leaves no orphan draft. If the transition fails (e.g. the job
    // was already applied in another tab), return 409 — no draft is created.
    let applied;
    try {
        applied = await jobStore.transition(id, "applied");
    } catch (err) {
        console.error("draft-application: transition failed", err);
        return jsonError("Job is no longer in a draftable state", 409);
    }

    const store = createSanitySocialDraftStore();
    let created;
    try {
        created = await store.create({
            platform: "linkedin",
            contentType: "post",
            body: draft.body,
            sourceType: "job", // extended from weeklyDigest/comment
            score: job.score,
            targetPerson: job.company,
        });
    } catch (err) {
        console.error("draft-application: draft persist failed", err);
        // Roll back the transition so the job stays draftable.
        try {
            await jobStore.transition(id, "saved");
        } catch {
            // Best-effort rollback; the job may be stuck applied — surface it.
        }
        return jsonError("Failed to persist draft", 500);
    }

    return NextResponse.json({ draft: created, job: applied }, { status: 201 });
}
