import { describe, expect, it } from "vitest";

import {
    VALID_JOB_TRANSITIONS,
    assertValidJobTransition,
    jobScoringDecisionSchema,
    jobStatusSchema,
} from "./job-types";

describe("job-status state machine", () => {
    it("accepts a valid transition (discovered -> saved)", () => {
        expect(() => assertValidJobTransition("discovered", "saved")).not.toThrow();
    });

    it("accepts saved -> applied", () => {
        expect(() => assertValidJobTransition("saved", "applied")).not.toThrow();
    });

    it("throws on an invalid transition (discovered -> applied directly)", () => {
        // Must save before applying — mirrors the human-gate invariant.
        expect(() => assertValidJobTransition("discovered", "applied")).toThrow(
            /Invalid job transition/,
        );
    });

    it("throws on a terminal-state transition", () => {
        expect(() => assertValidJobTransition("skip", "saved")).toThrow();
        expect(() => assertValidJobTransition("expired", "discovered")).toThrow();
    });

    it("expired is reachable from discovered and saved", () => {
        expect(VALID_JOB_TRANSITIONS.discovered).toContain("expired");
        expect(VALID_JOB_TRANSITIONS.saved).toContain("expired");
    });
});

describe("job status + decision schemas", () => {
    it("parses all statuses", () => {
        const parsed = jobStatusSchema.parse("saved");
        expect(parsed).toBe("saved");
    });

    it("rejects an unknown status", () => {
        expect(() => jobStatusSchema.parse("posted")).toThrow();
    });

    it("parses all scoring decisions", () => {
        expect(jobScoringDecisionSchema.parse("review")).toBe("review");
        expect(jobScoringDecisionSchema.parse("reject")).toBe("reject");
        expect(jobScoringDecisionSchema.parse("needs-verification")).toBe("needs-verification");
    });
});

describe("VALID_JOB_TRANSITIONS", () => {
    it("only allows forward + skip transitions", () => {
        for (const [from, tos] of Object.entries(VALID_JOB_TRANSITIONS)) {
            for (const to of tos) {
                expect(from).not.toBe(to); // no self-transitions
                expect(() => assertValidJobTransition(from as never, to as never)).not.toThrow();
            }
        }
    });

    it("never allows a transition out of skip", () => {
        expect(VALID_JOB_TRANSITIONS.skip).toHaveLength(0);
    });
});