import { draftJobApplication } from "./job-drafter";
import { JOB_ROLE_PROFILE } from "./job-profile";
import { type JobPostingStore } from "./job-store";
import { type JobPostingRecord } from "./job-types";
import { canDispatchJob, canDraftApplication } from "./policy";
import { type SocialDraftStore } from "./types";

/**
 * Job dispatch — the single named handoff layer for saved jobs.
 *
 * A saved job leaves the review queue through exactly two human-gated
 * handoffs, and both used to own the shared business logic separately:
 *
 *   - "application" — draft a cover note into the socialDraft queue
 *     (sourceType: "job"), flipping the job saved → applied.
 *   - "followup"    — dispatch to a hidden cmd-private follow-up issue
 *     labeled agent:prep, recording followUpIssueUrl.
 *
 * This module owns the contract end-to-end: the saved-gate, idempotency,
 * mutual exclusion between the two handoffs, and the atomic ordering of
 * status mutation + external side effect (with a compensating rollback
 * when the side effect fails).
 *
 * Refs #64
 */

export type JobDispatchKind = "application" | "followup";

export interface DispatchResult {
    job: JobPostingRecord;
    /** The socialDraft created by an "application" dispatch. */
    draft?: { _id: string; status: string };
    /** The follow-up issue URL recorded by a "followup" dispatch. */
    issueUrl?: string;
    /** True when the dispatch was a no-op (already dispatched). */
    alreadyDispatched: boolean;
}

export interface DispatchDeps {
    jobStore: JobPostingStore;
    draftStore: SocialDraftStore;
    /** Create a follow-up issue; returns its URL. Overridable in tests. */
    createFollowUpIssue?: (job: JobPostingRecord) => Promise<string>;
    /** Draft an application cover note. Overridable in tests. */
    draftApplication?: (job: JobPostingRecord) => Promise<{ body: string }>;
}

/** Default follow-up issue creator — hits the GitHub API. */
async function createFollowUpIssue(job: JobPostingRecord): Promise<string> {
    const token = process.env.AGENT_PAT;
    if (!token) {
        throw new Error("AGENT_PAT is not configured");
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
        throw new Error(`GitHub create failed (${res.status}): ${errText}`);
    }

    const issue = (await res.json()) as { html_url: string };
    return issue.html_url;
}

/** Default application drafter — calls the OpenAI-backed job drafter. */
async function defaultDraftApplication(job: JobPostingRecord): Promise<{ body: string }> {
    return draftJobApplication(
        {
            url: job.url,
            title: job.title,
            company: job.company,
            location: job.location,
            workType: job.workType,
            salary: job.salary,
        },
        JOB_ROLE_PROFILE,
    );
}

/**
 * Dispatch a saved job toward one of the two human-approved handoffs.
 *
 * Idempotent: re-dispatching a job that already went down a path returns
 * the existing artifact (no duplicate draft / issue). Mutually exclusive:
 * a job dispatched to a follow-up issue cannot also be drafted for
 * application, and vice-versa.
 *
 * Throws on invariant violations (non-saved job, missing deps). The caller
 * (route handler) maps errors to HTTP responses.
 */
export async function dispatchJob(
    id: string,
    kind: JobDispatchKind,
    deps: DispatchDeps,
): Promise<DispatchResult> {
    const { jobStore, draftStore } = deps;
    const job = await jobStore.getById(id);
    if (!job) throw new Error("Job posting not found");

    // ── Idempotency + mutual exclusion ─────────────────────────────────────
    if (kind === "application") {
        // Already applied → idempotent no-op (the draft was already created).
        if (job.status === "applied") {
            return { job, alreadyDispatched: true };
        }
        // Dispatched to a follow-up issue → refuse application drafting.
        if (!canDraftApplication(job)) {
            throw new Error("Only saved jobs can be drafted for application");
        }
    } else {
        // Already dispatched → return the existing issue (idempotent no-op).
        if (job.followUpIssueUrl) {
            return { job, issueUrl: job.followUpIssueUrl, alreadyDispatched: true };
        }
        // Applied → refuse follow-up dispatch (mutual exclusion).
        if (!canDispatchJob(job.status, job.followUpIssueUrl)) {
            throw new Error("Only saved jobs can be dispatched for follow-up");
        }
    }

    // ── Execute the handoff ────────────────────────────────────────────────
    if (kind === "application") {
        const draftApplication = deps.draftApplication ?? defaultDraftApplication;
        const draft = await draftApplication(job);

        // Transition saved → applied BEFORE persisting, so a failure here
        // leaves no orphan draft.
        let applied: JobPostingRecord;
        try {
            applied = await jobStore.transition(id, "applied");
        } catch {
            throw new Error("Job is no longer in a draftable state");
        }

        let created;
        try {
            created = await draftStore.create({
                platform: "linkedin",
                contentType: "post",
                body: draft.body,
                sourceType: "job",
                score: job.score,
                targetPerson: job.company,
                sourceDigestId: job._id,
            });
        } catch {
            // Compensating rollback: applied → saved is now a legal
            // transition (refs #64). Best-effort — if it fails the job is
            // stranded, but the map no longer forbids the recovery path.
            try {
                await jobStore.transition(id, "saved");
            } catch {
                // Surface the original failure; the rollback is best-effort.
            }
            throw new Error("Failed to persist draft");
        }

        return { job: applied, draft: created, alreadyDispatched: false };
    }

    // ── followup ───────────────────────────────────────────────────────────
    const createIssue = deps.createFollowUpIssue ?? createFollowUpIssue;
    let issueUrl: string;
    try {
        issueUrl = await createIssue(job);
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : "Failed to create follow-up issue");
    }

    const updated = await jobStore.setFollowUpIssueUrl(id, issueUrl);
    return { job: updated, issueUrl, alreadyDispatched: false };
}
