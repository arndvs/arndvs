import { describe, expect, it } from "vitest";

import {
    VALID_JOB_TRANSITIONS,
    assertValidJobTransition,
    jobScoringDecisionSchema,
    jobStatusSchema,
} from "./job-types";

describe("job-status state machine", () => {
    it("walks the forward path: discovered → saved → applied", () => {
        expect(() => assertValidJobTransition("discovered", "saved")).not.toThrow();
        expect(() => assertValidJobTransition("saved", "applied")).not.toThrow();
    });

    it("throws on transitions that skip a gate or leave a terminal state", () => {
        expect(() => assertValidJobTransition("discovered", "applied")).toThrow(
            /Invalid job transition/,
        );
        expect(() => assertValidJobTransition("skip", "saved")).toThrow();
        expect(() => assertValidJobTransition("expired", "discovered")).toThrow();
    });

    it("allows expiration from discovered and saved", () => {
        expect(VALID_JOB_TRANSITIONS.discovered).toContain("expired");
        expect(VALID_JOB_TRANSITIONS.saved).toContain("expired");
    });
});

describe("job status + decision schemas", () => {
    it("parses supported statuses and decisions", () => {
        expect(jobStatusSchema.parse("saved")).toBe("saved");
        expect(jobScoringDecisionSchema.parse("review")).toBe("review");
        expect(jobScoringDecisionSchema.parse("reject")).toBe("reject");
        expect(jobScoringDecisionSchema.parse("needs-verification")).toBe("needs-verification");
    });

    it("rejects an unknown status", () => {
        expect(() => jobStatusSchema.parse("posted")).toThrow();
    });
});

describe("VALID_JOB_TRANSITIONS", () => {
    it("only allows forward + skip transitions, never self-transitions", () => {
        for (const [from, tos] of Object.entries(VALID_JOB_TRANSITIONS)) {
            for (const to of tos) {
                expect(from).not.toBe(to);
                expect(() => assertValidJobTransition(from as never, to as never)).not.toThrow();
            }
        }
    });

    it("never allows a transition out of skip", () => {
        expect(VALID_JOB_TRANSITIONS.skip).toHaveLength(0);
    });
});
