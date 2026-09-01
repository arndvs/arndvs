import type {
    JobCandidate,
    JobScoringConfig,
    JobScoringDecision,
    RoleFitProfile,
    ScoredJob,
} from "./job-types";

/**
 * Pure role-fit litmus test for LinkedIn job postings.
 *
 * Mirrors the conversation scoring in scoring.ts: hard rejections return
 * score 0, then additive scoring capped at 100. Pure (no I/O) so every
 * branch is unit-testable.
 */

export const DEFAULT_MAX_JOB_AGE_HOURS = 168; // 7 days
export const DEFAULT_MINIMUM_JOB_REVIEW_SCORE = 50;
const MAX_SCORE = 100;

function norm(s: string | undefined): string {
    return (s ?? "").toLowerCase();
}

/**
 * Fit scoring — how strongly the title/company/location match the role-fit
 * profile. Title match is the strongest signal, then skills, then location.
 */
function scoreFit(candidate: JobCandidate, profile: RoleFitProfile): [number, string[]] {
    const title = norm(candidate.title);
    const company = norm(candidate.company);
    const location = norm(candidate.location);
    const workType = norm(candidate.workType);

    const reasons: string[] = [];
    let points = 0;

    // Title match — up to 45.
    const titleMatch = profile.titles.find((t) => title.includes(norm(t)));
    if (titleMatch) {
        points += 45;
        reasons.push(`Title match: "${titleMatch}"`);
    } else {
        // Partial: any title keyword present?
        const words = title.split(/[^a-z0-9]+/).filter(Boolean);
        const hits = words.filter((w) =>
            profile.titles.some((t) => norm(t).includes(w) && w.length > 3),
        );
        if (hits.length > 0) {
            points += 18;
            reasons.push(`Partial title match: ${hits.slice(0, 3).join(", ")}`);
        }
    }

    // Skill match — up to 15.
    const skillHits = profile.skills.filter((s) => title.includes(norm(s)));
    if (skillHits.length > 0) {
        points += Math.min(15, skillHits.length * 5);
        reasons.push(`Skill match: ${skillHits.slice(0, 3).join(", ")}`);
    }

    // Work type — remote is always preferred, hybrid/on-site acceptable.
    if (workType === "remote") {
        points += 10;
        reasons.push("Remote");
    }

    return [Math.min(45 + 15 + 10, points), reasons];
}

/**
 * Location scoring — matches a preferred location exactly, or grants a
 * smaller bonus when the location is a state/country the profile allows
 * (e.g. "United States" for a remote-first profile).
 */
function scoreLocation(candidate: JobCandidate, profile: RoleFitProfile): [number, string[]] {
    if (!candidate.location) return [0, ["Location unverified"]];
    const location = norm(candidate.location);

    for (const pref of profile.locations) {
        if (location.includes(norm(pref))) {
            return [15, [`Location: in ${pref}`]];
        }
    }
    // Broad region match ("United States", "Remote - US").
    if (location.includes("united states") || location.includes("remote")) {
        return [8, [`Broad region: ${candidate.location}`]];
    }
    return [0, [`Location: ${candidate.location}`]];
}

/**
 * Recency scoring — fresher postings score higher; older ones decay.
 */
function scoreRecency(ageHours: number | undefined): [number, string[]] {
    if (ageHours === undefined) return [0, ["Age unverified"]];
    if (ageHours <= 24) return [20, ["Posted within 24h"]];
    if (ageHours <= 72) return [14, ["Posted within 3 days"]];
    if (ageHours <= DEFAULT_MAX_JOB_AGE_HOURS) return [6, ["Posted within a week"]];
    return [0, []];
}

/**
 * Company tier bonus — curated target companies score extra.
 */
function scoreCompany(candidate: JobCandidate, config: JobScoringConfig): [number, string[]] {
    if (!candidate.company || !config.companyTiers) return [0, []];
    const name = norm(candidate.company);
    for (const [company, tier] of Object.entries(config.companyTiers)) {
        if (name.includes(norm(company))) {
            return [tier, [`Company tier: ${company} (+${tier})`]];
        }
    }
    return [0, []];
}

/**
 * Hard rejections — score 0, cannot reach review.
 */
function hardRejections(candidate: JobCandidate, config: JobScoringConfig): [boolean, string[]] {
    const reasons: string[] = [];
    const maxAge = config.maxAgeHours ?? DEFAULT_MAX_JOB_AGE_HOURS;

    if (candidate.ageHours !== undefined && candidate.ageHours > maxAge) {
        reasons.push(`Stale: over ${maxAge}h old`);
        return [true, reasons];
    }

    // If the profile restricts work types and none match, reject.
    const allowed = config.profile.workTypes;
    if (allowed && candidate.workType && !allowed.includes(candidate.workType)) {
        reasons.push(`Work type not accepted: ${candidate.workType}`);
        return [true, reasons];
    }

    return [false, reasons];
}

/**
 * The role-fit litmus test — score a candidate job posting.
 */
export function scoreJob(candidate: JobCandidate, config: JobScoringConfig): ScoredJob {
    const reasons: string[] = [];

    // Hard rejections first.
    const [rejected, rejectReasons] = hardRejections(candidate, config);
    if (rejected) {
        return { candidate, score: 0, decision: "reject", reasons: rejectReasons };
    }

    // Additive scoring, capped at 100.
    const [fitPoints, fitReasons] = scoreFit(candidate, config.profile);
    const [locPoints, locReasons] = scoreLocation(candidate, config.profile);
    const [recencyPoints, recencyReasons] = scoreRecency(candidate.ageHours);
    const [companyPoints, companyReasons] = scoreCompany(candidate, config);

    reasons.push(...fitReasons, ...locReasons, ...recencyReasons, ...companyReasons);
    const score = Math.min(MAX_SCORE, fitPoints + locPoints + recencyPoints + companyPoints);

    const minimumReview = config.minimumReviewScore ?? DEFAULT_MINIMUM_JOB_REVIEW_SCORE;
    const decision: JobScoringDecision = score >= minimumReview ? "review" : "reject";

    // If it scored to review but we couldn't verify age, flag it.
    if (decision === "review" && candidate.ageHours === undefined) {
        return { candidate, score, decision: "needs-verification", reasons };
    }

    return { candidate, score, decision, reasons };
}

/**
 * Convenience — score a list of job candidates.
 */
export function scoreJobs(candidates: JobCandidate[], config: JobScoringConfig): ScoredJob[] {
    return candidates.map((candidate) => scoreJob(candidate, config));
}
