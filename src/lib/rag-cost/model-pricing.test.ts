import { describe, expect, it } from "vitest";

import { calculateCost } from "./calculate-cost";
import { formatCalendarDate, formatCost, formatPrice, parseTokenCount } from "./format";
import { MODEL_CATALOG, decisionModel, generationModels } from "./model-pricing";
import { emptyTokenUsage } from "./token-usage";

describe("MODEL_CATALOG", () => {
    const { models } = MODEL_CATALOG;

    it("gives every model its own ID", () => {
        expect(new Set(models.map((model) => model.id)).size).toBe(models.length);
    });

    it("has finite, non-negative prices", () => {
        for (const model of models) {
            for (const price of [
                model.input,
                model.cachedInput,
                model.output,
                model.cacheWrite5m ?? 0,
            ]) {
                expect(Number.isFinite(price) && price >= 0, model.id).toBe(true);
            }
        }
    });

    it("never prices cached input above uncached input, which would mean a misplaced decimal", () => {
        for (const model of models)
            expect(model.cachedInput, model.id).toBeLessThanOrEqual(model.input);
    });

    it("never prices a cache write below plain input, which would mean a multiplier typed as a price", () => {
        for (const model of models) {
            if (model.cacheWrite5m !== undefined) {
                expect(model.cacheWrite5m, model.id).toBeGreaterThanOrEqual(model.input);
            }
        }
    });

    it("keeps decision models out of the generation list, with free output and a source", () => {
        const decision = decisionModel(MODEL_CATALOG);

        expect(decision?.output).toBe(0);
        expect(decision?.source).toBeTruthy();
        expect(generationModels(MODEL_CATALOG)).not.toContain(decision);
    });

    it("dates the prices in YYYY-MM-DD form", () => {
        expect(MODEL_CATALOG.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});

describe("format", () => {
    it("shows an exact half cent rounded up", () => {
        const halfCent = { ...emptyTokenUsage(), uncachedInput: 30_000, output: 700 };

        expect(
            formatCost(calculateCost(halfCent, { input: 10, cachedInput: 0.25, output: 50 })),
        ).toBe("$0.34");
    });

    it("reads shorthand and rejects fractions of a token", () => {
        expect(parseTokenCount("250k")).toBe(250_000);
        expect(parseTokenCount("1.5M")).toBe(1_500_000);
        expect(parseTokenCount("1,000,000")).toBe(1_000_000);
        expect(parseTokenCount("1.1k")).toBe(1_100);
        expect(parseTokenCount("1.5")).toBeNull();
        expect(parseTokenCount("abc")).toBeNull();
    });

    it("keeps three decimals for small prices", () => {
        expect(formatPrice(0.042)).toBe("$0.042");
        expect(formatPrice(2)).toBe("$2.00");
    });

    it("formats dates in UTC so the day never slips", () => {
        expect(formatCalendarDate("2026-10-04")).toBe("October 4, 2026");
    });
});
