import { NextRequest, NextResponse } from "next/server";

import { requireApiAuth } from "@/lib/api-auth";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";

/**
 * GET /api/ops/jobs — list job postings sorted by fit score desc.
 * Optionally filtered by status.
 */
export async function GET(request: NextRequest) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const store = createSanityJobPostingStore();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;

    const jobs = await store.listByStatus(status as never);

    return NextResponse.json({ jobs });
}