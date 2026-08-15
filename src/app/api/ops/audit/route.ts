import { NextRequest, NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

/**
 * GET /api/ops/audit — append-only audit trail.
 * Lists socialDraft documents (including terminal states) for the audit view.
 */
export async function GET(request: NextRequest) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const store = createSanitySocialDraftStore();
    const drafts = await store.listActionable();

    // Note: v1 audit = all actionable drafts with their state + timestamps.
    // A dedicated append-only socialDraftEvent/revision doc type is a
    // planned enhancement (would capture every transition over time).
    const audit = drafts.map((d) => ({
        id: d._id,
        status: d.status,
        sourceType: d.sourceType,
        targetPerson: d.targetPerson ?? null,
        score: d.score ?? null,
        generatedAt: d.generatedAt ?? null,
        postedAt: d.postedAt ?? null,
    }));

    return NextResponse.json({ audit });
}
