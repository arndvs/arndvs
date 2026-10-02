import type { JobSearchTarget, RoleFitProfile } from "./job-types";

/**
 * Role-fit profile — the single source of truth for "what Aaron qualifies
 * for". Mirrors the cmd role-fit collection.
 *
 * Import this everywhere the profile was previously re-declared
 * (scripts/job-scout.ts, the draft-application route) so scoring and
 * drafting read the same definition.
 */
export const JOB_ROLE_PROFILE: RoleFitProfile = {
    titles: [
        "Forward Deployed Engineer",
        "Applied AI Engineer",
        "Senior Full Stack Engineer",
        "AI Agent",
        "Software Engineering Generalist",
        "AI Solutions Engineer",
        "Senior Software Engineer",
    ],
    skills: ["rag", "agents", "copilot", "llm", "python", "typescript", "react", "next.js"],
    locations: ["San Diego", "Remote"],
    workTypes: ["remote", "hybrid", "on-site"],
};

/** Company tiers for bonus scoring — higher = stronger fit signal. */
export const JOB_COMPANY_TIERS: Record<string, number> = {
    anthropic: 12,
    openai: 12,
    adobe: 10,
    "flock freight": 8,
    vercel: 8,
    linear: 8,
    sanity: 8,
    runway: 8,
    "@cursor": 8,
};

/** Search targets — one keyword/company query per authority title. */
export const JOB_SEARCH_TARGETS: JobSearchTarget[] = [
    { keywords: "forward deployed engineer" },
    { keywords: "applied ai engineer" },
    { keywords: "ai agent engineer" },
    { keywords: "senior full stack engineer" },
    { keywords: "ai solutions engineer" },
    { keywords: "software engineering generalist" },
];
