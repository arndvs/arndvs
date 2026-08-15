import type {
    ConversationCandidate,
    ScoredConversation,
    ScoringConfig,
    ScoringDecision,
} from "./comment-scout-types";

/**
 * Pure litmus test for LinkedIn conversations.
 *
 * Lifted from MCRDSE's `reddit_campaign.py` scoring: hard rejections return
 * score 0, then additive scoring capped at 100. Pure (no I/O) so it's
 * trivially unit-testable — every branch has a test.
 */

export const DEFAULT_MAX_AGE_HOURS = 48;
export const DEFAULT_MINIMUM_REVIEW_SCORE = 45;
const MAX_SCORE = 100;

function normalizedPillars(config: ScoringConfig): string[] {
    return config.pillars.map((p) => p.toLowerCase());
}

/**
 * Fit scoring — how strongly the conversation matches an authority pillar.
 * Returns [points, reasons].
 */
function scoreFit(candidate: ConversationCandidate, config: ScoringConfig): [number, string[]] {
    const text =
        `${candidate.text} ${candidate.company ?? ""} ${candidate.authorHeadline ?? ""}`.toLowerCase();
    const pillars = normalizedPillars(config);
    const matched = pillars.filter((p) => text.includes(p));

    if (matched.length === 0) return [0, []];
    // Cap fit at 35, +8 per matched pillar (mirrors MCRDSE intent scoring).
    const points = Math.min(35, 12 + matched.length * 8);
    return [points, [`Fit: matched pillar(s) — ${matched.join(", ")}`]];
}

/**
 * Recency scoring — fresher posts score higher ("be early"). <24h is prime.
 */
function scoreRecency(ageHours: number | undefined): [number, string[]] {
    if (ageHours === undefined) return [0, ["Recency unverified — no points"]];
    if (ageHours <= 24) return [25, ["Fresh: under 24h old"]];
    if (ageHours <= 48) return [18, ["Recent: within 48h"]];
    return [8, ["Older post — fewer eyeballs"]];
}

/**
 * Openness scoring — posts with few comments are more open to a new comment.
 */
function scoreOpenness(commentCount: number | undefined): [number, string[]] {
    if (commentCount === undefined) return [0, ["Comment count unverified — no points"]];
    if (commentCount <= 10) return [18, ["Open conversation: few comments"]];
    if (commentCount <= 30) return [10, ["Moderate engagement"]];
    return [3, ["High comment count — hard to be seen"]];
}

/**
 * Hard rejections — score 0, cannot reach review.
 */
function hardRejections(
    candidate: ConversationCandidate,
    config: ScoringConfig,
): [boolean, string[]] {
    const reasons: string[] = [];
    const maxAge = config.maxAgeHours ?? DEFAULT_MAX_AGE_HOURS;

    if (candidate.ageHours !== undefined && candidate.ageHours > maxAge) {
        reasons.push(`Stale: over ${maxAge}h old`);
        return [true, reasons];
    }

    return [false, reasons];
}

/**
 * The litmus test — score a candidate conversation.
 */
export function scoreConversation(
    candidate: ConversationCandidate,
    config: ScoringConfig,
): ScoredConversation {
    const reasons: string[] = [];

    // Hard rejections first.
    const [rejected, rejectReasons] = hardRejections(candidate, config);
    if (rejected) {
        return {
            candidate,
            score: 0,
            decision: "reject",
            reasons: rejectReasons,
        };
    }

    // Additive scoring, capped at 100.
    const [fitPoints, fitReasons] = scoreFit(candidate, config);
    const [recencyPoints, recencyReasons] = scoreRecency(candidate.ageHours);
    const [opennessPoints, opennessReasons] = scoreOpenness(candidate.commentCount);

    reasons.push(...fitReasons, ...recencyReasons, ...opennessReasons);
    const score = Math.min(MAX_SCORE, fitPoints + recencyPoints + opennessPoints);

    const minimumReview = config.minimumReviewScore ?? DEFAULT_MINIMUM_REVIEW_SCORE;
    const decision: ScoringDecision = score >= minimumReview ? "review" : "reject";

    // If it has pillar fit but we couldn't verify age/count, flag for verification.
    const unverified = candidate.ageHours === undefined || candidate.commentCount === undefined;
    if (decision === "review" && unverified) {
        return {
            candidate,
            score,
            decision: "needs-verification",
            reasons,
            isTarget: undefined,
        };
    }

    return {
        candidate,
        score,
        decision,
        reasons,
        isTarget: undefined,
    };
}

/**
 * Convenience wrapper for scoring a whole list.
 */
export function scoreConversations(
    candidates: ConversationCandidate[],
    config: ScoringConfig,
): ScoredConversation[] {
    return candidates.map((c) => scoreConversation(c, config));
}
