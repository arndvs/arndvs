import { calculateMicrodollars } from "./calculate-cost";
import type { PricingRates } from "./model-pricing";
import {
    DAYS_PER_MONTH,
    dailyVolumes,
    decisionCalls,
    generationUsage,
    normalizeScenario,
} from "./rag-scenario";
import type { DailyVolumes, DecisionCalls, RagScenario } from "./rag-scenario";
import { emptyTokenUsage } from "./token-usage";
import type { TokenUsage } from "./token-usage";

const MICRODOLLARS_PER_DOLLAR = 1_000_000;

export type ScenarioRates = {
    /** The model that answers unrouted queries. */
    main: PricingRates;
    /** The model the router sends its share to. */
    routed: PricingRates;
    /** The decision model, such as Jev. Output is usually free. */
    decision: PricingRates;
};

export type GenerationCost = { calls: number; usage: TokenUsage; perDay: number };

export type DecisionCost = DecisionCalls & { usage: TokenUsage; perDay: number };

export type ScenarioEstimate = {
    volumes: DailyVolumes;
    main: GenerationCost;
    routed: GenerationCost;
    decisions: DecisionCost[];
    perDay: number;
    perMonth: number;
    /** The day's cost spread over every incoming query, cache hits included. */
    perQuery: number;
};

/**
 * Prices a day of a scenario's traffic. Each model keeps its own prompt
 * cache, so the main and routed models each pay for their own cache writes.
 * Decision-model calls are billed as uncached input.
 *
 * Each line reports its own dollars for display, but the totals add every
 * line in millionths of a dollar and divide once, so an exact half cent
 * isn't lost to floating-point error.
 */
export const estimateScenario = (scenario: RagScenario, rates: ScenarioRates): ScenarioEstimate => {
    const normalized = normalizeScenario(scenario);
    const volumes = dailyVolumes(normalized);
    let totalMicrodollars = 0;

    const price = (usage: TokenUsage, lineRates: PricingRates): number => {
        const microdollars = calculateMicrodollars(usage, lineRates);
        totalMicrodollars += microdollars;

        return microdollars / MICRODOLLARS_PER_DOLLAR;
    };

    const generation = (calls: number, lineRates: PricingRates): GenerationCost => {
        const usage = generationUsage(normalized, calls);

        return { calls, usage, perDay: price(usage, lineRates) };
    };

    const main = generation(volumes.toMain, rates.main);
    const routed = generation(volumes.toRouted, rates.routed);
    const decisions = decisionCalls(normalized).map((entry): DecisionCost => {
        const usage = { ...emptyTokenUsage(), uncachedInput: entry.calls * entry.tokensPerCall };

        return { ...entry, usage, perDay: price(usage, rates.decision) };
    });

    return {
        volumes,
        main,
        routed,
        decisions,
        perDay: totalMicrodollars / MICRODOLLARS_PER_DOLLAR,
        perMonth: (totalMicrodollars * DAYS_PER_MONTH) / MICRODOLLARS_PER_DOLLAR,
        perQuery:
            volumes.queries > 0 ? totalMicrodollars / volumes.queries / MICRODOLLARS_PER_DOLLAR : 0,
    };
};
