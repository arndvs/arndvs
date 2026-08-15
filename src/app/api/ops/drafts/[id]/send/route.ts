import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/drafts/[id]/send — mark a draft as sent.
 *
 * v1 semantics: the human posts to LinkedIn manually, then confirms here.
 * This flips status ready → posted via markPosted().
 *
 * One-approval-one-send is enforced by the state machine: only a draft in
 * "ready" can transition to "posted". A concurrent double-send fails on the
 * second attempt (already posted).
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanitySocialDraftStore();
    const draft = await store.getById(id);

    if (!draft) return jsonError("Draft not found", 404);

    if (draft.status !== "ready") {
        return jsonError(
            `Cannot send a draft in state "${draft.status}" — only "ready" drafts can be sent`,
            409,
        );
    }

    const sent = await store.markPosted(id);
    return NextResponse.json({ draft: sent });
}
