import { describe, expect, it } from "vitest";

import {
    SOCIAL_DRAFT_STATUSES,
    VALID_SOCIAL_DRAFT_TRANSITIONS,
    isSendable,
    isValidSocialDraftTransition,
    socialDraftStatusSchema,
} from "./social-draft";

describe("social draft lifecycle", () => {
    it("accepts only the supported statuses", () => {
        expect(socialDraftStatusSchema.parse("draft")).toBe("draft");
        expect(socialDraftStatusSchema.parse("posted")).toBe("posted");
        expect(socialDraftStatusSchema.safeParse("published").success).toBe(false);
        expect(socialDraftStatusSchema.safeParse("").success).toBe(false);
    });

    it("covers every status in the transition map", () => {
        for (const status of SOCIAL_DRAFT_STATUSES) {
            expect(VALID_SOCIAL_DRAFT_TRANSITIONS[status]).toBeDefined();
        }
    });

    it("walks the happy path: draft → editing → ready → posted", () => {
        expect(isValidSocialDraftTransition("draft", "editing")).toBe(true);
        expect(isValidSocialDraftTransition("editing", "ready")).toBe(true);
        expect(isValidSocialDraftTransition("ready", "posted")).toBe(true);
    });

    it("rejects transitions that skip the human approval gate", () => {
        expect(isValidSocialDraftTransition("draft", "posted")).toBe(false);
        expect(isValidSocialDraftTransition("ready", "editing")).toBe(false);
    });

    it("treats posted and skipped as terminal states", () => {
        expect(isValidSocialDraftTransition("posted", "draft")).toBe(false);
        expect(isValidSocialDraftTransition("posted", "editing")).toBe(false);
        expect(isValidSocialDraftTransition("skipped", "ready")).toBe(false);
    });

    it("allows draft → editing → skipped as an abandonment path", () => {
        expect(isValidSocialDraftTransition("draft", "skipped")).toBe(true);
    });

    it("sends only approved drafts", () => {
        expect(isSendable("ready")).toBe(true);
        expect(isSendable("draft")).toBe(false);
        expect(isSendable("editing")).toBe(false);
        expect(isSendable("posted")).toBe(false);
        expect(isSendable("skipped")).toBe(false);
    });
});
