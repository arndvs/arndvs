import { describe, expect, it } from "vitest";

import {
    SOCIAL_DRAFT_STATUSES,
    VALID_SOCIAL_DRAFT_TRANSITIONS,
    isSendable,
    isValidSocialDraftTransition,
    socialDraftStatusSchema,
} from "./social-draft";

describe("social draft status schema", () => {
    it("accepts only supported statuses", () => {
        expect(socialDraftStatusSchema.parse("draft")).toBe("draft");
        expect(socialDraftStatusSchema.parse("posted")).toBe("posted");
        expect(socialDraftStatusSchema.safeParse("published").success).toBe(false);
        expect(socialDraftStatusSchema.safeParse("").success).toBe(false);
    });

    it("defines every status in the transition map", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(VALID_SOCIAL_DRAFT_TRANSITIONS[status]).toBeDefined();
        }
    });
});

describe("isValidSocialDraftTransition", () => {
    it("allows draft → editing", () => {
        expect(isValidSocialDraftTransition("draft", "editing")).toBe(true);
    });

    it("allows draft → skipped", () => {
        expect(isValidSocialDraftTransition("draft", "skipped")).toBe(true);
    });

    it("allows editing → ready", () => {
        expect(isValidSocialDraftTransition("editing", "ready")).toBe(true);
    });

    it("allows ready → posted", () => {
        expect(isValidSocialDraftTransition("ready", "posted")).toBe(true);
    });

    it("rejects draft → posted (must be approved first)", () => {
        expect(isValidSocialDraftTransition("draft", "posted")).toBe(false);
    });

    it("rejects posted → anything (terminal state)", () => {
        expect(isValidSocialDraftTransition("posted", "draft")).toBe(false);
        expect(isValidSocialDraftTransition("posted", "editing")).toBe(false);
    });

    it("rejects skipped → anything (terminal state)", () => {
        expect(isValidSocialDraftTransition("skipped", "ready")).toBe(false);
    });

    it("rejects ready → editing (can't un-approve)", () => {
        expect(isValidSocialDraftTransition("ready", "editing")).toBe(false);
    });
});

describe("isSendable", () => {
    it("returns true only for ready", () => {
        expect(isSendable("ready")).toBe(true);
        expect(isSendable("draft")).toBe(false);
        expect(isSendable("editing")).toBe(false);
        expect(isSendable("posted")).toBe(false);
        expect(isSendable("skipped")).toBe(false);
    });
});
