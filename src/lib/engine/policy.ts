import {
    type SocialDraftStatus,
    isSendable as contractIsSendable,
    isValidSocialDraftTransition,
} from "@arndvs/contracts";

import type { JobPostingRecord, JobStatus } from "./job-types";

/**
 * Ops policy — the single place where the state machines (job + socialDraft)
 * are interpreted for the API.
 *
 * Every status-based decision the wire routes need lives here as a named,
 * capability-style predicate. Routes stop string-comparing statuses and ask
 * "can I do X to this record now?" instead. The decision logic sits next to
 * the state machine it interprets, so a machine change is a one-file edit
 * with a full predicate test matrix.
 *
 * Refs #66
 */

// ── Job lifecycle ────────────────────────────────────────────────────────────

/** A discovered job may be saved (human gate: review before saving). */
export function canSaveJob(status: JobStatus): boolean {
    return status === "discovered";
}

/** A saved job may be dispatched for follow-up (no issue created yet). */
export function canDispatchJob(status: JobStatus, followUpIssueUrl?: string): boolean {
    return status === "saved" && !followUpIssueUrl;
}

/** A saved job may have an application drafted (no issue, no existing draft). */
export function canDraftApplication(job: JobPostingRecord): boolean {
    return job.status === "saved" && !job.followUpIssueUrl;
}

// ── SocialDraft lifecycle ────────────────────────────────────────────────────

/** A draft may transition to `to` per the shared state machine. */
export function canTransitionDraft(from: SocialDraftStatus, to: SocialDraftStatus): boolean {
    return isValidSocialDraftTransition(from, to);
}

/** A draft may be edited when it is draft or editing (not yet approved). */
export function isEditable(status: SocialDraftStatus): boolean {
    return status === "draft" || status === "editing";
}

/** A draft may be approved (moved to ready) when it is editing or ready. */
export function isApprovable(status: SocialDraftStatus): boolean {
    return status === "editing" || status === "ready";
}

/** A draft may be sent only when it is ready — delegates to the contracts helper. */
export function isSendable(status: SocialDraftStatus): boolean {
    return contractIsSendable(status);
}

/** A draft may be rejected (skipped) unless it is already terminal. */
export function isRejectable(status: SocialDraftStatus): boolean {
    return status !== "posted" && status !== "skipped";
}
