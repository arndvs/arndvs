import { z } from "zod";

/**
 * Social draft lifecycle — the state machine for the LinkedIn awareness engine.
 *
 * Lifted from Launch Core's `subscription.ts` pattern: an explicit transition
 * map + pure validation function, so invalid transitions are impossible to miss.
 *
 * Statuses:
 *   draft   → created by the engine (content ship or comment scout)
 *   editing → operator is editing in the ops console
 *   ready   → approved, ready to send
 *   posted  → sent to LinkedIn
 *   skipped → rejected / abandoned
 */

export const SOCIAL_DRAFT_STATUSES = ["draft", "editing", "ready", "posted", "skipped"] as const;

export const socialDraftStatusSchema = z.enum(SOCIAL_DRAFT_STATUSES);

export type SocialDraftStatus = z.infer<typeof socialDraftStatusSchema>;

/** Explicit valid transitions — a status can only move to these. */
export const VALID_SOCIAL_DRAFT_TRANSITIONS: Record<
    SocialDraftStatus,
    readonly SocialDraftStatus[]
> = {
    draft: ["draft", "editing", "skipped"],
    editing: ["editing", "ready", "skipped"],
    ready: ["ready", "posted", "skipped"],
    posted: ["posted"],
    skipped: ["skipped"],
};

/** Pure validation — no I/O, trivially testable. */
export function isValidSocialDraftTransition(
    from: SocialDraftStatus,
    to: SocialDraftStatus,
): boolean {
    return VALID_SOCIAL_DRAFT_TRANSITIONS[from].includes(to);
}

/** A draft is sendable only when it has been approved (ready). */
export function isSendable(status: SocialDraftStatus): boolean {
    return status === "ready";
}
