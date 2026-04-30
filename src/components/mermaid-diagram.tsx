"use client";

import { useTheme } from "next-themes";

import { useMermaidSvg } from "@/lib/hooks/use-mermaid-svg";

interface MermaidDiagramProps {
    chart: string;
    className?: string;
    ariaLabel?: string;
}

export function MermaidDiagram({ chart, className, ariaLabel }: MermaidDiagramProps) {
    const { resolvedTheme } = useTheme();
    const mermaidTheme = resolvedTheme === "dark" ? "dark" : "neutral";
    const result = useMermaidSvg(chart, { theme: mermaidTheme });

    return (
        <div className={className} role="img" aria-label={ariaLabel ?? "Architecture diagram"}>
            {result ? (
                <div
                    className="overflow-x-auto [&_svg]:mx-auto"
                    // SAFETY: SVG is rendered by mermaid from hardcoded chart strings, not user input
                    dangerouslySetInnerHTML={{ __html: result.svg }}
                />
            ) : (
                <div className="bg-muted flex h-64 items-center justify-center rounded-lg">
                    <div className="border-muted-foreground/20 border-t-muted-foreground h-8 w-8 animate-spin rounded-full border-4" />
                </div>
            )}
        </div>
    );
}
