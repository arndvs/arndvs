"use client";

import { RotateCcw } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { Panel } from "@/components/experiments/panel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { estimateScenario } from "@/lib/rag-cost/estimate";
import { explainEstimate } from "@/lib/rag-cost/explain";
import { formatCost, formatPrice, formatTokenCount } from "@/lib/rag-cost/format";
import { inputsIn } from "@/lib/rag-cost/inputs";
import type { InputGroup } from "@/lib/rag-cost/inputs";
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
} from "@/lib/rag-cost/latency";
import { leverSteps, withoutLevers } from "@/lib/rag-cost/levers";
import { modelLabel } from "@/lib/rag-cost/model-pricing";
import type { ModelPricing, NonEmpty, PricingRates } from "@/lib/rag-cost/model-pricing";
import {
    DAYS_PER_MONTH,
    DECISION_INSTRUCTION_TOKENS,
    MAX_CACHE_WRITES_PER_DAY,
    defaultRagScenario,
    generationUsage,
    normalizeScenario,
    promptTokens,
} from "@/lib/rag-cost/rag-scenario";
import type { RagScenario } from "@/lib/rag-cost/rag-scenario";
import { decodeState, encodeState } from "@/lib/rag-cost/url-state";
import type { PageState } from "@/lib/rag-cost/url-state";

import { CostBreakdown } from "./cost-breakdown";
import { LatencyCapacity } from "./latency-capacity";
import { LeverSteps } from "./lever-steps";
import { ModelComparison } from "./model-comparison";
import { ScenarioField } from "./scenario-field";
import { SummaryStrip } from "./summary-strip";

type Props = {
    /** Models that write answers. There's always at least one. */
    models: NonEmpty<ModelPricing>;
    /** The model the decision options price, or `null` to disable them. */
    decisionModel: ModelPricing | null;
    /** When the prices were last checked, as YYYY-MM-DD. */
    updated: string;
    defaultMainModelId: string;
    defaultRoutedModelId: string;
};

const NO_DECISION_RATES: PricingRates = { input: 0, cachedInput: 0, output: 0 };

const selectClass =
    "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full cursor-pointer rounded-md border bg-transparent px-3 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm";

const anyDecision = (scenario: RagScenario): boolean =>
    scenario.decisions.route ||
    scenario.decisions.filter.enabled ||
    scenario.decisions.gate.enabled ||
    scenario.decisions.cacheMatch;

const resultTabs = [
    { id: "models", label: "Models" },
    { id: "spend", label: "Where money goes" },
    { id: "savings", label: "Savings order" },
    { id: "math", label: "The math" },
    { id: "speed", label: "Speed & limits" },
] as const;

type ResultTab = (typeof resultTabs)[number]["id"];

/**
 * The RAG Cost Calculator. All math lives in `src/lib/rag-cost`; this component
 * owns the state, keeps the URL in step with it, and lays the page out.
 */
export function RagCostEstimator({
    models,
    decisionModel,
    updated,
    defaultMainModelId,
    defaultRoutedModelId,
}: Props) {
    const defaults = useCallback(
        (): PageState => ({
            scenario: defaultRagScenario(),
            mainModelId: defaultMainModelId,
            routedModelId: defaultRoutedModelId,
        }),
        [defaultMainModelId, defaultRoutedModelId],
    );

    const [scenario, setScenario] = useState<RagScenario>(defaultRagScenario);
    const [mainModelId, setMainModelId] = useState(defaultMainModelId);
    const [routedModelId, setRoutedModelId] = useState(defaultRoutedModelId);
    // Whether Jev's options are showing. It opens on its own when a shared link uses them.
    const [jevOpen, setJevOpen] = useState(false);
    const [activeResultTab, setActiveResultTab] = useState<ResultTab>("models");
    // A shared link is read after hydration, and the URL isn't written until it has been.
    const [restored, setRestored] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const announcedTotal = useRef<number | null>(null);

    const change = useCallback((apply: (draft: RagScenario) => void) => {
        setScenario((previous) => {
            const next = structuredClone(previous);
            apply(next);

            return next;
        });
    }, []);

    const modelsById = useMemo(() => new Map(models.map((model) => [model.id, model])), [models]);
    const mainModel = modelsById.get(mainModelId) ?? models[0];
    const routedModel = modelsById.get(routedModelId) ?? models[0];

    const rates = useMemo(
        () => ({
            main: mainModel,
            routed: routedModel,
            decision: decisionModel ?? NO_DECISION_RATES,
        }),
        [mainModel, routedModel, decisionModel],
    );

    // Without a decision model, its options are disabled and a shared link can't
    // switch them on, so nothing is priced at $0 by accident.
    const priced = useMemo(() => {
        const copy = normalizeScenario(scenario);
        if (decisionModel) return copy;

        copy.decisions.route = false;
        copy.decisions.filter.enabled = false;
        copy.decisions.gate.enabled = false;
        copy.decisions.cacheMatch = false;

        return copy;
    }, [scenario, decisionModel]);

    const estimate = useMemo(() => estimateScenario(priced, rates), [priced, rates]);
    const formulas = useMemo(() => explainEstimate(estimate, rates), [estimate, rates]);
    const steps = useMemo(() => leverSteps(priced, rates), [priced, rates]);
    const latency = useMemo(() => estimateLatency(priced), [priced]);
    const capacity = useMemo(() => estimateCapacity(priced), [priced]);
    const routing = priced.routing.share > 0;

    const monthOnOneModel = useMemo(() => {
        const usage = generationUsage(priced, estimate.volumes.answered);

        return {
            uncachedInput: usage.uncachedInput * DAYS_PER_MONTH,
            cacheRead: usage.cacheRead * DAYS_PER_MONTH,
            cacheWrite5m: usage.cacheWrite5m * DAYS_PER_MONTH,
            cacheWrite1h: usage.cacheWrite1h * DAYS_PER_MONTH,
            output: usage.output * DAYS_PER_MONTH,
        };
    }, [priced, estimate]);

    const baselineMonthOnOneModel = useMemo(() => {
        const baseline = withoutLevers(priced);
        const baselineEstimate = estimateScenario(baseline, rates);
        const usage = generationUsage(baseline, baselineEstimate.volumes.answered);

        return {
            uncachedInput: usage.uncachedInput * DAYS_PER_MONTH,
            cacheRead: usage.cacheRead * DAYS_PER_MONTH,
            cacheWrite5m: usage.cacheWrite5m * DAYS_PER_MONTH,
            cacheWrite1h: usage.cacheWrite1h * DAYS_PER_MONTH,
            output: usage.output * DAYS_PER_MONTH,
        };
    }, [priced, rates]);

    const handleResultTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % resultTabs.length;
        else if (event.key === "ArrowLeft")
            nextIndex = (index - 1 + resultTabs.length) % resultTabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = resultTabs.length - 1;
        else return;

        event.preventDefault();
        const nextTab = resultTabs[nextIndex];
        if (!nextTab) return;

        setActiveResultTab(nextTab.id);
        document.getElementById(`result-tab-${nextTab.id}`)?.focus();
    };

    const selectedIds = useMemo(
        () => new Set(routing ? [mainModel.id, routedModel.id] : [mainModel.id]),
        [routing, mainModel, routedModel],
    );

    // Restores a shared link once, after hydration. The page is prerendered with
    // the defaults, so reading the URL any earlier would make the first client
    // render differ from the HTML and break hydration. That makes this one of the
    // cases where setting state in an effect is the right tool.
    useEffect(() => {
        const ids = new Set(models.map((model) => model.id));
        const state = decodeState(new URLSearchParams(window.location.search), defaults(), ids);

        /* eslint-disable react-hooks/set-state-in-effect */
        setScenario(state.scenario);
        setMainModelId(state.mainModelId);
        setRoutedModelId(state.routedModelId);
        setJevOpen(anyDecision(state.scenario));
        setRestored(true);
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [models, defaults]);

    // Keeps the address bar a shareable link to exactly what's on screen.
    useEffect(() => {
        if (!restored) return;

        const query = encodeState({ scenario, mainModelId, routedModelId }, defaults()).toString();
        const timer = window.setTimeout(() => {
            const { pathname, search } = window.location;
            const next = query ? `${pathname}?${query}` : pathname;
            if (next !== `${pathname}${search}`) window.history.replaceState(null, "", next);
        }, 250);

        return () => window.clearTimeout(timer);
    }, [restored, scenario, mainModelId, routedModelId, defaults]);

    // Tells screen readers the new total once the person stops changing inputs.
    useEffect(() => {
        if (!restored) return;

        const total = estimate.perMonth;
        if (announcedTotal.current === null) {
            announcedTotal.current = total;

            return;
        }

        const timer = window.setTimeout(() => {
            const previous = announcedTotal.current;
            if (previous !== null && previous !== total) {
                const difference = total - previous;
                setAnnouncement(
                    `Monthly cost ${difference < 0 ? "fell" : "rose"} ${formatCost(Math.abs(difference))} to ${formatCost(total)}.`,
                );
            }
            announcedTotal.current = total;
        }, 800);

        return () => window.clearTimeout(timer);
    }, [restored, estimate.perMonth]);

    const toggleJev = (open: boolean): void => {
        setJevOpen(open);
        change((draft) => {
            if (!open) {
                draft.decisions.route = false;
                draft.decisions.filter.enabled = false;
                draft.decisions.gate.enabled = false;
                draft.decisions.cacheMatch = false;
            } else if (!anyDecision(draft)) {
                // The two options that save money are a sensible place to start.
                draft.decisions.filter.enabled = true;
                draft.decisions.gate.enabled = true;
            }
        });
    };

    const reset = (): void => {
        const state = defaults();
        setScenario(state.scenario);
        setMainModelId(state.mainModelId);
        setRoutedModelId(state.routedModelId);
        setJevOpen(false);
    };

    // Disabled controls show the scenario as priced, so a decision switch that a
    // shared link turned on, with no decision model to price it, shows as off.
    const fields = (group: InputGroup, disabled = false) =>
        inputsIn(group)
            .filter((input) => !input.shownWhen || input.shownWhen(disabled ? priced : scenario))
            .map((input) => (
                <ScenarioField
                    key={input.param}
                    input={input}
                    scenario={disabled ? priced : scenario}
                    onChange={change}
                    disabled={disabled}
                />
            ));

    const share = Math.round(priced.routing.share * 100);
    const routingSentence = routing
        ? `${share}% of questions go to ${modelLabel(routedModel)}. The rest stay on ${modelLabel(mainModel)}.`
        : `Every question goes to ${modelLabel(mainModel)}. Move the slider to send simple ones to ${modelLabel(routedModel)}.`;
    const decisionName = decisionModel?.name ?? "Decision model";

    return (
        <div className="space-y-6">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(18rem,0.82fr)_minmax(0,1.18fr)] lg:gap-8">
                <aside aria-label="Scenario inputs" className="order-2 space-y-4 lg:order-1">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-signal font-mono text-xs tracking-widest uppercase">
                                Your app
                            </p>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Set the workload and savings assumptions.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={reset}>
                            <RotateCcw aria-hidden="true" />
                            Reset
                        </Button>
                    </div>

                    <Panel
                        step="01"
                        title="Workload"
                        tag="Change the assumptions"
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">{fields("workload")}</div>
                        <div className="border-border space-y-4 border-t pt-5">
                            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                Caching
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                {fields("levers")}
                            </div>
                        </div>
                    </Panel>

                    <Panel
                        step="02"
                        title="Models and routing"
                        tag="USD / 1M tokens"
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            <div className="space-y-1.5">
                                <div className="flex items-baseline justify-between gap-2">
                                    <Label htmlFor="main-model">Main model</Label>
                                    <span className="text-muted-foreground text-xs">
                                        hard questions
                                    </span>
                                </div>
                                <select
                                    id="main-model"
                                    value={mainModel.id}
                                    onChange={(event) => setMainModelId(event.target.value)}
                                    className={selectClass}
                                >
                                    {models.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {modelLabel(model)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-baseline justify-between gap-2">
                                    <Label htmlFor="routed-model">Routed model</Label>
                                    <span className="text-muted-foreground text-xs">
                                        simple ones
                                    </span>
                                </div>
                                <select
                                    id="routed-model"
                                    value={routedModel.id}
                                    onChange={(event) => setRoutedModelId(event.target.value)}
                                    className={selectClass}
                                >
                                    {models.map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {modelLabel(model)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {fields("routing")}
                        </div>
                        <p className="border-border text-muted-foreground border-l-2 py-1 pl-4 text-sm leading-relaxed">
                            {routingSentence}
                            {routing && priced.decisions.route
                                ? ` ${decisionName} decides which is which.`
                                : ""}
                        </p>
                    </Panel>

                    <Panel
                        step="03"
                        title={`Hand decisions to ${decisionName}`}
                        tag="Optional"
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div className="space-y-1">
                                <Label htmlFor="jev-enabled" className="cursor-pointer">
                                    Add {decisionName}
                                </Label>
                                <p
                                    id="jev-enabled-description"
                                    className="text-muted-foreground text-xs leading-relaxed"
                                >
                                    {decisionModel
                                        ? `${decisionModel.name} doesn’t write text. It picks from options you define and bills input only, at ${formatPrice(decisionModel.input)} per million tokens.`
                                        : 'Add a model with kind: "decision" to the price table to price these.'}
                                </p>
                            </div>
                            <Switch
                                id="jev-enabled"
                                checked={decisionModel !== null && jevOpen}
                                onCheckedChange={toggleJev}
                                disabled={!decisionModel}
                                aria-describedby="jev-enabled-description"
                                className="mt-0.5"
                            />
                        </div>
                        {decisionModel && jevOpen ? (
                            <div className="border-border grid gap-x-8 gap-y-6 border-t pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                {fields("decisions")}
                            </div>
                        ) : null}
                    </Panel>
                </aside>

                <section
                    aria-labelledby="results-heading"
                    className="order-1 min-w-0 space-y-4 lg:order-2"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2
                                id="results-heading"
                                className="text-base font-semibold tracking-tight"
                            >
                                Live estimate
                            </h2>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {formatTokenCount(priced.queriesPerDay * DAYS_PER_MONTH)} questions
                                · {DAYS_PER_MONTH}-day month
                            </p>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-2 pt-1 font-mono text-xs tracking-wide uppercase">
                            <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
                            Updates as you edit
                        </span>
                    </div>

                    <SummaryStrip
                        perMonth={estimate.perMonth}
                        perDay={estimate.perDay}
                        withoutLevers={steps[0].perMonth}
                        perThousandQueries={estimate.perQuery * 1_000}
                    />

                    <div
                        role="tablist"
                        aria-label="Estimate details"
                        className="border-border flex gap-1 overflow-x-auto border-b"
                    >
                        {resultTabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                id={`result-tab-${tab.id}`}
                                type="button"
                                role="tab"
                                aria-selected={activeResultTab === tab.id}
                                aria-controls="result-panel"
                                tabIndex={activeResultTab === tab.id ? 0 : -1}
                                onClick={() => setActiveResultTab(tab.id)}
                                onKeyDown={(event) => handleResultTabKeyDown(event, index)}
                                className={`focus-visible:ring-ring border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                                    activeResultTab === tab.id
                                        ? "border-primary text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground border-transparent"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <section
                        id="result-panel"
                        role="tabpanel"
                        aria-labelledby={`result-tab-${activeResultTab}`}
                        tabIndex={0}
                        className="border-border focus-visible:ring-ring min-h-72 border-t py-5 outline-none focus-visible:ring-2 sm:py-6"
                    >
                        {activeResultTab === "models" ? (
                            <ModelComparison
                                models={models}
                                baselineUsage={baselineMonthOnOneModel}
                                usage={monthOnOneModel}
                                selectedIds={selectedIds}
                                promptTokens={promptTokens(priced)}
                                updated={updated}
                            />
                        ) : null}
                        {activeResultTab === "spend" ? (
                            <CostBreakdown
                                estimate={estimate}
                                formulas={formulas}
                                mainName={modelLabel(mainModel)}
                                routedName={modelLabel(routedModel)}
                                decisionName={decisionName}
                            />
                        ) : null}
                        {activeResultTab === "savings" ? (
                            <LeverSteps
                                steps={steps}
                                decisionName={decisionModel?.name}
                                answeredPerDay={estimate.volumes.answered}
                                misroutedPerDay={routing ? estimate.volumes.misrouted : null}
                            />
                        ) : null}
                        {activeResultTab === "math" ? (
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                        How the estimate is calculated
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Each day starts with the questions you entered. The response
                                        cache answers its share without calling a model. If{" "}
                                        {decisionName} checks the chunks, it turns away questions it
                                        can’t answer. The rest split between the main and routed
                                        models by the routing share.
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Every call sends the system prompt, question, and retrieved
                                        chunks, then gets an answer. Token volumes are multiplied by
                                        each model’s price per million. The daily total is
                                        multiplied by {DAYS_PER_MONTH} for the monthly estimate.
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Savings are applied one at a time from the no-savings
                                        baseline, so each step reflects the strategies already
                                        applied above it.
                                    </p>
                                </div>
                                <details className="border-border rounded-lg border p-4">
                                    <summary className="cursor-pointer text-sm font-medium">
                                        Fixed assumptions
                                    </summary>
                                    <ul className="text-muted-foreground mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                                        <li>Months contain {DAYS_PER_MONTH} days.</li>
                                        <li>
                                            System prompt cache writes are limited to{" "}
                                            {MAX_CACHE_WRITES_PER_DAY} a day per model.
                                        </li>
                                        <li>
                                            {decisionName} calls add {DECISION_INSTRUCTION_TOKENS}{" "}
                                            tokens and take {DECISION_MS} ms.
                                        </li>
                                        <li>
                                            Retrieval takes {EMBEDDING_MS + RETRIEVAL_MS} ms;
                                            first-token time is {FIRST_TOKEN_MS} ms; streaming speed
                                            is {OUTPUT_TOKENS_PER_SECOND} tokens per second.
                                        </li>
                                        <li>
                                            Peak traffic is {PEAK_FACTOR}× average. Planning limit
                                            is {formatTokenCount(TOKENS_PER_MINUTE_LIMIT)} tokens
                                            per minute per model.
                                        </li>
                                        <li>
                                            Embeddings, vector database, retries, tools, and network
                                            costs are not included.
                                        </li>
                                    </ul>
                                </details>
                                {decisionModel?.source ? (
                                    <p className="text-muted-foreground text-xs">
                                        {decisionModel.name} pricing source: {decisionModel.source}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                        {activeResultTab === "speed" ? (
                            <LatencyCapacity
                                latency={latency}
                                capacity={capacity}
                                names={{
                                    main: modelLabel(mainModel),
                                    routed: modelLabel(routedModel),
                                    decision: decisionName,
                                }}
                            />
                        ) : null}
                    </section>

                    <p className="text-muted-foreground border-border border-l-2 py-1 pl-4 text-sm leading-relaxed">
                        <span className="text-foreground font-medium">Directional estimate: </span>
                        generation costs only, not a quote. Check each provider’s current pricing
                        before budgeting.
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                        Every input is an assumption you can change. The address bar keeps a
                        shareable link to this scenario.
                    </p>
                </section>
            </div>

            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </div>
    );
}
