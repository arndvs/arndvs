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
            className={cn("bg-card border-border space-y-5 rounded-xl border p-5", className)}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id={id} className="text-base font-semibold tracking-tight">
                    <span className="text-muted-foreground mr-2 font-mono text-sm">{step}</span>
                    {title}
                </h2>
                {tag ? (
                    <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs tracking-wide uppercase">
                        {tag}
                    </span>
                ) : null}
            </div>
            {children}
        </section>
    );
}
