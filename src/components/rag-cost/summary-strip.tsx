import { formatCost } from "@/lib/rag-cost/format";

type Props = {
    perMonth: number;
    perDay: number;
    /** The monthly cost with every lever off. */
    withoutLevers: number;
    perThousandQueries: number;
    compact?: boolean;
};

/** The three headline numbers. */
export function SummaryStrip({
    perMonth,
    perDay,
    withoutLevers,
    perThousandQueries,
    compact = false,
}: Props) {
    const change = perMonth - withoutLevers;
    const changeText =
        Math.abs(change) < 0.005
            ? formatCost(0)
            : `${change < 0 ? "−" : "+"}${formatCost(Math.abs(change))}`;
    const changeNote =
        Math.abs(change) < 0.005
            ? "Turn on a lever to see what it saves"
            : `${change < 0 ? "Lower" : "Higher"} than ${formatCost(withoutLevers)} with no levers`;

    const metrics = [
        { label: "Per month", value: formatCost(perMonth), note: `${formatCost(perDay)} a day` },
        { label: "Change from levers", value: changeText, note: changeNote },
        {
            label: "Per 1,000 questions",
            value: formatCost(perThousandQueries),
            note: "After caching and routing",
        },
    ];

    return (
        <dl
            className={
                compact
                    ? "border-border grid grid-cols-2"
                    : "divide-border border-border grid divide-y border-b sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            }
        >
            {metrics.map((metric, index) => (
                <div
                    key={metric.label}
                    className={
                        compact
                            ? index === 0
                                ? "border-border col-span-2 border-b px-5 py-4"
                                : index === 1
                                  ? "border-border border-r px-4 py-3"
                                  : "px-4 py-3"
                            : "px-5 py-4 sm:px-6"
                    }
                >
                    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {metric.label}
                    </dt>
                    <dd
                        className={
                            compact
                                ? index === 0
                                    ? "font-display text-primary stat-number mt-1 text-4xl"
                                    : `font-display stat-number mt-1 text-2xl ${
                                          index === 1 && change < -0.005
                                              ? "text-emerald-700 dark:text-emerald-400"
                                              : index === 1 && change > 0.005
                                                ? "text-amber-700 dark:text-amber-400"
                                                : ""
                                      }`
                                : index === 0
                                  ? "font-display text-primary stat-number mt-1 text-4xl lg:text-5xl"
                                  : "font-display stat-number mt-1 text-4xl lg:text-5xl"
                        }
                    >
                        {metric.value}
                    </dd>
                    <dd className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        {metric.note}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
