import { NextRequest, NextResponse } from "next/server";

import { jsonError, requireApiAuth } from "@/lib/api-auth";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/ops/jobs/[id]/to-issue
 *
 * Dispatches a saved job to a hidden follow-up issue in the private
 * `cmd-private` repo, labeled `agent:prep`. An agent can then pick it up
 * to research the company and draft outreach — never to apply.
 *
 * Idempotent: if the job already has a followUpIssueUrl, returns it (409
 * would be wrong — re-dispatch is a no-op, not an error).
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
    const auth = await requireApiAuth(request);
    if ("response" in auth) return auth.response;

    const { id } = await params;
    const store = createSanityJobPostingStore();
    const job = await store.getById(id);
    if (!job) return jsonError("Job posting not found", 404);

    // Only saved jobs can be dispatched for follow-up (human gate).
    if (job.status !== "saved") {
        return jsonError("Only saved jobs can be dispatched for follow-up", 400);
    }

    // Idempotent — already dispatched.
    if (job.followUpIssueUrl) {
        return NextResponse.json({ job, issueUrl: job.followUpIssueUrl });
    }

    const token = process.env.AGENT_PAT;
    if (!token) {
        return jsonError("AGENT_PAT is not configured", 500);
    }

    const repo = process.env.JOB_FOLLOWUP_REPO ?? "arndvs/cmd-private";
    const label = process.env.JOB_FOLLOWUP_LABEL ?? "agent:prep";

    const title = `Job: ${job.company ?? "Unknown"} — ${job.title}`;
    const body = [
        `## Job follow-up (prep only — never apply)`,
        ``,
        `**Role:** ${job.title}`,
        `**Company:** ${job.company ?? "Unknown"}`,
        job.location ? `**Location:** ${job.location}` : null,
        job.workType ? `**Work type:** ${job.workType}` : null,
        job.salary ? `**Salary:** ${job.salary}` : null,
        job.url ? `**Posting:** ${job.url}` : null,
        `**Fit score:** ${job.score}`,
        ``,
        `**Task:** Research the company and role, then draft an outreach note and talking points.`,
        `**Never send or apply** — output lands in the socialDraft queue for human review.`,
        ``,
        `Sanity job id: \`${job._id}\``,
    ]
        .filter((l): l is string => l !== null)
        .join("\n");

    try {
        const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
            body: JSON.stringify({ title, body, labels: [label] }),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("to-issue: GitHub create failed", res.status, errText);
            return jsonError("Failed to create follow-up issue", 502);
        }

        const issue = (await res.json()) as { html_url: string };
        const updated = await store.setFollowUpIssueUrl(id, issue.html_url);
        return NextResponse.json({ job: updated, issueUrl: issue.html_url }, { status: 201 });
    } catch (err) {
        console.error("to-issue: unexpected error", err);
        return jsonError("Failed to create follow-up issue", 500);
    }
}
