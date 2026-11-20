import { describe, expect, it } from "vitest";

import { estimateReviewCapacity, fieldProblems, parseScenario } from "./estimate-review-capacity";
import type { Scenario } from "./estimate-review-capacity";

const defaults: Scenario = {
    agents: 3,
    prsPerAgent: 2,
    linesPerPr: 300,
    sittings: 3,
    linesPerSitting: 300,
};

describe("estimateReviewCapacity", () => {
    it("works out the lines opened and reviewable each day", () => {
        const estimate = estimateReviewCapacity(defaults);

        expect(estimate.linesOpened).toBe(1_800);
        expect(estimate.linesReviewable).toBe(900);
        expect(estimate.balance).toBe(-900);
    });

    it("counts the whole agents that the review time keeps fully reviewed", () => {
        expect(estimateReviewCapacity(defaults).sustainableAgents).toBe(1.5);
        expect(estimateReviewCapacity(defaults).fullyReviewedAgents).toBe(1);
        expect(
            estimateReviewCapacity({ ...defaults, linesPerPr: 200, sittings: 4 })
                .fullyReviewedAgents,
        ).toBe(3);
        expect(estimateReviewCapacity({ ...defaults, sittings: 0 }).fullyReviewedAgents).toBe(0);
    });

    it("does not drop an agent to floating-point error in decimal rates", () => {
        const estimate = estimateReviewCapacity({
            agents: 1,
            prsPerAgent: 0.07,
            linesPerPr: 100,
            sittings: 1,
            linesPerSitting: 21,
        });

        expect(estimate.fullyReviewedAgents).toBe(3);
    });

    it("throws rather than estimating from an unusable scenario", () => {
        expect(() => estimateReviewCapacity({ ...defaults, linesPerPr: 0 })).toThrow(
            "linesPerPr: Enter a number above 0.",
        );
    });
});

describe("fieldProblems", () => {
    it("accepts zero agents and zero sittings", () => {
        expect(fieldProblems({ ...defaults, agents: 0, sittings: 0 })).toEqual({});
    });

    it("explains what to change in each field it cannot use", () => {
        expect(fieldProblems({ ...defaults, prsPerAgent: 0 })).toEqual({
            prsPerAgent: "Enter a number above 0.",
        });
        expect(fieldProblems({ ...defaults, agents: -1 })).toEqual({ agents: "Enter 0 or more." });
    });

    it("treats a blank input as missing rather than as zero", () => {
        const scenario = parseScenario({
            agents: "3",
            prsPerAgent: "2",
            linesPerPr: "300",
            sittings: " ",
            linesPerSitting: "300",
        });

        expect(fieldProblems(scenario)).toEqual({ sittings: "Enter a number." });
    });
});
