/** A model's prices in US dollars per million tokens. */
export type PricingRates = {
    input: number;
    /** Price of input read from a prompt cache. */
    cachedInput: number;
    output: number;
    /** Price of a five-minute cache write. Omitted when writes bill as plain input. */
    cacheWrite5m?: number;
    /** Price of a one-hour cache write. Omitted when writes bill as plain input. */
    cacheWrite1h?: number;
};

export type ModelPricing = PricingRates & {
    id: string;
    name: string;
    provider: string;
    /** A qualifier shown after the name, such as a time-of-day price. */
    variant?: string;
    /** The listed prices only cover prompts up to this many tokens. */
    maximumPromptTokens?: number;
    /** `decision` models return a choice, not text, and bill input only. Defaults to `generation`. */
    kind?: "generation" | "decision";
    /** Where a price came from, when the provider has no pricing page. */
    source?: string;
};

export type ModelCatalog = { updated: string; models: ModelPricing[] };

/**
 * Every model's prices, most expensive first. `model-pricing.test.ts` checks
 * this table, so a misplaced decimal fails the tests instead of shipping.
 */
export const MODEL_CATALOG: ModelCatalog = {
    updated: "2026-10-04",
    models: [
        {
            id: "gpt-6-astra",
            name: "GPT-6 Astra",
            provider: "OpenAI",
            input: 10,
            cachedInput: 1,
            output: 50,
        },
        {
            id: "claude-fable-5-1",
            name: "Claude Fable 5.1",
            provider: "Anthropic",
            input: 10,
            cachedInput: 0.25,
            output: 50,
            cacheWrite5m: 12.5,
            cacheWrite1h: 20,
        },
        {
            id: "claude-opus-5-5",
            name: "Claude Opus 5.5",
            provider: "Anthropic",
            input: 4,
            cachedInput: 0.2,
            output: 20,
            cacheWrite5m: 5,
            cacheWrite1h: 8,
        },
        {
            id: "kimi-k3",
            name: "Kimi K3",
            provider: "Moonshot AI",
            input: 3,
            cachedInput: 0.3,
            output: 15,
        },
        {
            id: "gemini-3-1-pro-preview",
            name: "Gemini 3.1 Pro Preview",
            provider: "Google",
            variant: "≤200K",
            maximumPromptTokens: 200_000,
            input: 2,
            cachedInput: 0.2,
            output: 12,
        },
        {
            id: "gpt-6-1-sol",
            name: "GPT-6.1 Sol",
            provider: "OpenAI",
            input: 2,
            cachedInput: 0.1,
            output: 10,
        },
        {
            id: "claude-sonnet-5-5",
            name: "Claude Sonnet 5.5",
            provider: "Anthropic",
            input: 2,
            cachedInput: 0.2,
            output: 10,
            cacheWrite5m: 2.5,
            cacheWrite1h: 4,
        },
        {
            id: "grok-4-7",
            name: "Grok 4.7",
            provider: "xAI",
            variant: "<200K",
            maximumPromptTokens: 200_000,
            input: 2,
            cachedInput: 0.5,
            output: 6,
        },
        {
            id: "qwen3-8-max",
            name: "Qwen3.8-Max",
            provider: "Alibaba Cloud",
            input: 1.65,
            cachedInput: 0.206,
            output: 4.951,
        },
        {
            id: "claude-haiku-4-5",
            name: "Claude Haiku 4.5",
            provider: "Anthropic",
            input: 1,
            cachedInput: 0.1,
            output: 5,
            cacheWrite5m: 1.25,
            cacheWrite1h: 2,
        },
        {
            id: "glm-5-3",
            name: "GLM-5.3",
            provider: "Z.ai",
            input: 1.4,
            cachedInput: 0.26,
            output: 4.4,
        },
        {
            id: "deepseek-v4-pro-peak",
            name: "DeepSeek V4 Pro",
            provider: "DeepSeek",
            variant: "peak",
            input: 1.32,
            cachedInput: 0.044,
            output: 3.96,
        },
        {
            id: "kimi-k2-7-code",
            name: "Kimi K2.7 Code",
            provider: "Moonshot AI",
            input: 0.95,
            cachedInput: 0.19,
            output: 4,
        },
        {
            id: "gemini-3-8-flash",
            name: "Gemini 3.8 Flash",
            provider: "Google",
            input: 0.75,
            cachedInput: 0.075,
            output: 3.75,
        },
        {
            id: "gemini-3-5-flash-lite",
            name: "Gemini 3.5 Flash-Lite",
            provider: "Google",
            input: 0.3,
            cachedInput: 0.03,
            output: 2.5,
        },
        {
            id: "deepseek-v4-pro-off-peak",
            name: "DeepSeek V4 Pro",
            provider: "DeepSeek",
            variant: "off-peak",
            input: 0.66,
            cachedInput: 0.022,
            output: 1.98,
        },
        {
            id: "deepseek-v4-1-flash-peak",
            name: "DeepSeek V4.1 Flash",
            provider: "DeepSeek",
            variant: "peak",
            input: 0.3,
            cachedInput: 0.006,
            output: 1.2,
        },
        {
            id: "deepseek-v4-1-flash-off-peak",
            name: "DeepSeek V4.1 Flash",
            provider: "DeepSeek",
            variant: "off-peak",
            input: 0.15,
            cachedInput: 0.003,
            output: 0.6,
        },
        {
            id: "glm-5-3-flash",
            name: "GLM-5.3-Flash",
            provider: "Z.ai",
            input: 0.15,
            cachedInput: 0.03,
            output: 0.5,
        },
        {
            id: "gpt-6-luna",
            name: "GPT-6 Luna",
            provider: "OpenAI",
            input: 0.1,
            cachedInput: 0.01,
            output: 0.5,
        },
        {
            id: "qwen3-8-flash",
            name: "Qwen3.8-Flash",
            provider: "Alibaba Cloud",
            input: 0.113,
            cachedInput: 0.014,
            output: 0.382,
        },
        {
            id: "jev",
            name: "Jev",
            provider: "TypeSafe",
            kind: "decision",
            input: 0.042,
            cachedInput: 0.042,
            output: 0,
            source: "TypeSafe’s homepage and launch post (September 2026). TypeSafe has no pricing page, so check before relying on it.",
        },
    ],
};

/** A list with at least one entry, so its first entry always exists. */
export type NonEmpty<T> = [T, ...T[]];

/** Narrows a list to `NonEmpty`, or throws: a page with no models to price is a build error. */
export const nonEmpty = <T>(items: T[], what: string): NonEmpty<T> => {
    const [first, ...rest] = items;
    if (first === undefined) throw new Error(`Expected at least one ${what}.`);

    return [first, ...rest];
};

/** Models that write answers. Decision models are left out: they can't. */
export const generationModels = (catalog: ModelCatalog): ModelPricing[] =>
    catalog.models.filter((model) => model.kind !== "decision");

export const decisionModel = (catalog: ModelCatalog): ModelPricing | null =>
    catalog.models.find((model) => model.kind === "decision") ?? null;

export const modelLabel = (model: ModelPricing): string =>
    model.variant ? `${model.name} (${model.variant})` : model.name;
