"use client";

import { RotateCcw } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { leverSteps } from "@/lib/rag-cost/levers";
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
import { Panel } from "./panel";
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

/**
 * The RAG Cost Estimator. All math lives in `src/lib/rag-cost`; this component
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
            <div className="grid gap-6 lg:grid-cols-3">
                <Panel step="01" title="Workload" tag="Change the assumptions">
                    <div className="grid gap-4 sm:grid-cols-2">{fields("workload")}</div>
                    <div className="border-border space-y-4 border-t pt-4">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            Caching
                        </p>
                        {fields("levers")}
                    </div>
                </Panel>

                <Panel step="02" title="Models and routing" tag="USD / 1M tokens">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
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
                                <span className="text-muted-foreground text-xs">simple ones</span>
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
                    </div>
                    {fields("routing")}
                    <p className="bg-primary/10 text-foreground rounded-lg px-3 py-2.5 text-sm">
                        {routingSentence}
                        {routing && priced.decisions.route
                            ? ` ${decisionName} decides which is which.`
                            : ""}
                    </p>
                </Panel>

                <Panel step="03" title={`Hand decisions to ${decisionName}`} tag="Optional">
                    <div className="flex items-start gap-3">
                        <input
                            id="jev-enabled"
                            type="checkbox"
                            checked={decisionModel !== null && jevOpen}
                            onChange={(event) => toggleJev(event.target.checked)}
                            disabled={!decisionModel}
                            aria-describedby="jev-enabled-description"
                            className="accent-primary mt-0.5 size-4 flex-none cursor-pointer disabled:cursor-not-allowed"
                        />
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
                    </div>
                    {decisionModel && jevOpen ? (
                        <div className="border-border space-y-4 border-t pt-4">
                            {fields("decisions")}
                        </div>
                    ) : null}
                </Panel>
            </div>

            <section
                aria-labelledby="results-heading"
                className="bg-card border-border overflow-hidden rounded-xl border"
            >
                <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
                    <div>
                        <h2 id="results-heading" className="text-base font-semibold tracking-tight">
                            Monthly cost
                        </h2>
                        <p className="text-muted-foreground text-xs">
                            {formatTokenCount(priced.queriesPerDay * DAYS_PER_MONTH)} questions ·{" "}
                            {DAYS_PER_MONTH}-day month
                        </p>
                    </div>
                    <span className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-wide uppercase">
                        <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
                        Updates as you type
                    </span>
                </div>

                <SummaryStrip
                    perMonth={estimate.perMonth}
                    perDay={estimate.perDay}
                    withoutLevers={steps[0].perMonth}
                    perThousandQueries={estimate.perQuery * 1_000}
                />

                <div className="divide-border border-border grid divide-y border-b lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                    <div className="p-5 sm:p-6">
                        <CostBreakdown
                            estimate={estimate}
                            formulas={formulas}
                            mainName={modelLabel(mainModel)}
                            routedName={modelLabel(routedModel)}
                            decisionName={decisionName}
                        />
                    </div>
                    <div className="p-5 sm:p-6">
                        <LeverSteps
                            steps={steps}
                            decisionName={decisionModel?.name}
                            answeredPerDay={estimate.volumes.answered}
                            misroutedPerDay={routing ? estimate.volumes.misrouted : null}
                        />
                    </div>
                </div>

                <div className="border-border border-b p-5 sm:p-6">
                    <LatencyCapacity
                        latency={latency}
                        capacity={capacity}
                        names={{
                            main: modelLabel(mainModel),
                            routed: modelLabel(routedModel),
                            decision: decisionName,
                        }}
                    />
                </div>

                <div className="p-5 sm:p-6">
                    <ModelComparison
                        models={models}
                        usage={monthOnOneModel}
                        selectedIds={selectedIds}
                        promptTokens={promptTokens(priced)}
                        updated={updated}
                    />
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-4">
                    <p className="bg-muted text-muted-foreground rounded-lg p-4 text-sm leading-relaxed">
                        <span className="text-foreground font-medium">Important: </span>
                        this is a directional estimate of what generation costs for a RAG workload,
                        not a quote. Embeddings, the vector database, retries, tool calls, and
                        network costs aren’t included. Check each provider’s current pricing before
                        you budget.
                    </p>

                    <details className="group border-border rounded-lg border p-4">
                        <summary className="cursor-pointer text-sm font-medium">
                            How the estimate is calculated
                        </summary>
                        <div className="text-muted-foreground mt-3 space-y-3 text-sm leading-relaxed">
                            <p>
                                Each day starts with the questions you entered. The response cache
                                answers its share without calling any model. If {decisionName}{" "}
                                checks the chunks, it turns away the questions they can’t answer.
                                The rest split between the main and routed models by the routing
                                share.
                            </p>
                            <p>
                                Every call sends the system prompt, the question, and the chunks,
                                and gets an answer back. Each kind of token is multiplied by the
                                model’s price per million, and every line is added up before
                                dividing by a million, so rounding never drifts. A day’s total times{" "}
                                {DAYS_PER_MONTH} gives the month.
                            </p>
                            <p>
                                “What moves the bill” starts from the same workload with every lever
                                off, then applies the levers one at a time in a fixed order. Each
                                lever’s saving depends on the ones before it.
                            </p>
                        </div>
                    </details>

                    <details className="group border-border rounded-lg border p-4">
                        <summary className="cursor-pointer text-sm font-medium">
                            Fixed assumptions
                        </summary>
                        <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                            <li>Months are {DAYS_PER_MONTH} days, so scenarios compare evenly.</li>
                            <li>
                                A cached system prompt is written at most {MAX_CACHE_WRITES_PER_DAY}{" "}
                                times a day per model, once per five-minute window. Providers only
                                cache prompts above a minimum length, often around 1,024 tokens,
                                which this page doesn’t check yet.
                            </li>
                            <li>
                                Each {decisionName} call adds {DECISION_INSTRUCTION_TOKENS} tokens
                                for its question definitions and takes {DECISION_MS} ms. Routing
                                runs alongside retrieval; the chunk checks wait for it.
                            </li>
                            {decisionModel?.source ? (
                                <li>
                                    {decisionModel.name}’s price comes from {decisionModel.source}
                                </li>
                            ) : null}
                            <li>
                                Embedding takes {EMBEDDING_MS} ms, search {RETRIEVAL_MS} ms, and the
                                first token {FIRST_TOKEN_MS} ms. Answers stream at{" "}
                                {OUTPUT_TOKENS_PER_SECOND} tokens a second.
                            </li>
                            <li>
                                The busiest minute is {PEAK_FACTOR}× the day’s average. Each model
                                is held to {formatTokenCount(TOKENS_PER_MINUTE_LIMIT)} tokens a
                                minute, a planning figure; your real limits depend on your account.
                            </li>
                            <li>
                                Misrouted questions are counted but not priced: a hard question sent
                                to a cheap model costs quality, not money.
                            </li>
                            <li>
                                The token-pricing approach follows Steve Kinney’s{" "}
                                <a
                                    href="https://stevekinney.com/experiments/model-calculator"
                                    className="text-foreground underline underline-offset-4"
                                >
                                    Model Pricing Calculator
                                </a>
                                .
                            </li>
                        </ul>
                    </details>
                </div>

                <div className="space-y-3 lg:pt-1">
                    <p className="text-muted-foreground text-sm">
                        Every input is an assumption you can change. The address bar always holds a
                        link to exactly what’s on screen.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm" onClick={reset}>
                            <RotateCcw aria-hidden="true" />
                            Reset every input
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="#panel-01">Back to the inputs ↑</a>
                        </Button>
                    </div>
                </div>
            </div>

            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </div>
    );
}
