import type { Derived } from "@/lib/story-to-screens/engine";

type Props = {
    derived: Derived;
    /** Screens added by hand, which the rules didn't add. */
    manualCount: number;
};

/** The headline: how many screens there are, and how many a first pass would have missed. */
export function SummaryStrip({ derived, manualCount }: Props) {
    const kept = derived.screens.filter((screen) => screen.release !== "none").length;
    const mvp = derived.screens.filter((screen) => screen.release === "mvp").length;
    const fromStories = derived.steps[0]?.total ?? 0;
    const added = derived.screens.length - fromStories - manualCount;
    const open = derived.findings.filter((finding) => finding.status === "open").length;

    return (
        <div className="border-border border-y py-5 sm:py-6">
            <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Screens the rules added
                    </p>
                    <p className="stat-number text-signal mt-1 font-sans text-4xl font-semibold sm:text-5xl">
                        +{added}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                        on top of the {fromStories} a first pass at the stories finds
                    </p>
                </div>
                <div className="border-border min-w-40 border-l py-1 pl-4">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Open findings
                    </p>
                    <p className="stat-number mt-1 font-sans text-2xl font-semibold">{open}</p>
                </div>
            </div>
            <dl className="border-border mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                    <dt className="text-muted-foreground">Screens in the product</dt>
                    <dd className="mt-1 font-mono tabular-nums">{kept}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">In the MVP</dt>
                    <dd className="mt-1 font-mono font-medium tabular-nums">{mvp}</dd>
                </div>
            </dl>
        </div>
    );
}
