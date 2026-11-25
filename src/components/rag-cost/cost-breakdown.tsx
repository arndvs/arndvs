import type { ScenarioEstimate } from "@/lib/rag-cost/estimate";
import type { EstimateFormulas, LineFormula } from "@/lib/rag-cost/explain";
import { formatCost, formatPrice, formatTokenCount } from "@/lib/rag-cost/format";
import { DAYS_PER_MONTH } from "@/lib/rag-cost/rag-scenario";
import type { Decision } from "@/lib/rag-cost/rag-scenario";
import type { TokenUsage } from "@/lib/rag-cost/token-usage";

type Props = {
    estimate: ScenarioEstimate;
    formulas: EstimateFormulas;
    mainName: string;
    routedName: string;
    decisionName: string;
};

const FIELD_LABELS: Record<keyof TokenUsage, string> = {
    uncachedInput: "input",
    cacheRead: "cached input",
    cacheWrite5m: "cache writes",
    cacheWrite1h: "1-hour cache writes",
    output: "output",
};

const DECISION_LABELS: Record<Decision, string> = {
    route: "routing",
    filter: "chunk filter",
    gate: "answerability check",
    cacheMatch: "cache-hit check",
};

type Line = { id: string; title: string; detail: string; perDay: number; formula: LineFormula };

const calls = (count: number): string => {
    const rounded = Math.round(count);

    return `${formatTokenCount(rounded)} ${rounded === 1 ? "call" : "calls"} a day`;
};

/** Every cost line as a bar, with its math written underneath. */
export function CostBreakdown({ estimate, formulas, mainName, routedName, decisionName }: Props) {
    const lines: Line[] = [
        {
            id: "main",
            title: mainName,
            detail: calls(estimate.main.calls),
            perDay: estimate.main.perDay,
            formula: formulas.main,
        },
        ...(estimate.routed.calls > 0
            ? [
                  {
                      id: "routed",
                      title: routedName,
                      detail: calls(estimate.routed.calls),
                      perDay: estimate.routed.perDay,
                      formula: formulas.routed,
                  },
              ]
            : []),
        ...formulas.decisions.map((entry) => ({
            id: entry.decision,
            title: `${decisionName}: ${DECISION_LABELS[entry.decision]}`,
            detail: entry.sharedWith
                ? `Shares the ${DECISION_LABELS[entry.sharedWith]}’s call, so it’s free`
                : `${calls(entry.calls)} × ${formatTokenCount(entry.tokensPerCall)} tokens`,
            perDay: entry.perDay,
            formula: entry.formula,
        })),
    ];
    const largest = lines.reduce((most, line) => Math.max(most, line.perDay), 0);
    const total = lines.reduce((sum, line) => sum + line.perDay, 0);

    return (
        <section aria-labelledby="breakdown-heading" className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
                <h3
                    id="breakdown-heading"
                    className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                >
                    Where the money goes
                </h3>
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    Per month
                </span>
            </div>
            <ul className="space-y-5">
                {lines.map((line) => (
                    <li key={line.id} className="space-y-1.5">
                        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] items-center gap-x-4 text-sm">
                            <span className="min-w-0">
                                <span className="font-medium">{line.title}</span>
                                <span className="text-muted-foreground block text-xs">
                                    {line.detail}
                                </span>
                            </span>
                            <span className="min-w-0">
                                <span
                                    className="bg-primary text-primary-foreground flex h-5 items-center justify-end rounded-sm px-1.5 font-mono text-xs whitespace-nowrap"
                                    style={{
                                        width: `${largest > 0 ? Math.max((line.perDay / largest) * 100, 1) : 0}%`,
                                    }}
                                >
                                    {largest > 0 && line.perDay === largest
                                        ? `${Math.round((line.perDay / total) * 100)}% of the bill`
                                        : null}
                                </span>
                            </span>
                            <span className="flex-none font-mono whitespace-nowrap tabular-nums">
                                {formatCost(line.perDay * DAYS_PER_MONTH)}
                                <span className="text-muted-foreground text-xs"> /mo</span>
                            </span>
                        </div>
                        {line.formula.terms.length > 0 ? (
                            <p className="text-muted-foreground font-mono text-xs leading-relaxed tabular-nums">
                                {line.formula.terms.map((term, index) => (
                                    <span key={term.field} className="block">
                                        {index === 0 ? "" : "+ "}
                                        {formatTokenCount(Math.round(term.tokens))}{" "}
                                        {FIELD_LABELS[term.field]} ×{" "}
                                        {formatPrice(term.pricePerMillion)}/1M
                                    </span>
                                ))}
                                <span className="block">
                                    = {formatCost(line.formula.dollars)} a day × {DAYS_PER_MONTH}
                                </span>
                            </p>
                        ) : null}
                    </li>
                ))}
            </ul>
            <p className="border-border flex justify-between gap-3 border-t pt-3 text-sm font-medium">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatCost(estimate.perMonth)} /mo</span>
            </p>
        </section>
    );
}
