import { type SanityClient, createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "@/sanity/env";

import {
    type JobPostingRecord,
    type JobStatus,
    type ScoredJob,
    assertValidJobTransition,
} from "./job-types";
export { assertValidJobTransition } from "./job-types";

/**
 * Sanity-backed job posting store.
 *
 * Persists scored LinkedIn jobs as `jobPosting` docs. The status lifecycle
 * is driven by the pure transition map; this layer is a mechanical
 * translation, never business logic. Applications flow into socialDraft
 * (see createSanitySocialDraftStore) — this store never applies.
 */

export interface JobPostingStore {
    /** Persist a scored job if it's not already stored (dedupe by URL). */
    upsert(scored: ScoredJob): Promise<{ created: boolean; id: string }>;
    /** List job postings, optionally by status. */
    listByStatus(status?: JobStatus): Promise<JobPostingRecord[]>;
    /** Get a single job posting by id. */
    getById(id: string): Promise<JobPostingRecord | null>;
    /** Transition status (validates against the pure state machine). */
    transition(id: string, to: JobStatus): Promise<JobPostingRecord>;
    /** Get a job posting by its LinkedIn URL (dedupe check). */
    findByUrl(url: string): Promise<JobPostingRecord | null>;
}

function getWriteClient(): SanityClient {
    const token = process.env.SANITY_API_TOKEN;
    if (!token) throw new Error("Missing environment variable: SANITY_API_TOKEN");
    return createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
    });
}

function toRecord(doc: Record<string, unknown>): JobPostingRecord {
    return {
        _id: String(doc._id),
        title: String(doc.title ?? "Untitled"),
        company: doc.company as string | undefined,
        level: doc.level as string | undefined,
        workType: doc.workType as JobPostingRecord["workType"],
        location: doc.location as string | undefined,
        salary: doc.salary as string | undefined,
        url: String(doc.url ?? ""),
        status: doc.status as JobStatus,
        score: doc.score as number,
        reasons: Array.isArray(doc.reasons) ? (doc.reasons as string[]) : [],
        ageHours: doc.ageHours as number | undefined,
        easyApply: doc.easyApply as boolean | undefined,
        source: doc.source as string | undefined,
        discoveredAt: doc.discoveredAt as string,
    };
}

export function createSanityJobPostingStore(): JobPostingStore {
    const client = getWriteClient();

    async function findByUrl(url: string): Promise<JobPostingRecord | null> {
        const found = await client.fetch<Record<string, unknown> | null>(
            `*[_type == "jobPosting" && url == $url][0]`,
            { url },
        );
        return found ? toRecord(found) : null;
    }

    return {
        async upsert(scored) {
            const existing = await findByUrl(scored.candidate.url);
            if (existing) return { created: false, id: existing._id };

            const doc = await client.create({
                _type: "jobPosting",
                title: scored.candidate.title,
                company: scored.candidate.company,
                level: scored.candidate.level,
                workType: scored.candidate.workType,
                location: scored.candidate.location,
                salary: scored.candidate.salary,
                url: scored.candidate.url,
                status: "discovered",
                score: scored.score,
                reasons: scored.reasons,
                ageHours: scored.candidate.ageHours,
                easyApply: scored.candidate.easyApply,
                source: scored.candidate.source,
                discoveredAt: new Date().toISOString(),
            });
            return { created: true, id: String(doc._id) };
        },

        async listByStatus(status) {
            const query = status
                ? `*[_type == "jobPosting" && status == $status] | order(score desc)`
                : `*[_type == "jobPosting"] | order(score desc)`;
            const docs = await client.fetch<Array<Record<string, unknown>>>(query, { status });
            return docs.map(toRecord);
        },

        async getById(id) {
            const doc = await client.getDocument(id);
            return doc ? toRecord(doc as unknown as Record<string, unknown>) : null;
        },

        async transition(id, to) {
            const current = await client.getDocument(id);
            if (!current) throw new Error(`Job posting not found: ${id}`);
            const from = current.status as JobStatus;
            assertValidJobTransition(from, to);
            const doc = await client.patch(id).set({ status: to }).commit();
            return toRecord(doc as unknown as Record<string, unknown>);
        },

        findByUrl,
    };
}