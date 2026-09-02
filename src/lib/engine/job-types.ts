import { z } from "zod";

/**
 * Job Scout — domain types.
 *
 * The job scout discovers LinkedIn job postings via the local
 * linkedin-mcp-server (streamable-http daemon), scores them for role fit,
 * persists them as Sanity `jobPosting` docs, and queues application
 * drafts for human review. v1 is research-only: it never applies.
 */

/** A job posting found by discovery, before scoring. */
export interface JobCandidate {
    /** LinkedIn job permalink. */
    url: string;
    /** Role title as posted. */
    title: string;
    /** Company or organization name. */
    company?: string;
    /** Seniority level from title (e.g. "Senior", "Staff"). */
    level?: string;
    /** Work model: on-site / hybrid / remote. */
    workType?: "on-site" | "hybrid" | "remote";
    /** Location string from the posting. */
    location?: string;
    /** Salary band if visible (raw text). */
    salary?: string;
    /** Posted age in hours (undefined = unverified). */
    ageHours?: number;
    /** Whether the posting offers Easy Apply. */
    easyApply?: boolean;
    /** Extraction source (search result text, date sort). */
    source?: string;
}

/** Job scout search target — one keyword/company query. */
export interface JobSearchTarget {
    /** Free-text keywords (title + skill terms). */
    keywords: string;
    /** Optional location filter. */
    location?: string;
}

/** Decision from the role-fit litmus test. */
export const JOB_SCORING_DECISIONS = ["review", "reject", "needs-verification"] as const;
export const jobScoringDecisionSchema = z.enum(JOB_SCORING_DECISIONS);
export type JobScoringDecision = z.infer<typeof jobScoringDecisionSchema>;

/** A scored job — ready for the review queue. */
export interface ScoredJob {
    candidate: JobCandidate;
    score: number;
    decision: JobScoringDecision;
    /** Why it scored this way — for the review queue UI. */
    reasons: string[];
}

/** Role-fit profile — the collection of titles/skills you're a fit for. */
export interface RoleFitProfile {
    /** Authority titles to match (e.g. "Forward Deployed Engineer"). */
    titles: readonly string[];
    /** Skills/keywords to match. */
    skills: readonly string[];
    /** Preferred locations. */
    locations: readonly string[];
    /** Work models you accept. */
    workTypes?: readonly ("on-site" | "hybrid" | "remote")[];
}

export interface JobScoringConfig {
    /** Max job age in hours before hard reject (default 168h = 7d). */
    maxAgeHours?: number;
    /** Minimum score to reach "review" (default 50). */
    minimumReviewScore?: number;
    /** Role-fit profile to score against. */
    profile: RoleFitProfile;
    /** Company tiers for bonus scoring. */
    companyTiers?: Record<string, number>;
}

/** Job posting status lifecycle. */
export const JOB_STATUSES = ["discovered", "saved", "applied", "skip", "expired"] as const;
export const jobStatusSchema = z.enum(JOB_STATUSES);
export type JobStatus = z.infer<typeof jobStatusSchema>;

/** Valid job status transitions (pure state machine, mirrors socialDraft). */
export const VALID_JOB_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    discovered: ["saved", "skip", "expired"],
    saved: ["applied", "skip", "expired"],
    applied: ["skip"],
    skip: [],
    expired: [],
};

/** A job posting persisted in Sanity. */
export interface JobPostingRecord {
    _id: string;
    title: string;
    company?: string;
    level?: string;
    workType?: "on-site" | "hybrid" | "remote";
    location?: string;
    salary?: string;
    url: string;
    status: JobStatus;
    score: number;
    reasons: string[];
    ageHours?: number;
    easyApply?: boolean;
    source?: string;
    discoveredAt: string;
}

/** Pure transition validator — mirrors socialDraft's assertValidTransition. */
export function assertValidJobTransition(from: JobStatus, to: JobStatus): void {
    if (!VALID_JOB_TRANSITIONS[from]?.includes(to)) {
        throw new Error(
            `Invalid job transition: ${from} -> ${to}. Allowed: ${VALID_JOB_TRANSITIONS[from]?.join(", ") ?? "none"}`,
        );
    }
}
