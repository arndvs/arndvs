import { estimateScenario } from "./estimate";
import type { ScenarioRates } from "./estimate";
import { INPUTS } from "./inputs";
import type { CountInput, RangeInput } from "./inputs";
import { leverSteps } from "./levers";
import type { LeverId } from "./levers";
import { DAYS_PER_MONTH, normalizeScenario } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";

export type PolicyId = "filter" | "gate" | "route" | "cacheMatch";

export type LeverImpact = {
    /** The cost change at this step of the fixed lever waterfall. */
    change: number;
    /** Monthly cost after this step. */
    after: number;
};

export type PolicyImpact = {
    /** Monthly cost of the decision-model call attributable to this policy. */
    adds: number;
    /** Monthly generation cost avoided; may be negative when the policy costs more than it saves. */
    avoided: number;
    /** Net monthly change: `adds - avoided`. */
    net: number;
};

export type WorkloadImpact = {
    id: string;
    label: string;
    /** Monthly cost change when this input is increased by approximately 10%. */
    change: number;
    increasePercent: 10;
};

export type SettingImpacts = {
    levers: Partial<Record<LeverId, LeverImpact>>;
    policies: Record<PolicyId, PolicyImpact | null>;
    workload: WorkloadImpact[];
};

const POLICY_IDS: readonly PolicyId[] = ["filter", "gate", "route", "cacheMatch"];

const isPolicyEnabled = (scenario: RagScenario, policy: PolicyId): boolean => {
    switch (policy) {
        case "filter":
            return scenario.decisions.filter.enabled;
        case "gate":
            return scenario.decisions.gate.enabled;
        case "route":
            return scenario.decisions.route && scenario.routing.share > 0;
        case "cacheMatch":
            return scenario.decisions.cacheMatch;
    }
};

/**
 * Prepares per-setting cost changes for the worksheet. Lever changes use the
 * existing fixed waterfall order; policy details separate decision-model cost
 * from generation cost avoided; workload rows show a simple +10% sensitivity.
 */
export const settingImpacts = (scenario: RagScenario, rates: ScenarioRates): SettingImpacts => {
    const normalized = normalizeScenario(scenario);
    const steps = leverSteps(normalized, rates);
    const levers: Partial<Record<LeverId, LeverImpact>> = {};
    const policyNets = new Map<PolicyId, number>();

    steps.slice(1).forEach((step) => {
        if (step.id === "baseline") return;

        if (
            step.id === "filter" ||
            step.id === "gate" ||
            step.id === "route" ||
            step.id === "cacheMatch"
        ) {
            policyNets.set(step.id, step.change);
        } else {
            levers[step.id] = { change: step.change, after: step.perMonth };
        }
    });

    const estimate = estimateScenario(normalized, rates);
    const policies = Object.fromEntries(
        POLICY_IDS.map((policy): [PolicyId, PolicyImpact | null] => {
            if (!isPolicyEnabled(normalized, policy)) return [policy, null];

            const adds =
                (estimate.decisions.find((entry) => entry.decision === policy)?.perDay ?? 0) *
                DAYS_PER_MONTH;
            const net = policyNets.get(policy) ?? 0;

            return [policy, { adds, avoided: adds - net, net }];
        }),
    ) as Record<PolicyId, PolicyImpact | null>;

    const workload = INPUTS.filter(
        (input): input is CountInput | RangeInput =>
            input.group === "workload" && (input.kind === "count" || input.kind === "range"),
    ).map((input): WorkloadImpact => {
        const before = input.get(normalized);
        const after = before > 0 ? Math.max(before + 1, Math.round(before * 1.1)) : 1;
        const adjusted = structuredClone(normalized);
        input.set(adjusted, after);

        return {
            id: input.param,
            label: input.label,
            change: estimateScenario(adjusted, rates).perMonth - estimate.perMonth,
            increasePercent: 10,
        };
    });

    return { levers, policies, workload };
};
