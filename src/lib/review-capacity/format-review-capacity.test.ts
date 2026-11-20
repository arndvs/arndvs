import { describe, expect, it } from "vitest";

import { describeBalance, formatCount } from "./format-review-capacity";

describe("formatCount", () => {
    it("uses the singular noun only for exactly one", () => {
        expect(formatCount(1, "line")).toBe("1 line");
        expect(formatCount(0, "PR")).toBe("0 PRs");
    });

    it("groups thousands and keeps one decimal place", () => {
        expect(formatCount(1_800, "line")).toBe("1,800 lines");
        expect(formatCount(1.5, "agent")).toBe("1.5 agents");
    });
});

describe("describeBalance", () => {
    it("reports lines left unreviewed when the balance is negative", () => {
        expect(describeBalance(-900)).toBe("900 lines a day left unreviewed.");
    });

    it("reports spare capacity when the balance is zero or positive", () => {
        expect(describeBalance(0)).toBe("0 lines of spare review capacity a day.");
        expect(describeBalance(1)).toBe("1 line of spare review capacity a day.");
    });
});
