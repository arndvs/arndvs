import { NextRequest, NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/api-auth";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

/**
 * GET /api/ops/stats — queue statistics.
 * Counts drafts by status and source type, for the console stats bar.
 */
export async function GET(request: NextRequest) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const store = createSanitySocialDraftStore();
    const drafts = await store.listActionable();

    const byStatus = drafts.reduce<Record<string, number>>((acc, d) => {
        acc[d.status] = (acc[d.status] ?? 0) + 1;
        return acc;
    }, {});

    const bySource = drafts.reduce<Record<string, number>>((acc, d) => {
        acc[d.sourceType] = (acc[d.sourceType] ?? 0) + 1;
        return acc;
    }, {});

    const actionableComments = drafts.filter(
        (d) => d.sourceType === "comment" && d.status !== "posted",
    ).length;

    return NextResponse.json({
        stats: {
            total: drafts.length,
            byStatus,
            bySource,
            reviewableComments: actionableComments,
        },
    });
}
