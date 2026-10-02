import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { dispatchJob } from "@/lib/engine/job-dispatch";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/jobs/[id]/to-issue
 *
 * Dispatches a saved job to a hidden follow-up issue in the private
 * `cmd-private` repo, labeled `agent:prep`. An agent can then pick it up
 * to research the company and draft outreach — never to apply.
 *
 * Thin shim over the job-dispatch layer (refs #64): the dispatch module
 * owns the saved-gate, idempotency (re-dispatch returns the existing
 * issue), and mutual exclusion with application drafting.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;

    try {
        const result = await dispatchJob(id, "followup", {
            jobStore: createSanityJobPostingStore(),
            draftStore: createSanitySocialDraftStore(),
        });

        if (result.alreadyDispatched) {
            return NextResponse.json({ job: result.job, issueUrl: result.issueUrl });
        }
        return NextResponse.json({ job: result.job, issueUrl: result.issueUrl }, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create follow-up issue";
        console.error("to-issue:", err);
        if (message.includes("not found")) return jsonError(message, 404);
        if (message.includes("Only saved jobs")) return jsonError(message, 400);
        if (message.includes("AGENT_PAT")) return jsonError(message, 500);
        return jsonError("Failed to create follow-up issue", 500);
    }
}
