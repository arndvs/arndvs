import { beforeEach, describe, expect, it, vi } from "vitest";

import { dispatchJob } from "./job-dispatch";
import { type JobPostingRecord, type JobStatus, VALID_JOB_TRANSITIONS } from "./job-types";
import type { SocialDraftRecord } from "./types";

/**
 * Job dispatch layer tests (refs #64).
 *
 * Covers the handoff contract: saved-gate, idempotency, mutual exclusion,
 * and the applied → saved compensating rollback.
 */

function job(status: JobStatus, followUpIssueUrl?: string): JobPostingRecord {
    return {
        _id: "j1",
        title: "Engineer",
        company: "Acme",
        url: "https://linkedin.com/jobs/view/1",
        status,
        score: 0.5,
        reasons: [],
        discoveredAt: "2026-09-01T00:00:00Z",
        followUpIssueUrl,
    };
}

function makeDeps(
    overrides: Partial<{
        getById: (id: string) => Promise<JobPostingRecord | null>;
        transition: (id: string, to: JobStatus) => Promise<JobPostingRecord>;
        setFollowUpIssueUrl: (id: string, url: string) => Promise<JobPostingRecord>;
        create: (input: unknown) => Promise<SocialDraftRecord>;
        createFollowUpIssue: (job: JobPostingRecord) => Promise<string>;
        draftApplication: (job: JobPostingRecord) => Promise<{ body: string }>;
    }>,
) {
    const current = { value: job("saved") };
    const draftRecord = (): SocialDraftRecord => ({
        _id: "d1",
        status: "draft",
        platform: "linkedin",
        contentType: "post",
        body: "cover note",
        sourceType: "job",
    });
    const deps = {
        jobStore: {
            upsert: async () => ({ created: false, id: "j1" }),
            listByStatus: async () => [],
            listActionable: async () => [],
            findByDedupeKey: async () => null,
            getById:
                overrides.getById ??
                (async (id: string) => {
                    if (id !== current.value._id) return null;
                    return current.value;
                }),
            transition:
                overrides.transition ??
                (async (id: string, to: JobStatus) => {
                    current.value = { ...current.value, status: to };
                    return current.value;
                }),
            setFollowUpIssueUrl:
                overrides.setFollowUpIssueUrl ??
                (async (id: string, url: string) => {
                    current.value = { ...current.value, followUpIssueUrl: url };
                    return current.value;
                }),
        },
        draftStore: {
            create: overrides.create ?? (async () => draftRecord()),
            getById: async () => null,
            listByStatus: async () => [],
            listActionable: async () => [],
            listAll: async () => [],
            transition: async () => draftRecord(),
            updateBody: async () => draftRecord(),
            markPosted: async (): Promise<SocialDraftRecord> => ({
                ...draftRecord(),
                status: "posted",
            }),
        },
        createFollowUpIssue:
            overrides.createFollowUpIssue ??
            (async () => "https://github.com/arndvs/cmd-private/issues/1"),
        draftApplication: overrides.draftApplication ?? (async () => ({ body: "cover note" })),
    };
    return { deps, current };
}

describe("VALID_JOB_TRANSITIONS", () => {
    it("allows applied → saved as a compensating transition", () => {
        expect(VALID_JOB_TRANSITIONS.applied).toContain("saved");
    });
});

describe("dispatchJob — application", () => {
    beforeEach(() => vi.clearAllMocks());

    it("drafts an application for a saved job and transitions to applied", async () => {
        const { deps, current } = makeDeps({});
        const result = await dispatchJob("j1", "application", deps);

        expect(result.alreadyDispatched).toBe(false);
        expect(result.draft?._id).toBe("d1");
        expect(result.job.status).toBe("applied");
        expect(current.value.status).toBe("applied");
    });

    it("rolls back to saved when the draft persist fails (no stranded applied)", async () => {
        const { deps, current } = makeDeps({
            create: async () => {
                throw new Error("persist failed");
            },
        });

        await expect(dispatchJob("j1", "application", deps)).rejects.toThrow(
            "Failed to persist draft",
        );
        expect(current.value.status).toBe("saved");
    });

    it("is idempotent when the job is already applied", async () => {
        const { deps } = makeDeps({
            getById: async () => job("applied"),
        });

        const result = await dispatchJob("j1", "application", deps);
        expect(result.alreadyDispatched).toBe(true);
        expect(result.job.status).toBe("applied");
    });

    it("refuses application drafting when the job has a follow-up issue (mutual exclusion)", async () => {
        const { deps } = makeDeps({
            getById: async () => job("saved", "https://github.com/arndvs/cmd-private/issues/1"),
        });

        await expect(dispatchJob("j1", "application", deps)).rejects.toThrow(
            "Only saved jobs can be drafted for application",
        );
    });

    it("throws when the job is not found", async () => {
        const { deps } = makeDeps({
            getById: async () => null,
        });

        await expect(dispatchJob("j1", "application", deps)).rejects.toThrow(
            "Job posting not found",
        );
    });
});

describe("dispatchJob — followup", () => {
    beforeEach(() => vi.clearAllMocks());

    it("dispatches a saved job to a follow-up issue and records the URL", async () => {
        const { deps, current } = makeDeps({});
        const result = await dispatchJob("j1", "followup", deps);

        expect(result.alreadyDispatched).toBe(false);
        expect(result.issueUrl).toBe("https://github.com/arndvs/cmd-private/issues/1");
        expect(current.value.followUpIssueUrl).toBe(
            "https://github.com/arndvs/cmd-private/issues/1",
        );
    });

    it("is idempotent when the job already has a follow-up issue", async () => {
        const { deps } = makeDeps({
            getById: async () => job("saved", "https://github.com/arndvs/cmd-private/issues/1"),
        });

        const result = await dispatchJob("j1", "followup", deps);
        expect(result.alreadyDispatched).toBe(true);
        expect(result.issueUrl).toBe("https://github.com/arndvs/cmd-private/issues/1");
    });

    it("refuses follow-up dispatch when the job is applied (mutual exclusion)", async () => {
        const { deps } = makeDeps({
            getById: async () => job("applied"),
        });

        await expect(dispatchJob("j1", "followup", deps)).rejects.toThrow(
            "Only saved jobs can be dispatched for follow-up",
        );
    });

    it("uses the injected createFollowUpIssue when provided", async () => {
        const createFollowUpIssue = vi.fn(async () => "https://example.com/issue/42");
        const { deps } = makeDeps({ createFollowUpIssue });

        const result = await dispatchJob("j1", "followup", deps);
        expect(createFollowUpIssue).toHaveBeenCalledOnce();
        expect(result.issueUrl).toBe("https://example.com/issue/42");
    });
});
