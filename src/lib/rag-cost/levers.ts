import { estimateScenario } from "./estimate";
import type { ScenarioRates } from "./estimate";
import { normalizeScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

export type LeverId =
    | "routing"
    | "responseCache"
    | "promptCaching"
    | "filter"
    | "gate"
    | "route"
    | "cacheMatch";

/** The monthly cost after a lever is applied, and what applying it changed. */
export type LeverStep = {
    id: LeverId | "baseline";
    label: string;
    perMonth: number;
    /** Negative when the lever saved money. Zero for the baseline. */
    change: number;
};

type Lever = {
    id: LeverId;
    label: string;
    isOn: (scenario: RagScenario) => boolean;
    /** Copies this lever's settings from `from` onto `target`. */
    apply: (target: RagScenario, from: RagScenario) => void;
};

/**
 * The levers in the order the waterfall applies them. Each step's change
 * depends on the ones before it: caching saves less once routing has moved
 * traffic to a cheaper model. The order is fixed so the same scenario always
 * tells the same story.
 */
const LEVERS: readonly Lever[] = [
    {
        id: "routing",
        label: "Route to the cheaper model",
        isOn: (s) => s.routing.share > 0,
        apply: (target, from) => {
            target.routing = { ...from.routing };
        },
    },
    {
        id: "responseCache",
        label: "Response cache",
        isOn: (s) => s.responseCacheHitRate > 0,
        apply: (target, from) => {
            target.responseCacheHitRate = from.responseCacheHitRate;
        },
    },
    {
        id: "promptCaching",
        label: "Prompt caching",
        isOn: (s) => s.promptCaching,
        apply: (target) => {
            target.promptCaching = true;
        },
    },
    {
        id: "filter",
        label: "Decision model: filter chunks",
        isOn: (s) => s.decisions.filter.enabled,
        apply: (target, from) => {
            target.decisions.filter = { ...from.decisions.filter };
        },
    },
    {
        id: "gate",
        label: "Decision model: skip unanswerable questions",
        isOn: (s) => s.decisions.gate.enabled,
        apply: (target, from) => {
            target.decisions.gate = { ...from.decisions.gate };
        },
    },
    {
        id: "route",
        label: "Decision model: routing calls",
        isOn: (s) => s.decisions.route && s.routing.share > 0,
        apply: (target) => {
            target.decisions.route = true;
        },
    },
    {
        id: "cacheMatch",
        label: "Decision model: confirm cache hits",
        isOn: (s) => s.decisions.cacheMatch,
        apply: (target) => {
            target.decisions.cacheMatch = true;
        },
    },
];

/** The scenario with every lever off: same workload and models, no savings. */
export const withoutLevers = (scenario: RagScenario): RagScenario => {
    const base = normalizeScenario(scenario);

    base.routing.share = 0;
    base.responseCacheHitRate = 0;
    base.promptCaching = false;
    base.decisions.route = false;
    base.decisions.filter.enabled = false;
    base.decisions.gate.enabled = false;
    base.decisions.cacheMatch = false;

    return base;
};

/**
 * Applies each lever that's on, one at a time from no levers at all. The first
 * step is always the baseline, and the last step's cost is the scenario's own
 * monthly cost.
 */
export const leverSteps = (
    scenario: RagScenario,
    rates: ScenarioRates,
): [LeverStep, ...LeverStep[]] => {
    const target = normalizeScenario(scenario);
    const current = withoutLevers(target);
    let previous = estimateScenario(current, rates).perMonth;
    const steps: [LeverStep, ...LeverStep[]] = [
        { id: "baseline", label: "Without any levers", perMonth: previous, change: 0 },
    ];

    for (const lever of LEVERS) {
        if (!lever.isOn(target)) continue;

        lever.apply(current, target);
        const perMonth = estimateScenario(current, rates).perMonth;
        steps.push({ id: lever.id, label: lever.label, perMonth, change: perMonth - previous });
        previous = perMonth;
    }

    return steps;
};
