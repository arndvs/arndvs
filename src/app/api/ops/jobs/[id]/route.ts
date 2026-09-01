import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { type JobStatus, assertValidJobTransition } from "@/lib/engine/job-types";

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

    const body = (await request.json()) as { status?: JobStatus };
    if (!body.status) return jsonError("status is required", 400);

    // Validate the transition against the pure state machine.
    assertValidJobTransition(job.status, body.status);

    const updated = await store.transition(id, body.status);
    return NextResponse.json({ job: updated });
}
