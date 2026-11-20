import { formatCost } from "@/lib/rag-cost/format";

type Props = {
    perMonth: number;
    perDay: number;
    /** The monthly cost with every lever off. */
    withoutLevers: number;
    perThousandQueries: number;
};

/** The three headline numbers. */
export function SummaryStrip({ perMonth, perDay, withoutLevers, perThousandQueries }: Props) {
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
        <dl className="divide-border border-border grid divide-y border-b sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {metrics.map((metric, index) => (
                <div key={metric.label} className="px-5 py-4 sm:px-6">
                    <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {metric.label}
                    </dt>
                    <dd
                        className={
                            index === 0
                                ? "font-display text-primary stat-number mt-1 text-4xl lg:text-5xl"
                                : "font-display stat-number mt-1 text-4xl lg:text-5xl"
                        }
                    >
                        {metric.value}
                    </dd>
                    <dd className="text-muted-foreground mt-1 text-xs">{metric.note}</dd>
                </div>
            ))}
        </dl>
    );
}
