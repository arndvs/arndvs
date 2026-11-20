import { describe, expect, it } from "vitest";

import {
    DECISION_MS,
    EMBEDDING_MS,
    FIRST_TOKEN_MS,
    OUTPUT_TOKENS_PER_SECOND,
    PEAK_FACTOR,
    RETRIEVAL_MS,
    TOKENS_PER_MINUTE_LIMIT,
    estimateCapacity,
    estimateLatency,
} from "./latency";
import { defaultRagScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

const withDecisions = (changes: Partial<RagScenario["decisions"]>): RagScenario => {
    const base = defaultRagScenario();

    return { ...base, decisions: { ...base.decisions, ...changes } };
};

describe("estimateLatency", () => {
    it("adds embedding, retrieval, first token, and streaming for a plain question", () => {
        const { firstTokenMs, completeMs } = estimateLatency(defaultRagScenario());

        expect(firstTokenMs).toBe(EMBEDDING_MS + RETRIEVAL_MS + FIRST_TOKEN_MS);
        expect(completeMs).toBe(firstTokenMs + (500 / OUTPUT_TOKENS_PER_SECOND) * 1000);
    });

    it("runs routing alongside retrieval, so it only adds the time it takes beyond it", () => {
        const routed = {
            ...withDecisions({ route: true }),
            routing: { share: 0.7, accuracy: 1 },
        };

        expect(estimateLatency(routed).firstTokenMs).toBe(
            Math.max(EMBEDDING_MS + RETRIEVAL_MS, DECISION_MS) + FIRST_TOKEN_MS,
        );
    });

    it("adds no routing time when nothing is routed", () => {
        expect(estimateLatency(withDecisions({ route: true })).firstTokenMs).toBe(
            estimateLatency(defaultRagScenario()).firstTokenMs,
        );
    });

    it("waits for retrieval before the filter, and counts the gate's shared call once", () => {
        const both = withDecisions({
            filter: { enabled: true, candidates: 8, keep: 3 },
            gate: { enabled: true, unanswerableRate: 0.1 },
        });

        expect(estimateLatency(both).firstTokenMs).toBe(
            EMBEDDING_MS + RETRIEVAL_MS + DECISION_MS + FIRST_TOKEN_MS,
        );
    });

    it("puts the cache-hit check before everything else", () => {
        const { stages } = estimateLatency(withDecisions({ cacheMatch: true }));

        expect(stages[0]).toEqual({
            label: "Check the cache",
            startMs: 0,
            durationMs: DECISION_MS,
        });
        expect(stages[1]?.startMs).toBe(DECISION_MS);
    });
});

describe("estimateCapacity", () => {
    it("measures each model's peak tokens per minute on its own", () => {
        const routed = { ...defaultRagScenario(), routing: { share: 0.7, accuracy: 1 } };
        const { loads } = estimateCapacity(routed);
        // 2,000 prompt + 500 output tokens per call, spread over 1,440 minutes, three times busier at peak.
        const perCall = (2_500 / 1_440) * PEAK_FACTOR;

        expect(loads.map((entry) => entry.model)).toEqual(["main", "routed"]);
        expect(loads[0]?.tokensPerMinute).toBeCloseTo(3_000 * perCall);
        expect(loads[1]?.tokensPerMinute).toBeCloseTo(7_000 * perCall);
    });

    it("names the busiest model as the first to hit its limit", () => {
        const routed = { ...defaultRagScenario(), routing: { share: 0.7, accuracy: 1 } };
        const { firstLimit } = estimateCapacity(routed);

        expect(firstLimit?.model).toBe("routed");
        expect(firstLimit?.headroom).toBeCloseTo(
            TOKENS_PER_MINUTE_LIMIT / ((7_000 * 2_500 * 3) / 1_440),
        );
    });

    it("reports headroom below 1 when a model is already over its limit", () => {
        const heavy = { ...defaultRagScenario(), queriesPerDay: 1_000_000 };

        expect(estimateCapacity(heavy).firstLimit?.headroom).toBeLessThan(1);
    });

    it("leaves cache hits out of calls in flight", () => {
        const plain = estimateCapacity(defaultRagScenario()).peakInFlight;
        const cached = estimateCapacity({ ...defaultRagScenario(), responseCacheHitRate: 0.5 });

        expect(cached.peakInFlight).toBeCloseTo(plain / 2);
    });

    it("reports no limit when there is no traffic", () => {
        const idle = estimateCapacity({ ...defaultRagScenario(), queriesPerDay: 0 });

        expect(idle.firstLimit).toBeNull();
        expect(idle.peakInFlight).toBe(0);
    });
});
