import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";
import { assertValidTransition } from "@/lib/engine/types";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/ops/drafts/[id] — single draft detail.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanitySocialDraftStore();
    const draft = await store.getById(id);

    if (!draft) return jsonError("Draft not found", 404);

    return NextResponse.json({ draft });
}

/**
 * PATCH /api/ops/drafts/[id] — edit body/editedBody.
 * Editing a draft moves it to "editing" (if not already there).
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const body = (await request.json()) as { body?: string; editedBody?: string };

    const store = createSanitySocialDraftStore();
    const draft = await store.getById(id);
    if (!draft) return jsonError("Draft not found", 404);

    // Move to editing before editing content.
    if (draft.status === "draft") {
        assertValidTransition(draft.status, "editing");
        await store.transition(id, "editing");
    }

    const updated = await store.updateBody(id, body.body ?? draft.body);

    return NextResponse.json({ draft: updated });
}

/**
 * POST /api/ops/drafts/[id] — approve: move to "ready" via the state machine.
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanitySocialDraftStore();
    const draft = await store.getById(id);
    if (!draft) return jsonError("Draft not found", 404);

    if (draft.status !== "editing" && draft.status !== "ready") {
        return jsonError(`Cannot approve a draft in state "${draft.status}"`, 409);
    }

    const approved = await store.transition(id, "ready");
    return NextResponse.json({ draft: approved });
}
