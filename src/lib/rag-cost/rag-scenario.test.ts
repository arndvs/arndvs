import { describe, expect, it } from "vitest";

import {
    MAX_CACHE_WRITES_PER_DAY,
    chunksSent,
    dailyVolumes,
    decisionCalls,
    defaultRagScenario,
    generationUsage,
    promptTokens,
} from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

/** The default scenario with some fields replaced. Nested groups replace whole. */
const scenario = (changes: Partial<RagScenario> = {}): RagScenario => ({
    ...defaultRagScenario(),
    ...changes,
});

const decisions = (changes: Partial<RagScenario["decisions"]>): Partial<RagScenario> => ({
    decisions: { ...defaultRagScenario().decisions, ...changes },
});

describe("promptTokens", () => {
    it("adds the course’s five chunks to 3,000 tokens, not the 2,800 the course states", () => {
        const fiveChunks = scenario({ prompt: { ...defaultRagScenario().prompt, chunks: 5 } });

        expect(promptTokens(fiveChunks)).toBe(3_000);
    });

    it("counts only the chunks the filter keeps", () => {
        const filtered = scenario(decisions({ filter: { enabled: true, candidates: 8, keep: 3 } }));

        expect(chunksSent(filtered)).toBe(3);
        expect(promptTokens(filtered)).toBe(2_000);
    });

    it("never keeps more chunks than the filter was given", () => {
        const filtered = scenario(decisions({ filter: { enabled: true, candidates: 2, keep: 5 } }));

        expect(chunksSent(filtered)).toBe(2);
    });
});

describe("generationUsage", () => {
    it("bills the whole prompt as uncached input without prompt caching", () => {
        expect(generationUsage(scenario(), 10)).toEqual({
            uncachedInput: 20_000,
            cacheRead: 0,
            cacheWrite5m: 0,
            cacheWrite1h: 0,
            output: 5_000,
        });
    });

    it("reads the system prompt from the cache, with at most one write per five minutes", () => {
        const usage = generationUsage(scenario({ promptCaching: true }), 10_000);

        expect(usage.cacheWrite5m).toBe(MAX_CACHE_WRITES_PER_DAY * 300);
        expect(usage.cacheRead).toBe((10_000 - MAX_CACHE_WRITES_PER_DAY) * 300);
        expect(usage.uncachedInput).toBe(10_000 * 1_700);
    });

    it("writes on every call when traffic is too thin to keep the cache warm", () => {
        const usage = generationUsage(scenario({ promptCaching: true }), 100);

        expect(usage.cacheWrite5m).toBe(100 * 300);
        expect(usage.cacheRead).toBe(0);
    });
});

describe("dailyVolumes", () => {
    it("sends only cache misses onward and splits them by the routing share", () => {
        const volumes = dailyVolumes(
            scenario({ responseCacheHitRate: 0.3, routing: { share: 0.7, accuracy: 0.8 } }),
        );

        expect(volumes.cacheMisses).toBeCloseTo(7_000);
        expect(volumes.toRouted).toBeCloseTo(4_900);
        expect(volumes.toMain).toBeCloseTo(2_100);
        expect(volumes.misrouted).toBeCloseTo(1_400);
    });

    it("turns gated queries away before generation", () => {
        const volumes = dailyVolumes(
            scenario(decisions({ gate: { enabled: true, unanswerableRate: 0.1 } })),
        );

        expect(volumes.gated).toBeCloseTo(1_000);
        expect(volumes.answered).toBeCloseTo(9_000);
    });

    it("reports no misroutes when nothing is routed", () => {
        expect(dailyVolumes(scenario({ routing: { share: 0, accuracy: 0.5 } })).misrouted).toBe(0);
    });

    it("clamps shares outside 0–1, such as from a hand-edited URL", () => {
        const volumes = dailyVolumes(
            scenario({ responseCacheHitRate: 2, routing: { share: Number.NaN, accuracy: -1 } }),
        );

        expect(volumes.cacheMisses).toBe(0);
        expect(volumes.toRouted).toBe(0);
    });
});

describe("decisionCalls", () => {
    it("makes no calls when every decision is left to a rule", () => {
        expect(decisionCalls(scenario({ routing: { share: 0.7, accuracy: 0.8 } }))).toEqual([]);
    });

    it("skips routing calls when there is nothing to route", () => {
        expect(decisionCalls(scenario(decisions({ route: true })))).toEqual([]);
    });

    it("routes every cache miss, gated ones included, from the question alone", () => {
        const [route] = decisionCalls({
            ...scenario({ routing: { share: 0.7, accuracy: 0.8 } }),
            decisions: {
                ...defaultRagScenario().decisions,
                route: true,
                gate: { enabled: true, unanswerableRate: 0.1 },
            },
        });

        expect(route).toMatchObject({ decision: "route", calls: 10_000, tokensPerCall: 300 });
    });

    it("lets the gate share the filter’s call, since both judge the same chunks", () => {
        const calls = decisionCalls(
            scenario(
                decisions({
                    filter: { enabled: true, candidates: 8, keep: 3 },
                    gate: { enabled: true, unanswerableRate: 0.1 },
                }),
            ),
        );

        expect(
            calls.map(({ decision, calls: count, sharedWith }) => [decision, count, sharedWith]),
        ).toEqual([
            ["filter", 10_000, null],
            ["gate", 0, "filter"],
        ]);
        expect(calls[0]?.tokensPerCall).toBe(4_300);
    });

    it("checks every incoming query against the cache, hits included", () => {
        const [match] = decisionCalls(
            scenario({ responseCacheHitRate: 0.3, ...decisions({ cacheMatch: true }) }),
        );

        expect(match).toMatchObject({ decision: "cacheMatch", calls: 10_000, tokensPerCall: 500 });
    });
});
