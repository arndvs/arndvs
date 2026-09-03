import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { jobStatusSchema } from "@/lib/engine/job-types";

/**
 * GET /api/ops/jobs — list job postings sorted by fit score desc.
 * Optionally filtered by status.
 */
export async function GET(request: NextRequest) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const store = createSanityJobPostingStore();

    const { searchParams } = new URL(request.url);
    const rawStatus = searchParams.get("status");
    let status;
    if (rawStatus) {
        const parsed = jobStatusSchema.safeParse(rawStatus);
        if (!parsed.success) return jsonError("Invalid job status", 400);
        status = parsed.data;
    }

    const jobs = await store.listByStatus(status, 100);

    return NextResponse.json({ jobs });
}
