import { describe, expect, it } from "vitest";

import { EXPERIMENTS } from "./experiments";

const TITLE_LIMIT = 62 - " | Aaron Davis".length;

describe("experiments as tools", () => {
    it("gives every tool a unique search title that fits the results page", () => {
        const titles = EXPERIMENTS.map((e) => e.seoTitle);
        expect(new Set(titles).size).toBe(titles.length);
        for (const t of titles) expect(t.length, t).toBeLessThanOrEqual(TITLE_LIMIT);
    });

    it("explains how to use each tool", () => {
        for (const e of EXPERIMENTS) expect(e.steps.length, e.slug).toBeGreaterThanOrEqual(3);
    });

    it("answers real questions in plain text", () => {
        for (const e of EXPERIMENTS) {
            expect(e.faqs.length, e.slug).toBeGreaterThanOrEqual(3);
            for (const f of e.faqs) {
                expect(f.question.endsWith("?"), f.question).toBe(true);
                // FAQPage answers are plain text; markup would be read literally.
                expect(f.answer, f.question).not.toMatch(/<|\]\(/);
            }
        }
    });
});
