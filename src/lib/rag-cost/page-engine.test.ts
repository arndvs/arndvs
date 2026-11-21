import { describe, expect, it } from "vitest";

import { costComposition } from "./composition";
import { estimateScenario } from "./estimate";
import type { ScenarioRates } from "./estimate";
import { explainEstimate } from "./explain";
import { settingImpacts } from "./impact";
import { INPUTS } from "./inputs";
import { leverSteps, withoutLevers } from "./levers";
import { MODEL_CATALOG } from "./model-pricing";
import { RAG_PRESETS, scenarioFromPreset } from "./presets";
import { defaultRagScenario, normalizeScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";
import { decodeState, encodeState } from "./url-state";
import type { PageState } from "./url-state";
import { buildEstimatorView } from "./view-model";

const rates: ScenarioRates = {
    main: { input: 2, cachedInput: 0.2, output: 10, cacheWrite5m: 2.5, cacheWrite1h: 4 },
    routed: { input: 1, cachedInput: 0.1, output: 5, cacheWrite5m: 1.25, cacheWrite1h: 2 },
    decision: { input: 0.042, cachedInput: 0.042, output: 0 },
};

/** Every lever and decision on, with values that don't divide evenly. */
const everythingOn = (): RagScenario => ({
    queriesPerDay: 12_345,
    prompt: {
        systemTokens: 1_337,
        questionTokens: 217,
        chunkTokens: 481,
        chunks: 5,
        outputTokens: 613,
    },
    responseCacheHitRate: 0.27,
    promptCaching: true,
    routing: { share: 0.63, accuracy: 0.81 },
    decisions: {
        route: true,
        filter: { enabled: true, candidates: 9, keep: 4 },
        gate: { enabled: true, unanswerableRate: 0.13 },
        cacheMatch: true,
    },
});

const defaults = (): PageState => ({
    scenario: defaultRagScenario(),
    mainModelId: "claude-sonnet-5-5",
    routedModelId: "claude-haiku-4-5",
});

const modelIds = new Set(["claude-sonnet-5-5", "claude-haiku-4-5", "gpt-6-1-sol"]);

describe("explainEstimate", () => {
    it("reproduces every line’s cost exactly, so the math shown is the math used", () => {
        for (const scenario of [defaultRagScenario(), everythingOn()]) {
            const estimate = estimateScenario(scenario, rates);
            const formulas = explainEstimate(estimate, rates);

            expect(formulas.main.dollars).toBe(estimate.main.perDay);
            expect(formulas.routed.dollars).toBe(estimate.routed.perDay);
            formulas.decisions.forEach((entry) => expect(entry.formula.dollars).toBe(entry.perDay));
        }
    });

    it("shows the cache-write fallback price for a model with no write premium", () => {
        const noPremium = { ...rates, main: { input: 2, cachedInput: 0.1, output: 10 } };
        const estimate = estimateScenario(
            { ...defaultRagScenario(), promptCaching: true },
            noPremium,
        );
        const writes = explainEstimate(estimate, noPremium).main.terms.find(
            (term) => term.field === "cacheWrite5m",
        );

        expect(writes?.pricePerMillion).toBe(2);
    });
});

describe("leverSteps", () => {
    it("ends on the scenario’s own monthly cost", () => {
        const steps = leverSteps(everythingOn(), rates);

        expect(steps.at(-1)?.perMonth).toBe(estimateScenario(everythingOn(), rates).perMonth);
    });

    it("starts from the scenario with every lever off", () => {
        const [baseline] = leverSteps(everythingOn(), rates);

        expect(baseline?.perMonth).toBe(
            estimateScenario(withoutLevers(everythingOn()), rates).perMonth,
        );
    });

    it("changes add up to the difference between no levers and all of them", () => {
        const steps = leverSteps(everythingOn(), rates);
        const changes = steps.reduce((sum, step) => sum + step.change, 0);

        expect(changes).toBeCloseTo((steps.at(-1)?.perMonth ?? 0) - (steps[0]?.perMonth ?? 0), 6);
    });

    it("lists only the levers that are on", () => {
        const steps = leverSteps(
            {
                ...defaultRagScenario(),
                routing: { share: 0.7, accuracy: 0.9 },
                promptCaching: true,
            },
            rates,
        );

        expect(steps.map((step) => step.id)).toEqual(["baseline", "routing", "promptCaching"]);
        expect(steps[1]?.change).toBeCloseTo(1_755 - 2_700);
    });
});

describe("inputs", () => {
    it("gives every input its own link key", () => {
        const params = INPUTS.map((input) => input.param);

        expect(new Set(params).size).toBe(params.length);
        expect(params).not.toContain("m");
        expect(params).not.toContain("r");
    });
});

describe("url state", () => {
    it("keeps the default page’s URL bare", () => {
        expect(encodeState(defaults(), defaults()).toString()).toBe("");
    });

    it("restores every input and both models from a link", () => {
        const state: PageState = {
            scenario: everythingOn(),
            mainModelId: "gpt-6-1-sol",
            routedModelId: "claude-sonnet-5-5",
        };

        const restored = decodeState(encodeState(state, defaults()), defaults(), modelIds);

        expect(restored).toEqual({ ...state, scenario: normalizeScenario(everythingOn()) });
    });

    it("keeps the link free of float noise", () => {
        const scenario = { ...defaultRagScenario(), routing: { share: 0.1 + 0.2, accuracy: 1 } };

        expect(encodeState({ ...defaults(), scenario }, defaults()).get("rs")).toBe("0.3");
    });

    it("ignores garbage in a hand-edited link instead of breaking", () => {
        const params = new URLSearchParams("q=abc&ch=&rs=7&pc=yes&hit=-2&sys=1e308&m=not-a-model");

        const restored = decodeState(params, defaults(), modelIds);

        expect(restored.scenario.queriesPerDay).toBe(10_000);
        expect(restored.scenario.prompt.chunks).toBe(3);
        expect(restored.scenario.routing.share).toBe(1);
        expect(restored.scenario.promptCaching).toBe(false);
        expect(restored.scenario.responseCacheHitRate).toBe(0);
        expect(restored.scenario.prompt.systemTokens).toBe(0);
        expect(restored.mainModelId).toBe("claude-sonnet-5-5");
    });

    it("never changes the defaults it reads over", () => {
        const base = defaults();
        decodeState(new URLSearchParams("q=5&jf=1"), base, modelIds);

        expect(base).toEqual(defaults());
    });
});

describe("worksheet engine data", () => {
    it("makes the lever waterfall add from baseline to the selected total", () => {
        const scenario = everythingOn();
        const impacts = settingImpacts(scenario, rates);
        const baseline = leverSteps(scenario, rates)[0].perMonth;
        const changes = Object.values(impacts.levers).reduce(
            (sum, impact) => sum + (impact?.change ?? 0),
            0,
        );
        const policyChanges = Object.values(impacts.policies).reduce(
            (sum, impact) => sum + (impact?.net ?? 0),
            0,
        );

        expect(baseline + changes + policyChanges).toBeCloseTo(
            estimateScenario(scenario, rates).perMonth,
            8,
        );
    });

    it("splits each decision policy into added cost, avoided cost, and net", () => {
        const impacts = settingImpacts(everythingOn(), rates);

        Object.values(impacts.policies).forEach((impact) => {
            expect(impact).not.toBeNull();
            if (!impact) return;

            expect(impact.adds - impact.avoided).toBe(impact.net);
        });
    });

    it("makes composition parts total exactly the estimator cost", () => {
        const estimate = estimateScenario(everythingOn(), rates);
        const total = costComposition(estimate, rates).reduce(
            (sum, part) => sum + part.perMonth,
            0,
        );

        expect(total).toBeCloseTo(estimate.perMonth, 10);
    });

    it("keeps presets normalized and returns an independent scenario", () => {
        RAG_PRESETS.forEach((preset) => {
            expect(normalizeScenario(preset.scenario)).toEqual(preset.scenario);
        });
        expect(estimateScenario(scenarioFromPreset("course"), rates).perMonth).toBe(2_700);

        const first = scenarioFromPreset("support");
        first.queriesPerDay = 1;
        expect(scenarioFromPreset("support").queriesPerDay).toBe(20_000);
    });

    it("builds a complete model-driven view from page state and catalog", () => {
        const view = buildEstimatorView(
            {
                scenario: everythingOn(),
                mainModelId: "claude-sonnet-5-5",
                routedModelId: "claude-haiku-4-5",
            },
            MODEL_CATALOG,
        );

        expect(view.monthlyTotal).toBe(view.estimate.perMonth);
        expect(view.baselineMonthly).toBeGreaterThan(view.monthlyTotal);
        expect(view.modelComparison[0]?.monthlyCost).toBeLessThanOrEqual(
            view.modelComparison.at(-1)?.monthlyCost ?? 0,
        );
        expect(view.composition.reduce((sum, part) => sum + part.perMonth, 0)).toBeCloseTo(
            view.monthlyTotal,
            10,
        );
    });
});

describe("filter sizes", () => {
    const candidates = INPUTS.find((input) => input.param === "fc")!;
    const keep = INPUTS.find((input) => input.param === "fk")!;

    it("lowers chunks kept when fewer chunks are scored", () => {
        const scenario = everythingOn();
        if (candidates.kind !== "range") throw new Error("fc should be a range");
        candidates.set(scenario, 2);

        expect(scenario.decisions.filter.keep).toBe(2);
    });

    it("never shows more chunks kept than scored, even from a hand-edited link", () => {
        const restored = decodeState(new URLSearchParams("jf=1&fc=4&fk=10"), defaults(), modelIds);

        expect(keep.get(restored.scenario)).toBe(4);
        expect(estimateScenario(restored.scenario, rates).decisions[0]?.tokensPerCall).toBe(
            200 + 4 * 500 + 100,
        );
    });
});
