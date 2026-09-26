import { describe, expect, it } from "vitest";

import { SOCIAL_DRAFT_STATUSES } from "@arndvs/contracts";

import { JOB_STATUSES, type JobPostingRecord, type JobStatus } from "./job-types";
import {
    canDispatchJob,
    canDraftApplication,
    canSaveJob,
    canTransitionDraft,
    isApprovable,
    isEditable,
    isRejectable,
    isSendable,
} from "./policy";

/**
 * Policy predicate matrix — every predicate against every status value.
 * No branch may go untested (refs #66).
 */

function job(status: JobStatus, followUpIssueUrl?: string): JobPostingRecord {
    return {
        _id: "j1",
        title: "Engineer",
        url: "https://linkedin.com/jobs/view/1",
        status,
        score: 0.5,
        reasons: [],
        discoveredAt: "2026-09-01T00:00:00Z",
        followUpIssueUrl,
    };
}

describe("canSaveJob", () => {
    it("is true only for discovered jobs", () => {
        for (const status of JOB_STATUSES) {
            expect(canSaveJob(status), `canSaveJob(${status})`).toBe(status === "discovered");
        }
    });
});

describe("canDispatchJob", () => {
    it("is true only for saved jobs without a follow-up issue", () => {
        for (const status of JOB_STATUSES) {
            expect(canDispatchJob(status), `canDispatchJob(${status})`).toBe(status === "saved");
            expect(canDispatchJob(status, "https://issue"), `canDispatchJob(${status}, issued)`).toBe(false);
        }
    });
});

describe("canDraftApplication", () => {
    it("is true only for saved jobs without a follow-up issue", () => {
        for (const status of JOB_STATUSES) {
            expect(canDraftApplication(job(status)), `canDraftApplication(${status})`).toBe(
                status === "saved",
            );
            expect(canDraftApplication(job(status, "https://issue")), `canDraftApplication(${status}, issued)`).toBe(
                false,
            );
        }
    });
});

describe("canTransitionDraft", () => {
    it("delegates to the shared state machine", () => {
        // draft → editing is valid; draft → posted is not.
        expect(canTransitionDraft("draft", "editing")).toBe(true);
        expect(canTransitionDraft("draft", "posted")).toBe(false);
        // ready → posted is valid; ready → draft is not.
        expect(canTransitionDraft("ready", "posted")).toBe(true);
        expect(canTransitionDraft("ready", "draft")).toBe(false);
        // terminal states are absorbing.
        expect(canTransitionDraft("posted", "posted")).toBe(true);
        expect(canTransitionDraft("posted", "ready")).toBe(false);
    });
});

describe("isEditable", () => {
    it("is true only for draft and editing", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(isEditable(status), `isEditable(${status})`).toBe(
                status === "draft" || status === "editing",
            );
        }
    });
});

describe("isApprovable", () => {
    it("is true only for editing and ready", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(isApprovable(status), `isApprovable(${status})`).toBe(
                status === "editing" || status === "ready",
            );
        }
    });
});

describe("isSendable", () => {
    it("is true only for ready (delegates to contracts helper)", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(isSendable(status), `isSendable(${status})`).toBe(status === "ready");
        }
    });
});

describe("isRejectable", () => {
    it("is true for every non-terminal status", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(isRejectable(status), `isRejectable(${status})`).toBe(
                status !== "posted" && status !== "skipped",
            );
        }
    });
});