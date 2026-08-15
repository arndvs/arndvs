import { z } from "zod";

/**
 * System B — comment scout types.
 *
 * The scout discovers LinkedIn conversations, scores them with a litmus
 * test (fit / recency / openness / safety), and drafts a substantive
 * comment for human review. v1 is research-only: it never posts.
 */

/** A LinkedIn conversation found by discovery, before scoring. */
export interface ConversationCandidate {
    /** LinkedIn post URL (permalink). */
    url: string;
    /** Author display name. */
    author: string;
    /** Author's headline / role. */
    authorHeadline?: string;
    /** Post text (title + excerpt). */
    text: string;
    /** Author's company, if known. */
    company?: string;
    /** Post age in hours (undefined = unverified). */
    ageHours?: number;
    /** Known comment count (undefined = unverified). */
    commentCount?: number;
    /** Authority-pillar keywords matched in the text. */
    matchedPillars?: string[];
}

/** Decision from the litmus test. */
export const SCORING_DECISIONS = ["review", "reject", "needs-verification"] as const;
export const scoringDecisionSchema = z.enum(SCORING_DECISIONS);
export type ScoringDecision = z.infer<typeof scoringDecisionSchema>;

/** A scored conversation — ready for the review queue or drafting. */
export interface ScoredConversation {
    candidate: ConversationCandidate;
    score: number;
    decision: ScoringDecision;
    /** Why it scored this way — for the review queue UI. */
    reasons: string[];
    /** True when the author is on the curated target list. */
    isTarget?: boolean;
}

export interface ScoringConfig {
    /** Max post age in hours before hard reject (default 48h = "be early"). */
    maxAgeHours?: number;
    /** Minimum score to reach "review" (default 45). */
    minimumReviewScore?: number;
    /** The authority pillars to match against. */
    pillars: string[];
}
