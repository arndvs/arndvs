import { emptyTokenUsage } from "./token-usage";
import type { TokenUsage } from "./token-usage";

/** Billing months vary in length. A fixed 30 days keeps scenarios comparable. */
export const DAYS_PER_MONTH = 30;

/**
 * A five-minute cache entry is written at most once per five-minute window, so
 * one model sees at most this many writes a day. It assumes traffic never
 * pauses long enough for the entry to expire, which makes it a ceiling.
 */
export const MAX_CACHE_WRITES_PER_DAY = (24 * 60) / 5;

/**
 * Tokens each decision-model call spends on its question definitions and
 * options, on top of the text it judges. An assumption: decision models bill
 * everything sent, and a short question set lands around this size.
 */
export const DECISION_INSTRUCTION_TOKENS = 100;

/**
 * No real scenario has a billion queries a day or a billion-token prompt. A
 * count past this is a corrupt input, such as a hand-edited link, and products
 * of several such counts would overflow to `Infinity`.
 */
export const MAX_SCENARIO_COUNT = 1_000_000_000;

/** The pipeline steps a decision model, such as Jev, can take over from a fixed rule. */
export type Decision = "route" | "filter" | "gate" | "cacheMatch";

/** One day of traffic through a RAG pipeline, and the levers applied to it. */
export type RagScenario = {
    queriesPerDay: number;
    prompt: {
        systemTokens: number;
        questionTokens: number;
        chunkTokens: number;
        /** Chunks that reach the model when nothing filters them. */
        chunks: number;
        outputTokens: number;
    };
    /** Share of queries answered from a response cache without reaching any model, from 0 to 1. */
    responseCacheHitRate: number;
    /** Bills the system prompt as cached input after each cache write. */
    promptCaching: boolean;
    routing: {
        /** Share of answered queries sent to the routed model, from 0 to 1. Zero means no router. */
        share: number;
        /** Share of routing decisions that pick the right model, from 0 to 1, for whichever router runs. */
        accuracy: number;
    };
    decisions: {
        /** A decision model classifies each question, instead of a keyword rule. */
        route: boolean;
        /** A decision model scores `candidates` retrieved chunks and keeps the best `keep`. */
        filter: { enabled: boolean; candidates: number; keep: number };
        /** A decision model checks whether the chunks can answer the question, and skips generation when they can't. */
        gate: { enabled: boolean; unanswerableRate: number };
        /** A decision model confirms each response-cache hit, instead of an embedding-distance cutoff. */
        cacheMatch: boolean;
    };
};

/**
 * The worked example from the course: 10,000 queries a day, 2,000 input
 * tokens and 500 output tokens each, with no levers applied.
 */
export const defaultRagScenario = (): RagScenario => ({
    queriesPerDay: 10_000,
    prompt: {
        systemTokens: 300,
        questionTokens: 200,
        chunkTokens: 500,
        chunks: 3,
        outputTokens: 500,
    },
    responseCacheHitRate: 0,
    promptCaching: false,
    routing: { share: 0, accuracy: 1 },
    decisions: {
        route: false,
        filter: { enabled: false, candidates: 8, keep: 3 },
        gate: { enabled: false, unanswerableRate: 0.1 },
        cacheMatch: false,
    },
});

/** Treats anything that isn't a non-negative number up to `MAX_SCENARIO_COUNT` as zero. */
const count = (value: number): number =>
    Number.isFinite(value) && value > 0 && value <= MAX_SCENARIO_COUNT ? value : 0;

/** Clamps a share to 0–1, treating anything that isn't a number as zero. */
const fraction = (value: number): number =>
    Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;

/**
 * Replaces corrupt counts with zero and clamps shares to 0–1. Every function
 * below runs on the result, so a hand-edited link can't put `Infinity` or
 * `NaN` into a total.
 */
export const normalizeScenario = (scenario: RagScenario): RagScenario => {
    const { prompt, routing, decisions } = scenario;

    return {
        queriesPerDay: count(scenario.queriesPerDay),
        prompt: {
            systemTokens: count(prompt.systemTokens),
            questionTokens: count(prompt.questionTokens),
            chunkTokens: count(prompt.chunkTokens),
            chunks: count(prompt.chunks),
            outputTokens: count(prompt.outputTokens),
        },
        responseCacheHitRate: fraction(scenario.responseCacheHitRate),
        promptCaching: scenario.promptCaching === true,
        routing: { share: fraction(routing.share), accuracy: fraction(routing.accuracy) },
        decisions: {
            route: decisions.route === true,
            filter: {
                enabled: decisions.filter.enabled === true,
                candidates: count(decisions.filter.candidates),
                keep: count(decisions.filter.keep),
            },
            gate: {
                enabled: decisions.gate.enabled === true,
                unanswerableRate: fraction(decisions.gate.unanswerableRate),
            },
            cacheMatch: decisions.cacheMatch === true,
        },
    };
};

/** How one day's queries move through the pipeline. Counts can be fractional averages. */
export type DailyVolumes = {
    queries: number;
    /** Queries the response cache didn't answer. Every later step runs on these. */
    cacheMisses: number;
    /** Cache misses the gate turned away before generation. */
    gated: number;
    /** Queries that reached a generating model. */
    answered: number;
    toMain: number;
    toRouted: number;
    /** Answered queries the router sent to the wrong model. */
    misrouted: number;
};

export const dailyVolumes = (scenario: RagScenario): DailyVolumes => {
    const {
        queriesPerDay: queries,
        responseCacheHitRate,
        routing,
        decisions,
    } = normalizeScenario(scenario);
    const cacheMisses = queries * (1 - responseCacheHitRate);
    const gated = decisions.gate.enabled ? cacheMisses * decisions.gate.unanswerableRate : 0;
    const answered = cacheMisses - gated;
    const toRouted = answered * routing.share;

    return {
        queries,
        cacheMisses,
        gated,
        answered,
        toMain: answered - toRouted,
        toRouted,
        misrouted: routing.share > 0 ? answered * (1 - routing.accuracy) : 0,
    };
};

/** Chunks that reach the generating model, after the filter if it runs. */
export const chunksSent = (scenario: RagScenario): number => {
    const { prompt, decisions } = normalizeScenario(scenario);
    const { filter } = decisions;

    return filter.enabled ? Math.min(filter.keep, filter.candidates) : prompt.chunks;
};

/** Every input token one generating call sends: system prompt, question, and chunks. */
export const promptTokens = (scenario: RagScenario): number => {
    const { prompt } = normalizeScenario(scenario);

    return prompt.systemTokens + prompt.questionTokens + chunksSent(scenario) * prompt.chunkTokens;
};

/**
 * One model's token usage for a day of `calls` generating requests. With
 * prompt caching, the system prompt is the cached prefix: it's written once
 * per five-minute window and read from the cache on every other call.
 */
export const generationUsage = (scenario: RagScenario, calls: number): TokenUsage => {
    const normalized = normalizeScenario(scenario);
    const { systemTokens, outputTokens } = normalized.prompt;
    const safeCalls = count(calls);
    const usage: TokenUsage = {
        ...emptyTokenUsage(),
        uncachedInput: safeCalls * (promptTokens(normalized) - systemTokens),
        output: safeCalls * outputTokens,
    };

    if (!normalized.promptCaching) {
        usage.uncachedInput += safeCalls * systemTokens;

        return usage;
    }

    const writes = Math.min(safeCalls, MAX_CACHE_WRITES_PER_DAY);
    usage.cacheWrite5m = writes * systemTokens;
    usage.cacheRead = (safeCalls - writes) * systemTokens;

    return usage;
};

/** A day of calls to the decision model for one decision. */
export type DecisionCalls = {
    decision: Decision;
    calls: number;
    /** Input tokens per call, including the question definitions. */
    tokensPerCall: number;
    /** The decision whose call also answers this one, which makes this one free. */
    sharedWith: Decision | null;
};

/**
 * The decision-model calls the enabled decisions make in a day. Routing reads
 * only the question, so it can run alongside retrieval. The filter and the
 * gate judge the same question and chunks, so they share one call when both
 * run.
 */
export const decisionCalls = (scenario: RagScenario): DecisionCalls[] => {
    const normalized = normalizeScenario(scenario);
    const { prompt, decisions, routing } = normalized;
    const volumes = dailyVolumes(normalized);
    const calls: DecisionCalls[] = [];

    if (decisions.route && routing.share > 0) {
        calls.push({
            decision: "route",
            calls: volumes.cacheMisses,
            tokensPerCall: prompt.questionTokens + DECISION_INSTRUCTION_TOKENS,
            sharedWith: null,
        });
    }

    if (decisions.filter.enabled) {
        calls.push({
            decision: "filter",
            calls: volumes.cacheMisses,
            tokensPerCall:
                prompt.questionTokens +
                decisions.filter.candidates * prompt.chunkTokens +
                DECISION_INSTRUCTION_TOKENS,
            sharedWith: null,
        });
    }

    if (decisions.gate.enabled) {
        calls.push(
            decisions.filter.enabled
                ? { decision: "gate", calls: 0, tokensPerCall: 0, sharedWith: "filter" }
                : {
                      decision: "gate",
                      calls: volumes.cacheMisses,
                      tokensPerCall:
                          prompt.questionTokens +
                          prompt.chunks * prompt.chunkTokens +
                          DECISION_INSTRUCTION_TOKENS,
                      sharedWith: null,
                  },
        );
    }

    // Compares the new question with the closest cached one on every query, so
    // it runs before the cache answers. Its payoff is fewer wrong cache hits,
    // which shows up in quality rather than in the hit rate.
    if (decisions.cacheMatch) {
        calls.push({
            decision: "cacheMatch",
            calls: volumes.queries,
            tokensPerCall: 2 * prompt.questionTokens + DECISION_INSTRUCTION_TOKENS,
            sharedWith: null,
        });
    }

    return calls;
};
