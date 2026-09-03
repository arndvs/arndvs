import { describe, expect, it, vi } from "vitest";

import { runJobScout } from "./job-scout";
import type { JobCandidate, JobScoringConfig, JobSearchTarget } from "./job-types";
import type { LinkedInJobsClient } from "./linkedin-jobs-client";

const PROFILE: JobScoringConfig["profile"] = {
    titles: ["Forward Deployed Engineer", "Applied AI Engineer"],
    skills: ["rag", "agents", "python"],
    locations: ["San Diego", "Remote"],
    workTypes: ["remote", "hybrid", "on-site"],
};

const TARGETS: JobSearchTarget[] = [{ keywords: "forward deployed engineer" }];

const THREE_TARGETS: JobSearchTarget[] = [
    { keywords: "forward deployed engineer" },
    { keywords: "forward deployed engineer" },
    { keywords: "applied ai engineer" },
];

function candidate(overrides: Partial<JobCandidate> = {}): JobCandidate {
    return {
        url: "",
        title: "Forward Deployed Engineer",
        company: "Acme",
        location: "Remote",
        workType: "remote",
        ...overrides,
    };
}

function makeClient(results: JobCandidate[][]): LinkedInJobsClient {
    return {
        searchJobs: vi.fn(async () => results.shift() ?? []),
        getJobDetails: vi.fn(async () => null),
    };
}

describe("runJobScout", () => {
    it("dedupes candidates across targets by composite key", async () => {
        const client = makeClient([
            [candidate({ title: "Forward Deployed Engineer", company: "Acme" })],
            [candidate({ title: "Forward Deployed Engineer", company: "Acme" })], // same job
            [candidate({ title: "Applied AI Engineer", company: "Beta" })],
        ]);
        const result = await runJobScout(
            client,
            async () => false,
            async () => ({ created: true }),
            { scoring: { profile: PROFILE }, targets: THREE_TARGETS },
        );
        expect(result.candidates.length).toBe(2);
    });

    it("persists only review-qualifying jobs, up to maxPersist, counting store hits as deduped", async () => {
        const persistedClient = makeClient([
            [
                candidate({ title: "Forward Deployed Engineer", company: "Acme" }),
                candidate({ title: "Applied AI Engineer", company: "Beta" }),
                candidate({ title: "Unrelated Role", company: "Gamma" }), // scores low → rejected
            ],
        ]);
        const persist = vi.fn(async () => ({ created: true }));
        const persisted = await runJobScout(persistedClient, async () => false, persist, {
            scoring: { profile: PROFILE },
            targets: TARGETS,
            maxPersist: 1,
        });
        expect(persist).toHaveBeenCalledTimes(1);
        expect(persisted.persisted).toBe(1);
        expect(persisted.deduped).toBe(0);

        const dedupedClient = makeClient([[candidate({ company: "Acme" })]]);
        const dedupe = vi.fn(async () => true); // already stored
        const deduped = await runJobScout(dedupedClient, dedupe, persist, {
            scoring: { profile: PROFILE },
            targets: TARGETS,
        });
        expect(persist).not.toHaveBeenCalledTimes(2);
        expect(deduped.deduped).toBe(1);
        expect(deduped.persisted).toBe(0);
    });

    it("passes needs-verification jobs through to the review queue", async () => {
        const client = makeClient([[candidate({ ageHours: undefined })]]);
        const result = await runJobScout(
            client,
            async () => false,
            async () => ({ created: true }),
            {
                scoring: { profile: PROFILE },
                targets: TARGETS,
            },
        );
        expect(result.scored.some((s) => s.decision === "needs-verification")).toBe(true);
    });
});
