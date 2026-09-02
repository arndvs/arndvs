import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { assertValidJobTransition, jobStatusSchema } from "@/lib/engine/job-types";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/ops/jobs/[id] — single job posting detail.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanityJobPostingStore();
    const job = await store.getById(id);
    if (!job) return jsonError("Job posting not found", 404);

    return NextResponse.json({ job });
}

/**
 * PATCH /api/ops/jobs/[id] — transition job status (save / skip / expire).
 * Body: { status: "saved" | "skip" | "expired" }
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanityJobPostingStore();
    const job = await store.getById(id);
    if (!job) return jsonError("Job posting not found", 404);

    // Validate the status value against the schema before using it.
    const parsed = jobStatusSchema.safeParse((await request.json()).status);
    if (!parsed.success) {
        return jsonError("Invalid job status", 400);
    }

    // Validate the transition against the pure state machine.
    try {
        assertValidJobTransition(job.status, parsed.data);
    } catch {
        return jsonError(`Cannot transition job from ${job.status} to ${parsed.data}`, 409);
    }

    const updated = await store.transition(id, parsed.data);
    return NextResponse.json({ job: updated });
}
