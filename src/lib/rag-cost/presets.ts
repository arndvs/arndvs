import { defaultRagScenario, normalizeScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

type ScenarioOverrides = Partial<Omit<RagScenario, "prompt" | "routing" | "decisions">> & {
    prompt?: Partial<RagScenario["prompt"]>;
    routing?: Partial<RagScenario["routing"]>;
    decisions?: {
        route?: boolean;
        filter?: Partial<RagScenario["decisions"]["filter"]>;
        gate?: Partial<RagScenario["decisions"]["gate"]>;
        cacheMatch?: boolean;
    };
};

const withOverrides = (overrides: ScenarioOverrides): RagScenario => {
    const base = defaultRagScenario();

    return normalizeScenario({
        ...base,
        ...overrides,
        prompt: { ...base.prompt, ...overrides.prompt },
        routing: { ...base.routing, ...overrides.routing },
        decisions: {
            ...base.decisions,
            ...overrides.decisions,
            filter: { ...base.decisions.filter, ...overrides.decisions?.filter },
            gate: { ...base.decisions.gate, ...overrides.decisions?.gate },
        },
    });
};

export type ScenarioPreset = {
    id: "course" | "support" | "internalDocs";
    label: string;
    description: string;
    scenario: RagScenario;
};

/** Starting workloads for common RAG patterns. These set inputs only; pricing remains catalog-driven. */
export const RAG_PRESETS: readonly ScenarioPreset[] = [
    {
        id: "course",
        label: "Course example",
        description: "The worked example: 10,000 questions a day and a 2,000-token prompt.",
        scenario: withOverrides({}),
    },
    {
        id: "support",
        label: "Support bot",
        description: "Higher daily volume, shorter answers, caching, and a routed model.",
        scenario: withOverrides({
            queriesPerDay: 20_000,
            prompt: {
                systemTokens: 600,
                questionTokens: 160,
                chunkTokens: 450,
                chunks: 4,
                outputTokens: 350,
            },
            responseCacheHitRate: 0.15,
            promptCaching: true,
            routing: { share: 0.35, accuracy: 0.9 },
            decisions: { gate: { enabled: true, unanswerableRate: 0.08 } },
        }),
    },
    {
        id: "internalDocs",
        label: "Internal docs search",
        description: "Lower volume, chunk filtering, answerability checks, and repeated queries.",
        scenario: withOverrides({
            queriesPerDay: 6_500,
            prompt: {
                systemTokens: 800,
                questionTokens: 150,
                chunkTokens: 400,
                chunks: 5,
                outputTokens: 300,
            },
            responseCacheHitRate: 0.25,
            promptCaching: true,
            decisions: {
                filter: { enabled: true, candidates: 8, keep: 3 },
                gate: { enabled: true, unanswerableRate: 0.12 },
            },
        }),
    },
];

/** Returns a fresh scenario so editing one preset never mutates the shared definition. */
export const scenarioFromPreset = (presetId: ScenarioPreset["id"]): RagScenario => {
    const preset = RAG_PRESETS.find((entry) => entry.id === presetId);
    if (!preset) throw new Error(`Unknown RAG scenario preset: ${presetId}`);

    return structuredClone(preset.scenario);
};
