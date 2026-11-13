import { describe, expect, it } from "vitest";

import { cssAspectRatio } from "./aspect-ratio";

// Sanity's stega encoding appends zero-width characters to string fields while
// draft mode is on. In a CSS value they make the declaration invalid, so the
// browser drops it and the iframe collapses to its 150px default height.
const stega = (value: string) => `${value}\u200B\u200C\uFEFF\u200D\u200B`;

describe("cssAspectRatio", () => {
    it("returns allowed ratios unchanged", () => {
        expect(cssAspectRatio("16 / 9")).toBe("16 / 9");
        expect(cssAspectRatio("4 / 5")).toBe("4 / 5");
        expect(cssAspectRatio("1 / 1")).toBe("1 / 1");
        expect(cssAspectRatio("3 / 2")).toBe("3 / 2");
    });

    it("strips stega characters from the value", () => {
        expect(cssAspectRatio(stega("16 / 9"))).toBe("16 / 9");
        expect(cssAspectRatio(stega("4 / 5"))).toBe("4 / 5");
    });

    it("normalizes spacing", () => {
        expect(cssAspectRatio("16/9")).toBe("16 / 9");
        expect(cssAspectRatio("  4   /   5  ")).toBe("4 / 5");
    });

    it("falls back for missing or unrecognizable values", () => {
        expect(cssAspectRatio(undefined)).toBe("4 / 5");
        expect(cssAspectRatio("")).toBe("4 / 5");
        expect(cssAspectRatio("garbage")).toBe("4 / 5");
    });

    it("rejects ratios with a zero part", () => {
        expect(cssAspectRatio("0 / 9")).toBe("4 / 5");
        expect(cssAspectRatio("16 / 0")).toBe("4 / 5");
    });
});
