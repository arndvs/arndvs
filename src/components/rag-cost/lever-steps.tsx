import { formatCost, formatTokenCount } from "@/lib/rag-cost/format";
import type { LeverStep } from "@/lib/rag-cost/levers";

type Props = {
    steps: LeverStep[];
    /** Replaces the generic "Decision model" in step labels, such as with "Jev". */
    decisionName?: string;
    answeredPerDay: number;
    /** Shown only while something is routed. */
    misroutedPerDay: number | null;
};

const signed = (amount: number): string =>
    `${amount < 0 ? "−" : "+"}${formatCost(Math.abs(amount))}`;

/** What each lever changes, applied one after another from no levers at all. */
export function LeverSteps({ steps, decisionName, answeredPerDay, misroutedPerDay }: Props) {
    const label = (text: string): string =>
        decisionName ? text.replace(/^Decision model:/, `${decisionName}:`) : text;

    return (
        <section
            aria-labelledby="levers-heading"
            className="grid gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10"
        >
            <div className="space-y-1">
                <h3
                    id="levers-heading"
                    className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                >
                    What moves the bill
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                    Each lever applies after the ones above it, so its saving depends on them.
                </p>
            </div>

            <div className="min-w-0">
                <ol className="divide-border divide-y text-sm">
                    {steps.map((step, index) => (
                        <li
                            key={step.id}
                            className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                        >
                            <span
                                className={index === steps.length - 1 ? "font-medium" : undefined}
                            >
                                {label(step.label)}
                            </span>
                            <span className="flex-none text-right font-mono tabular-nums">
                                {index > 0 ? (
                                    <span
                                        className={
                                            step.change <= 0
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : "text-amber-700 dark:text-amber-400"
                                        }
                                    >
                                        {signed(step.change)}
                                    </span>
                                ) : null}
                                <span className="text-muted-foreground block text-xs">
                                    {formatCost(step.perMonth)} /mo
                                </span>
                            </span>
                        </li>
                    ))}
                </ol>
                {steps.length === 1 ? (
                    <p className="text-muted-foreground mt-3 text-xs">
                        Every lever starts off. Turn one on to see what it saves.
                    </p>
                ) : null}

                <dl className="divide-border border-border mt-4 divide-y border-t text-sm">
                    <div className="flex justify-between gap-3 py-2.5">
                        <dt className="text-muted-foreground">Answered by a model</dt>
                        <dd className="font-mono tabular-nums">
                            {formatTokenCount(Math.round(answeredPerDay))} a day
                        </dd>
                    </div>
                    {misroutedPerDay !== null ? (
                        <div className="flex justify-between gap-3 py-2.5">
                            <dt className="text-muted-foreground">Sent to the wrong model</dt>
                            <dd className="font-mono tabular-nums">
                                {formatTokenCount(Math.round(misroutedPerDay))} a day
                            </dd>
                        </div>
                    ) : null}
                </dl>
            </div>
        </section>
    );
}
