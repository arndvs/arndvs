import { Badge } from "@/components/ui/badge";
import { calculateCost } from "@/lib/rag-cost/calculate-cost";
import { formatCalendarDate, formatCost, formatTokenCount } from "@/lib/rag-cost/format";
import type { ModelPricing } from "@/lib/rag-cost/model-pricing";
import type { TokenUsage } from "@/lib/rag-cost/token-usage";

type Props = {
    models: ModelPricing[];
    /** One month of generation before any savings are applied, on one model. */
    baselineUsage: TokenUsage;
    /** One month of generation with the current savings assumptions, on one model. */
    usage: TokenUsage;
    selectedIds: ReadonlySet<string>;
    /** Input tokens in one prompt, to flag models whose listed price stops below it. */
    promptTokens: number;
    updated: string;
};

/** Compare the same workload across models, before and after the current savings. */
export function ModelComparison({
    models,
    baselineUsage,
    usage,
    selectedIds,
    promptTokens,
    updated,
}: Props) {
    const rows = models
        .map((model, index) => ({
            model,
            index,
            baseline: calculateCost(baselineUsage, model),
            current: calculateCost(usage, model),
        }))
        .sort((first, second) => first.current - second.current || first.index - second.index);
    const largest = rows.reduce((most, row) => Math.max(most, row.current), 0);

    return (
        <section aria-labelledby="every-model-heading" className="space-y-4">
            <div className="space-y-1">
                <h3
                    id="every-model-heading"
                    className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                >
                    The same workload on every model
                </h3>
                <p className="text-muted-foreground text-xs">
                    One model handles the full workload in each row. Compare the no-savings baseline
                    with the same model under your current settings. Pricing last checked{" "}
                    {formatCalendarDate(updated)}.
                </p>
            </div>

            <div
                className="focus-visible:ring-ring/50 relative -mx-5 overflow-x-auto px-5 outline-none focus-visible:ring-[3px] sm:mx-0 sm:px-0"
                tabIndex={0}
                role="region"
                aria-label="Monthly cost on every model"
            >
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                    <caption className="sr-only">
                        Monthly cost without savings and with your current settings for each model
                    </caption>
                    <thead>
                        <tr className="border-border text-muted-foreground border-b text-xs">
                            <th scope="col" className="py-2 pr-3 text-left font-medium">
                                Model
                            </th>
                            <th scope="col" className="px-3 py-2 text-right font-medium">
                                Without savings
                            </th>
                            <th scope="col" className="px-3 py-2 text-right font-medium">
                                With yours
                            </th>
                            <th scope="col" className="py-2 pl-3 text-right font-medium">
                                Saved
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ model, baseline, current }, index) => {
                            const selected = selectedIds.has(model.id);
                            const overLimit =
                                model.maximumPromptTokens !== undefined &&
                                promptTokens > model.maximumPromptTokens;
                            const savings = baseline - current;
                            const savingsLabel =
                                savings > 0.005
                                    ? `−${formatCost(savings)}`
                                    : savings < -0.005
                                      ? `+${formatCost(Math.abs(savings))}`
                                      : formatCost(0);

                            return (
                                <tr
                                    key={model.id}
                                    className={
                                        selected
                                            ? "border-border bg-primary/5 border-b"
                                            : "border-border border-b"
                                    }
                                >
                                    <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <span className="font-medium">{model.name}</span>
                                            {model.variant ? (
                                                <Badge variant="secondary">{model.variant}</Badge>
                                            ) : null}
                                            {index === 0 ? (
                                                <Badge variant="outline" className="font-mono">
                                                    Lowest with yours
                                                </Badge>
                                            ) : null}
                                            {selected ? <Badge>Selected</Badge> : null}
                                        </span>
                                        <span className="text-muted-foreground block text-xs">
                                            {model.provider}
                                        </span>
                                        {overLimit ? (
                                            <span className="block text-xs text-amber-700 dark:text-amber-400">
                                                This price covers prompts up to{" "}
                                                {formatTokenCount(model.maximumPromptTokens ?? 0)}{" "}
                                                tokens. Larger ones cost more.
                                            </span>
                                        ) : null}
                                    </th>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                                        {formatCost(baseline)}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-medium whitespace-nowrap tabular-nums">
                                        {formatCost(current)}
                                    </td>
                                    <td className="py-2.5 pl-3 text-right align-top font-mono whitespace-nowrap tabular-nums">
                                        {savingsLabel}
                                        <span
                                            aria-hidden="true"
                                            className="bg-muted mt-1.5 block h-1 overflow-hidden rounded-full"
                                        >
                                            <span
                                                className="bg-primary block h-full rounded-full"
                                                style={{
                                                    width: `${largest > 0 ? (current / largest) * 100 : 0}%`,
                                                }}
                                            />
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
