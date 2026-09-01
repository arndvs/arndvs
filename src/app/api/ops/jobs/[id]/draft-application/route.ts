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

    const draft = await draftJobApplication(
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

    const store = createSanitySocialDraftStore();
    const created = await store.create({
        platform: "linkedin",
        contentType: "post",
        body: draft.body,
        sourceType: "job", // extended from weeklyDigest/comment
        score: job.score,
        targetPerson: job.company,
    });

    return NextResponse.json({ draft: created }, { status: 201 });
}