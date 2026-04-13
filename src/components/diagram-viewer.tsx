"use client";

import { Maximize2, X } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useMermaidSvg } from "@/lib/hooks/use-mermaid-svg";
import { cn } from "@/lib/utils";

interface DiagramViewerProps {
    chart: string;
    title: string;
    className?: string;
}

/**
 * Rewrite the SVG to have explicit width/height from the viewBox and remove
 * the inline max-width style. This gives the SVG intrinsic dimensions so
 * flex layout + max-width/max-height CSS can scale it properly.
 *
 * The coordinate system is entirely defined by viewBox — setting width/height
 * to match it is safe and doesn't change rendering.
 */
function makeExplicitlySized(svg: string, w: number, h: number): string {
    return svg
        .replace(/(<svg[^>]*)\swidth="[^"]*"/, `$1 width="${w}"`)
        .replace(/(<svg[^>]*)\sheight="[^"]*"/, `$1 height="${h}"`)
        .replace(/(<svg[^>]*style="[^"]*?)max-width:\s*[\d.]+px;\s*/, "$1");
}

export function DiagramViewer({ chart, title, className }: DiagramViewerProps) {
    const [open, setOpen] = useState(false);
    const result = useMermaidSvg(chart);

    // Build a fullscreen-friendly SVG with explicit intrinsic dimensions.
    // Inline preview uses the raw SVG (sized by page container).
    const fullscreenSvg = useMemo(() => {
        if (!result) return null;
        return makeExplicitlySized(result.svg, result.naturalWidth, result.naturalHeight);
    }, [result]);

    // Lock body scroll and handle ESC when fullscreen is open
    useEffect(() => {
        if (!open) return;

        document.body.style.overflow = "hidden";

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const close = useCallback(() => setOpen(false), []);

    return (
        <div className={cn("group relative overflow-hidden rounded-lg border", className)}>
            {/* Inline preview — raw SVG, sized by page container */}
            <div className="overflow-hidden" role="img" aria-label={title}>
                {result ? (
                    <div className="mx-auto" dangerouslySetInnerHTML={{ __html: result.svg }} />
                ) : (
                    <div className="bg-muted flex h-64 items-center justify-center rounded-lg">
                        <div className="border-muted-foreground/20 border-t-muted-foreground h-8 w-8 animate-spin rounded-full border-4" />
                    </div>
                )}
            </div>

            {/* Expand trigger */}
            <div className="from-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-end bg-gradient-to-t to-transparent p-4 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                <Button
                    variant="secondary"
                    size="sm"
                    className="pointer-events-auto shadow-md"
                    onClick={() => setOpen(true)}
                >
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Expand Diagram
                </Button>
            </div>

            {/* Fullscreen lightbox — inline SVG with explicit dimensions */}
            {open && fullscreenSvg && (
                <div
                    className="animate-in fade-in fixed inset-0 z-50 flex flex-col bg-black/90 duration-200"
                    role="dialog"
                    aria-label={`${title} — fullscreen view`}
                    aria-modal="true"
                >
                    {/* Toolbar */}
                    <div className="flex flex-none items-center justify-between px-6 py-4">
                        <h2 className="text-lg font-semibold text-white">{title}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-white hover:bg-white/10"
                            onClick={close}
                            aria-label="Close fullscreen view"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Diagram — SVG has explicit intrinsic dimensions, CSS constrains to viewport */}
                    <div
                        className="flex min-h-0 flex-1 items-center justify-center px-6 pb-6"
                        onClick={close}
                    >
                        <div
                            className="[&_svg]:h-auto [&_svg]:max-h-[calc(100vh-6rem)] [&_svg]:max-w-[calc(100vw-3rem)] [&_svg]:rounded-lg [&_svg]:bg-white [&_svg]:p-4"
                            onClick={(e) => e.stopPropagation()}
                            dangerouslySetInnerHTML={{ __html: fullscreenSvg }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
