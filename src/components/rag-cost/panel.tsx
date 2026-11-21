import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
    /** Shown before the title, such as "01", so the panels read in order. */
    step: string;
    title: string;
    /** A short mono label in the corner, such as "USD / 1M tokens". */
    tag?: string;
    className?: string;
    children: ReactNode;
};

/** One numbered input panel. */
export function Panel({ step, title, tag, className, children }: Props) {
    const id = `panel-${step}`;

    return (
        <section
            aria-labelledby={id}
            className={cn(
                "border-border grid gap-5 border-t py-7 first:border-t-0 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10",
                className,
            )}
        >
            <div className="space-y-2">
                <p className="text-signal font-mono text-xs tracking-widest uppercase">
                    Step {step}
                </p>
                <h2 id={id} className="text-lg font-semibold tracking-tight text-balance">
                    {title}
                </h2>
                {tag ? (
                    <p className="text-muted-foreground text-xs leading-relaxed">{tag}</p>
                ) : null}
            </div>
            <div className="flex min-w-0 flex-col gap-6">{children}</div>
        </section>
    );
}
