import { formatCost } from "@/lib/rag-cost/format";

type Props = {
    perMonth: number;
    perDay: number;
    /** Monthly cost for the same workload with every saving strategy off. */
    withoutLevers: number;
    perThousandQueries: number;
};

/** The live estimate, its no-savings baseline, and the difference between them. */
export function SummaryStrip({ perMonth, perDay, withoutLevers, perThousandQueries }: Props) {
    const saved = Math.max(0, withoutLevers - perMonth);
    const percentSaved = withoutLevers > 0 ? Math.round((saved / withoutLevers) * 100) : 0;

    return (
        <div className="border-border border-y py-5 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Estimated monthly cost
                    </p>
                    <p className="stat-number text-signal mt-1 font-sans text-4xl font-semibold sm:text-5xl">
                        {formatCost(perMonth)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {formatCost(perDay)} per day · {formatCost(perThousandQueries)} per 1,000
                        questions
                    </p>
                </div>
                <div className="border-border min-w-40 border-l py-1 pl-4">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Your savings
                    </p>
                    <p className="stat-number mt-1 font-sans text-2xl font-semibold">
                        {saved > 0 ? `−${formatCost(saved)}` : formatCost(0)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {percentSaved}% less than no savings
                    </p>
                </div>
            </div>
            <dl className="border-border mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                    <dt className="text-muted-foreground">Without savings</dt>
                    <dd className="mt-1 font-mono tabular-nums">{formatCost(withoutLevers)} /mo</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">With your setup</dt>
                    <dd className="mt-1 font-mono font-medium tabular-nums">
                        {formatCost(perMonth)} /mo
                    </dd>
                </div>
            </dl>
        </div>
    );
}
