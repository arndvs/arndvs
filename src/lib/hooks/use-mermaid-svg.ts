"use client";

import { useEffect, useState } from "react";

interface MermaidSvgResult {
    svg: string;
    naturalWidth: number;
    naturalHeight: number;
}

interface UseMermaidSvgOptions {
    theme?: "neutral" | "dark" | "default" | "forest" | "base";
}

export function useMermaidSvg(
    chart: string,
    options?: UseMermaidSvgOptions,
): MermaidSvgResult | null {
    const theme = options?.theme ?? "neutral";
    const [result, setResult] = useState<MermaidSvgResult | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function render() {
            try {
                const mermaid = (await import("mermaid")).default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme,
                    fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)",
                    flowchart: { htmlLabels: true, curve: "basis" },
                    sequence: { actorMargin: 50, messageFontSize: 13 },
                });

                const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`;
                const { svg: rendered } = await mermaid.render(id, chart);
                if (cancelled) return;

            // Parse natural dimensions from the rendered SVG.
            // Mermaid outputs: <svg width="100%" style="max-width: Wpx;" viewBox="0 0 W H">
            // We extract the intended width from max-width or viewBox, but do NOT modify the SVG.
            const parser = new DOMParser();
            const doc = parser.parseFromString(rendered, "image/svg+xml");
            const svgEl = doc.querySelector("svg");

            let naturalWidth = 800;
            let naturalHeight = 600;

            if (svgEl) {
                // 1. max-width from inline style is the most reliable source
                const styleAttr = svgEl.getAttribute("style") ?? "";
                const maxWidthMatch = styleAttr.match(/max-width:\s*([\d.]+)\s*px/);
                if (maxWidthMatch) {
                    naturalWidth = parseFloat(maxWidthMatch[1]!);
                }

                // 2. viewBox for height (and width fallback)
                const viewBox = svgEl.getAttribute("viewBox");
                if (viewBox) {
                    const parts = viewBox.split(/[\s,]+/).map(Number);
                    if (parts.length === 4 && parts[2]! > 0 && parts[3]! > 0) {
                        if (!maxWidthMatch) naturalWidth = parts[2]!;
                        naturalHeight = parts[3]!;
                    }
                }

                // 3. Fallback: explicit width/height attributes (skip percentages)
                if (!viewBox && !maxWidthMatch) {
                    const w = parseFloat(svgEl.getAttribute("width") ?? "");
                    const h = parseFloat(svgEl.getAttribute("height") ?? "");
                    if (w > 0) naturalWidth = w;
                    if (h > 0) naturalHeight = h;
                }
            }

                // Return the SVG unmodified — container CSS controls sizing
                setResult({ svg: rendered, naturalWidth, naturalHeight });
            } catch (err) {
                if (!cancelled) {
                    console.error("Mermaid render failed:", err);
                    setResult(null);
                }
            }
        }

        setResult(null);
        render();
        return () => {
            cancelled = true;
        };
    }, [chart, theme]);

    return result;
}
