"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

type Props = {
    /** The faint oversized word behind the heading. */
    backdrop: string;
    eyebrow: string;
    title: ReactNode;
    children: ReactNode;
    compact?: boolean;
    /** Keeps the heading in the same column as the content below it. */
    narrow?: boolean;
};

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

/** The page-opening hero shared by the experiments, matching About and Projects. */
export function ExperimentHero({
    backdrop,
    eyebrow,
    title,
    children,
    compact = false,
    narrow = false,
}: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const reveal = (distance: number, duration: number, delay: number) => ({
        transform: isVisible ? "translateY(0)" : `translateY(${distance}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `all ${duration}s ${ease} ${delay}s`,
    });

    return (
        <section
            className={
                compact
                    ? "relative flex items-start overflow-hidden pt-28 pb-10"
                    : "relative flex min-h-[50vh] items-end overflow-hidden pt-32 pb-16"
            }
        >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
                <span
                    className="font-display text-foreground/[0.02] text-[20vw] font-black tracking-tighter"
                    aria-hidden="true"
                    style={reveal(100, 1.2, 0)}
                >
                    {backdrop}
                </span>
            </div>

            <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20">
                <div className={narrow ? "mx-auto max-w-[46rem]" : "mx-auto max-w-7xl"}>
                    <div style={reveal(30, 0.8, 0.1)}>
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            {eyebrow}
                        </span>
                    </div>
                    <h1
                        className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl"
                        style={reveal(50, 1, 0.2)}
                    >
                        {title}
                    </h1>
                    <div
                        className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                        style={reveal(30, 0.8, 0.4)}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
