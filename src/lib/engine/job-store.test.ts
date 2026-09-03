import { describe, expect, it, vi } from "vitest";

import { createSanityJobPostingStoreWithClient } from "./job-store";
import type { ScoredJob } from "./job-types";

function scored(overrides: Partial<ScoredJob["candidate"]> = {}): ScoredJob {
    return {
        candidate: {
            url: "",
            title: "Forward Deployed Engineer",
            company: "Acme",
            location: "Remote",
            ...overrides,
        },
        score: 80,
        decision: "review",
        reasons: ["title match"],
    };
}

/** In-memory fake of the Sanity write client used by the store. */
function makeSanity() {
    const docs = new Map<string, Record<string, unknown>>();
    let seq = 0;

    const client = {
        fetch: vi.fn(async (query: string, params?: { key?: string; status?: string }) => {
            if (query.includes("dedupeKey == $key")) {
                for (const d of docs.values()) {
                    if (d.dedupeKey === params?.key) return { ...d };
                }
                return null;
            }
            if (query.includes("status == $status")) {
                return [...docs.values()]
                    .filter((d) => d.status === params?.status)
                    .map((d) => ({ ...d }));
            }
            return [...docs.values()].map((d) => ({ ...d }));
        }),
        create: vi.fn(async (doc: Record<string, unknown>) => {
            seq += 1;
            const id = `job-${seq}`;
            docs.set(id, { _id: id, ...doc });
            return { _id: id, ...doc };
        }),
        getDocument: vi.fn(async (id: string) => docs.get(id) ?? null),
        patch: vi.fn((id: string) => ({
            set: (fields: Record<string, unknown>) => ({
                commit: async () => {
                    const doc = docs.get(id);
                    if (!doc) throw new Error(`Job posting not found: ${id}`);
                    const next = { ...doc, ...fields };
                    docs.set(id, next);
                    return next;
                },
            }),
        })),
    };
    return { client, docs };
}

describe("createSanityJobPostingStoreWithClient", () => {
    it("upserts a job with a composite dedupeKey and does not duplicate on re-upsert", async () => {
        const { client } = makeSanity();
        const store = createSanityJobPostingStoreWithClient(client as never);
        const { created, id } = await store.upsert(scored());
        expect(created).toBe(true);
        expect(id).toBe("job-1");
        expect(client.create).toHaveBeenCalledWith(
            expect.objectContaining({ dedupeKey: "forward deployed engineer|acme|remote" }),
        );

        const second = await store.upsert(scored());
        expect(second.created).toBe(false);
        expect(client.create).toHaveBeenCalledTimes(1);
    });

    it("treats differently-located jobs as distinct", async () => {
        const { client } = makeSanity();
        const store = createSanityJobPostingStoreWithClient(client as never);
        await store.upsert(scored({ location: "Remote" }));
        const other = await store.upsert(scored({ location: "San Diego" }));
        expect(other.created).toBe(true);
    });

    it("finds by composite key", async () => {
        const { client } = makeSanity();
        const store = createSanityJobPostingStoreWithClient(client as never);
        await store.upsert(scored());
        const found = await store.findByDedupeKey("forward deployed engineer|acme|remote");
        expect(found?.title).toBe("Forward Deployed Engineer");
    });

    it("returns null for a non-jobPosting doc", async () => {
        const { client, docs } = makeSanity();
        docs.set("other", { _id: "other", _type: "socialDraft", title: "x" });
        const store = createSanityJobPostingStoreWithClient(client as never);
        expect(await store.getById("other")).toBeNull();
    });

    it("transitions validate against the job state machine", async () => {
        const { client } = makeSanity();
        const store = createSanityJobPostingStoreWithClient(client as never);
        await store.upsert(scored());
        const saved = await store.transition("job-1", "saved");
        expect(saved.status).toBe("saved");
        await expect(store.transition("job-1", "discovered")).rejects.toThrow(
            /Invalid job transition/,
        );
    });
});
