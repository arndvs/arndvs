import { NextRequest, NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

/**
 * GET /api/ops/queue — list actionable social drafts (draft/editing/ready)
 * sorted by score desc. Optionally filtered by sourceType.
 */
export async function GET(request: NextRequest) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const store = createSanitySocialDraftStore();
    const drafts = await store.listActionable();

    const { searchParams } = new URL(request.url);
    const sourceType = searchParams.get("sourceType");

    const filtered = sourceType ? drafts.filter((d) => d.sourceType === sourceType) : drafts;

    return NextResponse.json({ drafts: filtered });
}
