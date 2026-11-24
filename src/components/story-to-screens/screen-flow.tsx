"use client";

import { useMemo } from "react";

import { useTheme } from "next-themes";

import { useMermaidSvg } from "@/lib/hooks/use-mermaid-svg";
import type { Derived } from "@/lib/story-to-screens/engine";
import { DARK_FILLS, LIGHT_FILLS, flowChart } from "@/lib/story-to-screens/flow";

type Props = {
    derived: Derived;
    /** Called with a screen id when someone clicks its box. */
    onPick: (screenId: string) => void;
};

const KEYS = [
    { id: "mvp", label: "MVP" },
    { id: "r2", label: "Release 2" },
    { id: "r3", label: "Release 3" },
    { id: "later", label: "Later" },
] as const;

/** The screens as a flow, colored by release. */
export function ScreenFlow({ derived, onPick }: Props) {
    const { resolvedTheme } = useTheme();
    const dark = resolvedTheme === "dark";
    const fills = dark ? DARK_FILLS : LIGHT_FILLS;
    const { chart, nodeIds } = useMemo(() => flowChart(derived, fills), [derived, fills]);
    const result = useMermaidSvg(chart, { theme: dark ? "dark" : "neutral" });
    const shown = derived.screens.filter((screen) => screen.release !== "none");

    return (
        <div className="space-y-3">
            <ul className="text-muted-foreground flex flex-wrap gap-4 text-xs" aria-label="Key">
                {KEYS.map((key) => (
                    <li key={key.id} className="flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="size-3 rounded-sm border"
                            style={{ background: fills[key.id] }}
                        />
                        {key.label}
                    </li>
                ))}
            </ul>
            <p className="text-muted-foreground text-xs">Click a screen to find it in step 03.</p>
            {result ? (
                <div
                    role="img"
                    aria-label={`Flow of ${shown.length} screens: ${shown.map((screen) => screen.name).join(", ")}.`}
                    className="overflow-x-auto [&_g.node]:cursor-pointer [&_svg]:max-w-none"
                    onClick={(event) => {
                        const node = (event.target as Element).closest("g.node");
                        if (!node) return;
                        for (const [screenId, nodeId] of nodeIds) {
                            if (node.id.includes(`-${nodeId}-`)) return onPick(screenId);
                        }
                    }}
                    // SAFETY: the chart's labels are reduced to plain characters in flowChart,
                    // and Mermaid renders with its default strict security level.
                    dangerouslySetInnerHTML={{ __html: result.svg }}
                />
            ) : (
                <div className="bg-muted h-64 animate-pulse rounded-lg" />
            )}
        </div>
    );
}
