import { scoreJobs } from "./job-scoring";
import {
    type JobCandidate,
    type JobScoringConfig,
    type JobSearchTarget,
    type ScoredJob,
} from "./job-types";
import type { LinkedInJobsClient } from "./linkedin-jobs-client";

/**
 * The job scout — orchestration.
 *
 * discover → score → persist → (human reviews the queue in the ops
 * console + human applies). Research-only in v1: this module never
 * applies to anything.
 */

export interface JobScoutConfig {
    scoring: JobScoringConfig;
    targets: JobSearchTarget[];
    /** Max results to persist per run (default 15). */
    maxPersist?: number;
}

export interface JobScoutResult {
    candidates: JobCandidate[];
    scored: ScoredJob[];
    persisted: number;
    deduped: number;
}

export async function runJobScout(
    client: LinkedInJobsClient,
    dedupe: (url: string) => Promise<boolean>,
    persist: (scored: ScoredJob) => Promise<{ created: boolean }>,
    config: JobScoutConfig,
): Promise<JobScoutResult> {
    const candidates: JobCandidate[] = [];
    const seen = new Set<string>();

    // 1. Discover — run each search target, dedupe by URL.
    for (const target of config.targets) {
        const results = await client.searchJobs({
            keywords: target.keywords,
            ...(target.location ? { location: target.location } : {}),
        });
        for (const c of results) {
            if (c.url && !seen.has(c.url)) {
                seen.add(c.url);
                candidates.push(c);
            }
        }
    }

    // 2. Score everything.
    const scored = scoreJobs(candidates, config.scoring)
        .filter((s) => s.decision === "review" || s.decision === "needs-verification")
        .sort((a, b) => b.score - a.score);

    // 3. Persist review-qualifying jobs, deduping against the store.
    let persisted = 0;
    let deduped = 0;
    const max = config.maxPersist ?? 15;
    for (const s of scored.slice(0, max)) {
        const alreadyStored = await dedupe(s.candidate.url);
        if (alreadyStored) {
            deduped++;
            continue;
        }
        const { created } = await persist(s);
        if (created) persisted++;
    }

    return { candidates, scored, persisted, deduped };
}
