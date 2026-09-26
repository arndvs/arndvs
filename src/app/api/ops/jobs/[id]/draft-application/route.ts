import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { dispatchJob } from "@/lib/engine/job-dispatch";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/jobs/[id]/draft-application
 *
 * Drafts a cover note for a saved job and persists it as a socialDraft
 * (sourceType: "job"). Never sends — the draft lands in the human review
 * queue.
 *
 * Thin shim over the job-dispatch layer (refs #64): the dispatch module
 * owns the saved-gate, idempotency, mutual exclusion with follow-up
 * dispatch, and the applied → saved compensating rollback.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;

    try {
        const result = await dispatchJob(id, "application", {
            jobStore: createSanityJobPostingStore(),
            draftStore: createSanitySocialDraftStore(),
        });

        if (result.alreadyDispatched) {
            return NextResponse.json({ job: result.job, draft: result.draft ?? null });
        }
        return NextResponse.json({ draft: result.draft, job: result.job }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to draft application";
        console.error("draft-application:", err);
        if (message.includes("not found")) return jsonError(message, 404);
        if (message.includes("Only saved jobs")) return jsonError(message, 400);
        if (message.includes("no longer in a draftable state")) return jsonError(message, 409);
        return jsonError("Failed to draft application", 500);
    }
}
