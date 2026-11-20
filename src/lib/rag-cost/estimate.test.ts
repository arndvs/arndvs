import { describe, expect, it } from "vitest";

import { estimateScenario } from "./estimate";
import type { ScenarioRates } from "./estimate";
import { defaultRagScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

// Rates from model-pricing.toml, in US dollars per million tokens.
const sonnet55 = { input: 2, cachedInput: 0.2, output: 10, cacheWrite5m: 2.5, cacheWrite1h: 4 };
const haiku45 = { input: 1, cachedInput: 0.1, output: 5, cacheWrite5m: 1.25, cacheWrite1h: 2 };
const gpt61Sol = { input: 2, cachedInput: 0.1, output: 10 };
// TypeSafe publishes Jev at $0.042 per million input tokens, with output free.
const jev = { input: 0.042, cachedInput: 0.042, output: 0 };

const rates: ScenarioRates = { main: sonnet55, routed: haiku45, decision: jev };

const routedToHaiku = (): RagScenario => ({
    ...defaultRagScenario(),
    routing: { share: 0.7, accuracy: 0.8 },
});

const withDecisions = (
    base: RagScenario,
    changes: Partial<RagScenario["decisions"]>,
): RagScenario => ({ ...base, decisions: { ...base.decisions, ...changes } });

const decisionCost = (scenario: RagScenario) =>
    estimateScenario(scenario, rates).decisions.reduce((sum, entry) => sum + entry.perDay, 0) * 30;

describe("the course’s worked example", () => {
    it("costs $90 a day at Sonnet 5.5 prices", () => {
        const estimate = estimateScenario(defaultRagScenario(), rates);

        expect(estimate.perDay).toBeCloseTo(90);
        expect(estimate.perMonth).toBeCloseTo(2_700);
        expect(estimate.perQuery).toBeCloseTo(0.009);
    });

    it("costs $135 a day at the $3 and $15 Sonnet 4 prices the course quotes", () => {
        const sonnet4 = { input: 3, cachedInput: 0.3, output: 15 };

        expect(
            estimateScenario(defaultRagScenario(), { ...rates, main: sonnet4 }).perDay,
        ).toBeCloseTo(135);
    });

    it("costs $1,755 a month with 70% routed to Haiku 4.5, not the $450 the course claims", () => {
        const estimate = estimateScenario(routedToHaiku(), rates);

        expect(estimate.main.perDay).toBeCloseTo(27);
        expect(estimate.routed.perDay).toBeCloseTo(31.5);
        expect(estimate.perMonth).toBeCloseTo(1_755);
    });
});

describe("decisions handed to Jev", () => {
    it("routes 10,000 questions a day for about $3.78 a month", () => {
        expect(decisionCost(withDecisions(routedToHaiku(), { route: true }))).toBeCloseTo(3.78);
    });

    it("saves $390 a month by keeping 3 of 8 chunks instead of sending 5, for $54.18 of Jev", () => {
        const fiveChunks: RagScenario = {
            ...routedToHaiku(),
            prompt: { ...defaultRagScenario().prompt, chunks: 5 },
        };
        const filtered = withDecisions(fiveChunks, {
            filter: { enabled: true, candidates: 8, keep: 3 },
        });

        const before = estimateScenario(fiveChunks, rates);
        const after = estimateScenario(filtered, rates);
        const generationSaved =
            (before.main.perDay + before.routed.perDay - after.main.perDay - after.routed.perDay) *
            30;

        expect(generationSaved).toBeCloseTo(390);
        expect(decisionCost(filtered)).toBeCloseTo(54.18);
        expect(before.perMonth - after.perMonth).toBeCloseTo(335.82);
    });

    it("saves a tenth of generation when the gate turns away 10% of queries", () => {
        const gated = withDecisions(routedToHaiku(), {
            gate: { enabled: true, unanswerableRate: 0.1 },
        });

        const saved =
            estimateScenario(routedToHaiku(), rates).perMonth -
            (estimateScenario(gated, rates).perMonth - decisionCost(gated));

        expect(saved).toBeCloseTo(175.5);
        expect(decisionCost(gated)).toBeCloseTo(22.68);
    });

    it("adds nothing for the gate when the filter’s call already carries it", () => {
        const filter = { enabled: true, candidates: 8, keep: 3 };
        const filterOnly = withDecisions(routedToHaiku(), { filter });
        const filterAndGate = withDecisions(routedToHaiku(), {
            filter,
            gate: { enabled: true, unanswerableRate: 0.1 },
        });

        expect(decisionCost(filterAndGate)).toBeCloseTo(decisionCost(filterOnly));
    });
});

describe("money", () => {
    it("adds the lines before dividing, so an exact half cent across two models stays $0.335", () => {
        // One query each way. The main model bills 30,000 input tokens at $10 per
        // million ($0.30) and the routed one 700 output tokens at $50 ($0.035).
        // Dividing each line first gives 0.33499999999999996, which shows as $0.33.
        const halfCent: RagScenario = {
            ...defaultRagScenario(),
            queriesPerDay: 2,
            prompt: {
                systemTokens: 0,
                questionTokens: 30_000,
                chunkTokens: 0,
                chunks: 0,
                outputTokens: 700,
            },
            routing: { share: 0.5, accuracy: 1 },
        };
        const inputOnly = { input: 10, cachedInput: 1, output: 0 };
        const outputOnly = { input: 0, cachedInput: 0, output: 50 };

        const estimate = estimateScenario(halfCent, {
            ...rates,
            main: inputOnly,
            routed: outputOnly,
        });

        expect(estimate.main.perDay + estimate.routed.perDay).not.toBe(0.335);
        expect(estimate.perDay).toBe(0.335);
    });

    it("treats a corrupt count as zero instead of overflowing to Infinity", () => {
        const corrupt: RagScenario = {
            ...defaultRagScenario(),
            queriesPerDay: 1e308,
            prompt: { ...defaultRagScenario().prompt, outputTokens: Number.NaN },
        };

        const estimate = estimateScenario(corrupt, rates);

        expect(estimate.perMonth).toBe(0);
        expect(estimate.perQuery).toBe(0);
    });

    it("prices a scenario with no traffic at zero, with no division by zero", () => {
        const estimate = estimateScenario({ ...defaultRagScenario(), queriesPerDay: 0 }, rates);

        expect(estimate.perQuery).toBe(0);
        expect(Number.isFinite(estimate.perMonth)).toBe(true);
    });
});

describe("prompt caching", () => {
    it("pays Anthropic’s write premium on at most one write per five minutes", () => {
        const cached = { ...defaultRagScenario(), promptCaching: true };
        const { main } = estimateScenario(cached, rates);

        // 288 writes at $2.50, 9,712 reads at $0.20, and the rest of each prompt uncached.
        const systemPrompt = (288 * 300 * 2.5 + 9_712 * 300 * 0.2) / 1e6;
        const rest = (10_000 * 1_700 * 2 + 10_000 * 500 * 10) / 1e6;

        expect(main.perDay).toBeCloseTo(systemPrompt + rest, 10);
    });

    it("bills the first write at the plain input price for a model that caches automatically", () => {
        const thin = { ...defaultRagScenario(), queriesPerDay: 100, promptCaching: true };

        expect(estimateScenario(thin, { ...rates, main: gpt61Sol }).perDay).toBeCloseTo(
            estimateScenario({ ...thin, promptCaching: false }, { ...rates, main: gpt61Sol })
                .perDay,
        );
    });
});
