import { Badge } from "@/components/ui/badge";
import { calculateCost } from "@/lib/rag-cost/calculate-cost";
import {
    formatCalendarDate,
    formatCost,
    formatPrice,
    formatTokenCount,
} from "@/lib/rag-cost/format";
import type { ModelPricing } from "@/lib/rag-cost/model-pricing";
import type { TokenUsage } from "@/lib/rag-cost/token-usage";

type Props = {
    models: ModelPricing[];
    /** One month of generation, as if a single model answered every question. */
    usage: TokenUsage;
    selectedIds: ReadonlySet<string>;
    /** Input tokens in one prompt, to flag models whose listed price stops below it. */
    promptTokens: number;
    updated: string;
};

/** The same workload priced on every generation model, cheapest first. */
export function ModelComparison({ models, usage, selectedIds, promptTokens, updated }: Props) {
    const rows = models
        .map((model, index) => ({ model, index, cost: calculateCost(usage, model) }))
        .sort((first, second) => first.cost - second.cost || first.index - second.index);
    const largest = rows.reduce((most, row) => Math.max(most, row.cost), 0);

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
                    One month of answers as if a single model wrote them all, with caching and Jev’s
                    filters applied. Prices are US dollars per million tokens, last checked{" "}
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
                        Prices per million tokens and the monthly cost of this workload on each
                        model, cheapest first
                    </caption>
                    <thead>
                        <tr className="border-border text-muted-foreground border-b text-xs">
                            <th scope="col" className="py-2 pr-3 text-left font-medium">
                                Model
                            </th>
                            <th scope="col" className="px-3 py-2 text-right font-medium">
                                Input
                            </th>
                            <th scope="col" className="px-3 py-2 text-right font-medium">
                                Cached
                            </th>
                            <th scope="col" className="px-3 py-2 text-right font-medium">
                                Output
                            </th>
                            <th scope="col" className="py-2 pl-3 text-right font-medium">
                                Per month
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(({ model, cost }, index) => {
                            const selected = selectedIds.has(model.id);
                            const overLimit =
                                model.maximumPromptTokens !== undefined &&
                                promptTokens > model.maximumPromptTokens;

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
                                                    Lowest cost
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
                                        {formatPrice(model.input)}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                                        {formatPrice(model.cachedInput)}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap tabular-nums">
                                        {formatPrice(model.output)}
                                    </td>
                                    <td className="w-36 py-2.5 pl-3 text-right align-top font-mono whitespace-nowrap tabular-nums">
                                        {formatCost(cost)}
                                        <span
                                            aria-hidden="true"
                                            className="bg-muted mt-1.5 block h-1 overflow-hidden rounded-full"
                                        >
                                            <span
                                                className="bg-primary block h-full rounded-full"
                                                style={{
                                                    width: `${largest > 0 ? (cost / largest) * 100 : 0}%`,
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
