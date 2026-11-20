import { dailyVolumes, decisionCalls, normalizeScenario, promptTokens } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

/** Embedding one question. The course puts this at 50–150 ms. */
export const EMBEDDING_MS = 100;

/** A vector search on an index under 10 million vectors. The course says under 100 ms. */
export const RETRIEVAL_MS = 80;

/** Time from sending the prompt to the first streamed token. The course says under 500 ms. */
export const FIRST_TOKEN_MS = 450;

/**
 * Streaming speed once the answer starts. The course has a 1,000-token answer
 * taking 2–5 seconds, which is 200–500 tokens a second; this takes the slow end.
 */
export const OUTPUT_TOKENS_PER_SECOND = 200;

/** One decision-model call. Jev's are reported at 70–500 ms; this takes a middle value. */
export const DECISION_MS = 200;

/** How much busier the busiest minute is than the day's average. */
export const PEAK_FACTOR = 3;

/**
 * A planning ceiling for tokens per minute on one model. Real limits depend on
 * the provider and account tier, so check yours.
 */
export const TOKENS_PER_MINUTE_LIMIT = 2_000_000;

const MINUTES_PER_DAY = 24 * 60;
const SECONDS_PER_DAY = MINUTES_PER_DAY * 60;

/** One step on the way to an answer, placed on a timeline in milliseconds. */
export type LatencyStage = { label: string; startMs: number; durationMs: number };

export type LatencyEstimate = {
    stages: LatencyStage[];
    /** When the first word of the answer appears for a question the cache didn't answer. */
    firstTokenMs: number;
    /** When the whole answer has streamed. */
    completeMs: number;
};

/**
 * Times one uncached question. The cache-hit check runs first, since it decides
 * whether anything else runs. Routing reads only the question, so it runs
 * alongside embedding and retrieval and only adds time when it's slower than
 * both. The filter and the answerability check need the chunks, so they wait
 * for retrieval, and share one call.
 */
export const estimateLatency = (scenario: RagScenario): LatencyEstimate => {
    const normalized = normalizeScenario(scenario);
    const { decisions, routing } = normalized;
    const stages: LatencyStage[] = [];
    let clock = 0;

    if (decisions.cacheMatch) {
        stages.push({ label: "Check the cache", startMs: clock, durationMs: DECISION_MS });
        clock += DECISION_MS;
    }

    stages.push({ label: "Embed the question", startMs: clock, durationMs: EMBEDDING_MS });
    stages.push({
        label: "Search the index",
        startMs: clock + EMBEDDING_MS,
        durationMs: RETRIEVAL_MS,
    });
    let retrievalDone = clock + EMBEDDING_MS + RETRIEVAL_MS;

    if (decisions.route && routing.share > 0) {
        stages.push({ label: "Route the question", startMs: clock, durationMs: DECISION_MS });
        retrievalDone = Math.max(retrievalDone, clock + DECISION_MS);
    }
    clock = retrievalDone;

    if (decisions.filter.enabled || decisions.gate.enabled) {
        const label = decisions.filter.enabled ? "Score the chunks" : "Check the chunks";
        stages.push({ label, startMs: clock, durationMs: DECISION_MS });
        clock += DECISION_MS;
    }

    stages.push({ label: "First token", startMs: clock, durationMs: FIRST_TOKEN_MS });
    const firstTokenMs = clock + FIRST_TOKEN_MS;
    const streamMs = (normalized.prompt.outputTokens / OUTPUT_TOKENS_PER_SECOND) * 1000;
    stages.push({ label: "Stream the answer", startMs: firstTokenMs, durationMs: streamMs });

    return { stages, firstTokenMs, completeMs: firstTokenMs + streamMs };
};

/** Peak tokens per minute for one model, and how far traffic can grow before it hits the limit. */
export type ModelLoad = {
    model: "main" | "routed" | "decision";
    tokensPerMinute: number;
    /** Traffic multiple at which this model reaches the limit. Below 1 means it's over already. */
    headroom: number;
};

export type CapacityEstimate = {
    /** Requests a second in the busiest minute. */
    peakRequestsPerSecond: number;
    /** Generating calls running at once in the busiest minute. */
    peakInFlight: number;
    loads: ModelLoad[];
    /** The model that hits its limit first, or `null` when nothing is sending tokens. */
    firstLimit: ModelLoad | null;
};

/**
 * Peak load, from the day's average times `PEAK_FACTOR`. Rate limits apply to
 * each model separately, so each model's tokens per minute is measured on its
 * own. Cached answers send no tokens and finish almost at once, so only
 * answered questions count toward calls in flight.
 */
export const estimateCapacity = (scenario: RagScenario): CapacityEstimate => {
    const normalized = normalizeScenario(scenario);
    const volumes = dailyVolumes(normalized);
    const { completeMs } = estimateLatency(normalized);
    const tokensPerCall = promptTokens(normalized) + normalized.prompt.outputTokens;
    const decisionTokens = decisionCalls(normalized).reduce(
        (sum, entry) => sum + entry.calls * entry.tokensPerCall,
        0,
    );

    const perMinuteAtPeak = (tokensPerDay: number): number =>
        (tokensPerDay / MINUTES_PER_DAY) * PEAK_FACTOR;
    const load = (model: ModelLoad["model"], tokensPerDay: number): ModelLoad => {
        const tokensPerMinute = perMinuteAtPeak(tokensPerDay);

        return {
            model,
            tokensPerMinute,
            headroom: tokensPerMinute > 0 ? TOKENS_PER_MINUTE_LIMIT / tokensPerMinute : Infinity,
        };
    };

    const loads = [
        load("main", volumes.toMain * tokensPerCall),
        ...(volumes.toRouted > 0 ? [load("routed", volumes.toRouted * tokensPerCall)] : []),
        ...(decisionTokens > 0 ? [load("decision", decisionTokens)] : []),
    ].filter((entry) => entry.tokensPerMinute > 0);

    const firstLimit = loads.reduce<ModelLoad | null>(
        (lowest, entry) => (lowest === null || entry.headroom < lowest.headroom ? entry : lowest),
        null,
    );

    return {
        peakRequestsPerSecond: (volumes.queries / SECONDS_PER_DAY) * PEAK_FACTOR,
        peakInFlight: (volumes.answered / SECONDS_PER_DAY) * PEAK_FACTOR * (completeMs / 1000),
        loads,
        firstLimit,
    };
};
