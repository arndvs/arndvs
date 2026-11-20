import type { DecisionCost, ScenarioEstimate, ScenarioRates } from "./estimate";
import type { PricingRates } from "./model-pricing";
import { TOKEN_USAGE_FIELDS } from "./token-usage";
import type { TokenUsage } from "./token-usage";

/** One kind of token in a cost line, and what it costs. */
export type FormulaTerm = {
    field: keyof TokenUsage;
    tokens: number;
    /** US dollars per million tokens, after the cache-write fallback to the input price. */
    pricePerMillion: number;
};

/** A cost line as the sum of its terms, divided by a million once. */
export type LineFormula = { terms: FormulaTerm[]; dollars: number };

export type DecisionFormula = DecisionCost & { formula: LineFormula };

export type EstimateFormulas = {
    main: LineFormula;
    routed: LineFormula;
    decisions: DecisionFormula[];
};

const priceFor = (field: keyof TokenUsage, rates: PricingRates): number => {
    switch (field) {
        case "uncachedInput":
            return rates.input;
        case "cacheRead":
            return rates.cachedInput;
        case "cacheWrite5m":
            return rates.cacheWrite5m ?? rates.input;
        case "cacheWrite1h":
            return rates.cacheWrite1h ?? rates.input;
        case "output":
            return rates.output;
    }
};

/**
 * Breaks a line into the terms `calculateMicrodollars` adds, in the same
 * order, leaving out terms with no tokens. Adding zero changes nothing, so
 * `dollars` matches the priced line exactly, not just closely.
 */
export const explainUsage = (usage: TokenUsage, rates: PricingRates): LineFormula => {
    const terms = TOKEN_USAGE_FIELDS.filter((field) => usage[field] > 0).map((field) => ({
        field,
        tokens: usage[field],
        pricePerMillion: priceFor(field, rates),
    }));
    const microdollars = terms.reduce((sum, term) => sum + term.tokens * term.pricePerMillion, 0);

    return { terms, dollars: microdollars / 1_000_000 };
};

/** The formula behind every line of an estimate, for "show the math". */
export const explainEstimate = (
    estimate: ScenarioEstimate,
    rates: ScenarioRates,
): EstimateFormulas => ({
    main: explainUsage(estimate.main.usage, rates.main),
    routed: explainUsage(estimate.routed.usage, rates.routed),
    decisions: estimate.decisions.map((entry) => ({
        ...entry,
        formula: explainUsage(entry.usage, rates.decision),
    })),
});
