import { calculateMicrodollars } from "./calculate-cost";
import type { ScenarioEstimate, ScenarioRates } from "./estimate";
import { DAYS_PER_MONTH } from "./rag-scenario";
import type { TokenUsage } from "./token-usage";

export type CostCompositionPart = {
    id: "mainInput" | "mainOutput" | "cache" | "routed" | "decisions";
    label: string;
    perMonth: number;
};

const monthlyCost = (usage: TokenUsage, rates: ScenarioRates["main"]): number =>
    (calculateMicrodollars(usage, rates) * DAYS_PER_MONTH) / 1_000_000;

const usageWith = (usage: TokenUsage, fields: readonly (keyof TokenUsage)[]): TokenUsage => ({
    uncachedInput: fields.includes("uncachedInput") ? usage.uncachedInput : 0,
    cacheRead: fields.includes("cacheRead") ? usage.cacheRead : 0,
    cacheWrite5m: fields.includes("cacheWrite5m") ? usage.cacheWrite5m : 0,
    cacheWrite1h: fields.includes("cacheWrite1h") ? usage.cacheWrite1h : 0,
    output: fields.includes("output") ? usage.output : 0,
});

/**
 * Splits the monthly total into readable buckets. The final decision bucket is
 * the residual after the other buckets, preserving the estimator's exact total
 * despite floating-point rounding in the individual display values.
 */
export const costComposition = (
    estimate: ScenarioEstimate,
    rates: ScenarioRates,
): CostCompositionPart[] => {
    const inputOnly = ["uncachedInput"] as const;
    const outputOnly = ["output"] as const;
    const mainInput = monthlyCost(usageWith(estimate.main.usage, inputOnly), rates.main);
    const mainOutput = monthlyCost(usageWith(estimate.main.usage, outputOnly), rates.main);
    const cache =
        monthlyCost(
            usageWith(estimate.main.usage, ["cacheRead", "cacheWrite5m", "cacheWrite1h"]),
            rates.main,
        ) +
        monthlyCost(
            usageWith(estimate.routed.usage, ["cacheRead", "cacheWrite5m", "cacheWrite1h"]),
            rates.routed,
        );
    const routed = monthlyCost(
        usageWith(estimate.routed.usage, ["uncachedInput", "output"]),
        rates.routed,
    );
    const decisions = estimate.perMonth - mainInput - mainOutput - cache - routed;

    return [
        { id: "mainInput", label: "Main model input", perMonth: mainInput },
        { id: "mainOutput", label: "Main model output", perMonth: mainOutput },
        { id: "cache", label: "Cache reads and writes", perMonth: cache },
        { id: "routed", label: "Routed model", perMonth: routed },
        { id: "decisions", label: "Decision model", perMonth: decisions },
    ];
};
