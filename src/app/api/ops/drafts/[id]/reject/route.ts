import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/drafts/[id]/reject — skip a draft (requires a note).
 * Moves to "skipped" (terminal) via the state machine.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const body = (await request.json()) as { note?: string };

    if (!body.note?.trim()) {
        return jsonError("A note is required to reject a draft", 400);
    }

    const store = createSanitySocialDraftStore();
    const draft = await store.getById(id);
    if (!draft) return jsonError("Draft not found", 404);

    if (draft.status === "posted" || draft.status === "skipped") {
        return jsonError(`Cannot reject a draft in state "${draft.status}"`, 409);
    }

    const rejected = await store.transition(id, "skipped");
    return NextResponse.json({ draft: rejected, note: body.note.trim() });
}
