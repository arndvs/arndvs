import { calculateCost } from "./calculate-cost";
import { costComposition } from "./composition";
import { estimateScenario } from "./estimate";
import type { ScenarioRates } from "./estimate";
import { explainEstimate } from "./explain";
import { settingImpacts } from "./impact";
import { estimateCapacity, estimateLatency } from "./latency";
import type { CapacityEstimate, LatencyEstimate } from "./latency";
import { withoutLevers } from "./levers";
import { decisionModel, generationModels, nonEmpty } from "./model-pricing";
import type { ModelCatalog, ModelPricing } from "./model-pricing";
import { DAYS_PER_MONTH, generationUsage, normalizeScenario, promptTokens } from "./rag-scenario";
import type { RagScenario } from "./rag-scenario";
import type { PageState } from "./url-state";

const NO_DECISION_RATES: ScenarioRates["decision"] = { input: 0, cachedInput: 0, output: 0 };

export type ModelComparisonRow = {
    model: ModelPricing;
    monthlyCost: number;
    selected: boolean;
    overPromptLimit: boolean;
};

export type EstimatorView = {
    scenario: RagScenario;
    mainModel: ModelPricing;
    routedModel: ModelPricing;
    decisionModel: ModelPricing | null;
    estimate: ReturnType<typeof estimateScenario>;
    monthlyTotal: number;
    baselineMonthly: number;
    perQuery: number;
    composition: ReturnType<typeof costComposition>;
    impacts: ReturnType<typeof settingImpacts>;
    latency: LatencyEstimate;
    capacity: CapacityEstimate;
    formulas: ReturnType<typeof explainEstimate>;
    modelComparison: ModelComparisonRow[];
    promptTokens: number;
};

/**
 * Resolves a shareable page state and catalog into all data the estimator UI
 * needs. Arithmetic and fallback rules live here rather than in components.
 */
export const buildEstimatorView = (state: PageState, catalog: ModelCatalog): EstimatorView => {
    const models = nonEmpty(generationModels(catalog), "generation model");
    const findModel = (id: string): ModelPricing =>
        models.find((model) => model.id === id) ?? models[0];
    const mainModel = findModel(state.mainModelId);
    const routedModel = findModel(state.routedModelId);
    const selectedDecisionModel = decisionModel(catalog);
    const scenario = normalizeScenario(state.scenario);

    if (!selectedDecisionModel) {
        scenario.decisions.route = false;
        scenario.decisions.filter.enabled = false;
        scenario.decisions.gate.enabled = false;
        scenario.decisions.cacheMatch = false;
    }

    const rates: ScenarioRates = {
        main: mainModel,
        routed: routedModel,
        decision: selectedDecisionModel ?? NO_DECISION_RATES,
    };
    const estimate = estimateScenario(scenario, rates);
    const baselineMonthly = estimateScenario(withoutLevers(scenario), rates).perMonth;
    const usage = generationUsage(scenario, estimate.volumes.answered);
    const monthUsage = {
        uncachedInput: usage.uncachedInput * DAYS_PER_MONTH,
        cacheRead: usage.cacheRead * DAYS_PER_MONTH,
        cacheWrite5m: usage.cacheWrite5m * DAYS_PER_MONTH,
        cacheWrite1h: usage.cacheWrite1h * DAYS_PER_MONTH,
        output: usage.output * DAYS_PER_MONTH,
    };
    const selectedIds = new Set(
        scenario.routing.share > 0 ? [mainModel.id, routedModel.id] : [mainModel.id],
    );
    const promptTokenCount = promptTokens(scenario);
    const modelComparison = models
        .map((model, index) => ({
            model,
            index,
            monthlyCost: calculateCost(monthUsage, model),
            selected: selectedIds.has(model.id),
            overPromptLimit:
                model.maximumPromptTokens !== undefined &&
                promptTokenCount > model.maximumPromptTokens,
        }))
        .sort(
            (first, second) => first.monthlyCost - second.monthlyCost || first.index - second.index,
        )
        .map(({ index: _index, ...row }) => row);

    return {
        scenario,
        mainModel,
        routedModel,
        decisionModel: selectedDecisionModel,
        estimate,
        monthlyTotal: estimate.perMonth,
        baselineMonthly,
        perQuery: estimate.perQuery,
        composition: costComposition(estimate, rates),
        impacts: settingImpacts(scenario, rates),
        latency: estimateLatency(scenario),
        capacity: estimateCapacity(scenario),
        formulas: explainEstimate(estimate, rates),
        modelComparison,
        promptTokens: promptTokenCount,
    };
};
