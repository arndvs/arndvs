import { describe, expect, it } from "vitest";

import {
    DEFAULT_MAX_JOB_AGE_HOURS,
    DEFAULT_MINIMUM_JOB_REVIEW_SCORE,
    scoreJob,
    scoreJobs,
} from "./job-scoring";
import type { JobCandidate, JobScoringConfig } from "./job-types";

const baseProfile = {
    titles: ["Forward Deployed Engineer", "Applied AI Engineer"],
    skills: ["rag", "agents", "python"],
    locations: ["San Diego", "Remote"],
    workTypes: ["remote", "hybrid", "on-site"] as const,
};

const baseConfig: JobScoringConfig = {
    profile: baseProfile,
    companyTiers: { anthropic: 10, openai: 10 },
};

function job(overrides: Partial<JobCandidate> = {}): JobCandidate {
    return {
        url: "https://www.linkedin.com/jobs/view/1",
        title: "Forward Deployed Engineer",
        company: "TestCo",
        location: "San Diego, CA",
        workType: "hybrid",
        ageHours: 10,
        ...overrides,
    };
}

describe("scoreJob — fit scoring", () => {
    it("rewards an exact title match", () => {
        const result = scoreJob(job(), baseConfig);
        expect(result.score).toBeGreaterThanOrEqual(50);
        expect(result.decision).toBe("review");
        expect(result.reasons.some((r) => r.includes("Title match"))).toBe(true);
    });

    it("rejects a completely unrelated title", () => {
        const result = scoreJob(
            job({ title: "Janitor", company: "Cleaning Co", location: "Ohio" }),
            baseConfig,
        );
        expect(result.decision).toBe("reject");
        expect(result.score).toBeLessThan(DEFAULT_MINIMUM_JOB_REVIEW_SCORE);
    });

    it("gives partial credit for a title keyword hit", () => {
        const result = scoreJob(job({ title: "Senior Engineer - Applied AI" }), baseConfig);
        expect(result.score).toBeGreaterThan(0);
    });

    it("adds skill match points", () => {
        const result = scoreJob(job({ title: "Applied AI Engineer (Python, RAG)" }), baseConfig);
        const skillReason = result.reasons.find((r) => r.includes("Skill match"));
        expect(skillReason).toBeTruthy();
    });
});

describe("scoreJob — location", () => {
    it("gives a strong bonus for an exact preferred location", () => {
        const result = scoreJob(job({ location: "San Diego, CA" }), baseConfig);
        expect(result.reasons.some((r) => r.includes("Location: in San Diego"))).toBe(true);
    });

    it("gives a smaller bonus for a broad region match", () => {
        const result = scoreJob(job({ location: "United States (Remote)" }), baseConfig);
        // "Remote" is a preferred location in the profile → exact-match branch.
        expect(result.reasons.some((r) => r.includes("Location: in Remote"))).toBe(true);
    });

    it("gives a broad-region bonus when no preferred location matches", () => {
        const noRemoteProfile = { ...baseProfile, locations: ["San Diego"] };
        const result = scoreJob(job({ location: "United States (Remote)" }), {
            ...baseConfig,
            profile: noRemoteProfile,
        });
        expect(result.reasons.some((r) => r.includes("Broad region"))).toBe(true);
    });

    it("scores 0 for a far location but can still reach review on title alone", () => {
        const result = scoreJob(job({ location: "Berlin, Germany" }), baseConfig);
        expect(result.reasons.some((r) => r.includes("Location: Berlin"))).toBe(true);
        expect(result.decision).toBe("review");
    });
});

describe("scoreJob — work type", () => {
    it("bonuses remote jobs", () => {
        const result = scoreJob(job({ workType: "remote" }), baseConfig);
        expect(result.reasons.some((r) => r === "Remote")).toBe(true);
    });

    it("hard-rejects a work type outside the profile", () => {
        const strict = {
            ...baseConfig,
            profile: { ...baseProfile, workTypes: ["remote"] as const },
        };
        const result = scoreJob(job({ workType: "on-site" }), strict);
        expect(result.decision).toBe("reject");
        expect(result.score).toBe(0);
    });
});

describe("scoreJob — recency", () => {
    it("bonuses fresh postings", () => {
        const result = scoreJob(job({ ageHours: 5 }), baseConfig);
        expect(result.reasons.some((r) => r.includes("Posted within 24h"))).toBe(true);
    });

    it("hard-rejects stale postings", () => {
        const result = scoreJob(job({ ageHours: DEFAULT_MAX_JOB_AGE_HOURS + 1 }), baseConfig);
        expect(result.decision).toBe("reject");
        expect(result.score).toBe(0);
    });

    it("flags needs-verification when age is unknown but score qualifies", () => {
        const result = scoreJob(job({ ageHours: undefined }), baseConfig);
        expect(result.decision).toBe("needs-verification");
    });
});

describe("scoreJobs", () => {
    it("scores a list, mixing in a company tier bonus", () => {
        const results = scoreJobs(
            [
                job({ company: "Anthropic" }),
                job({ title: "Janitor", ageHours: DEFAULT_MAX_JOB_AGE_HOURS + 5 }),
            ],
            baseConfig,
        );
        expect(results).toHaveLength(2);
        expect(results[0]?.decision).toBe("review");
        expect(results[0]?.reasons.some((r) => r.includes("Company tier"))).toBe(true);
        expect(results[0]?.score).toBeGreaterThan(50);
        expect(results[1]?.decision).toBe("reject");
    });
});
