"use client";

import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TransformComponent, TransformWrapper, useControls } from "react-zoom-pan-pinch";

import { useTheme } from "next-themes";

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
 * the pan/zoom canvas can measure and transform it correctly.
 */
function makeExplicitlySized(svg: string, w: number, h: number): string {
    return svg
        .replace(/(<svg[^>]*)\swidth="[^"]*"/, `$1 width="${w}"`)
        .replace(/(<svg[^>]*)\sheight="[^"]*"/, `$1 height="${h}"`)
        .replace(/(<svg[^>]*style="[^"]*?)max-width:\s*[\d.]+px;\s*/, "$1");
}

function CanvasControls({ title, onClose }: { title: string; onClose: () => void }) {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3">
            <h2 className="bg-muted/80 text-foreground pointer-events-auto rounded-md px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
                {title}
            </h2>

            <div className="bg-muted/80 pointer-events-auto flex items-center gap-1 rounded-lg p-1 backdrop-blur-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground h-7 w-7"
                    onClick={() => zoomIn()}
                    aria-label="Zoom in"
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground h-7 w-7"
                    onClick={() => zoomOut()}
                    aria-label="Zoom out"
                >
                    <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground h-7 w-7"
                    onClick={() => resetTransform()}
                    aria-label="Fit to screen"
                >
                    <RotateCcw className="h-3 w-3" />
                </Button>
                <div className="bg-foreground/20 mx-1 h-4 w-px" />
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground h-7 w-7"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

/** Hint shown bottom-center, fades after a few seconds */
function CanvasHint() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(t);
    }, []);

    if (!visible) return null;

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center pb-4">
            <span className="bg-muted/80 text-muted-foreground rounded-full px-4 py-1.5 text-xs backdrop-blur-sm transition-opacity duration-500">
                Scroll to zoom · Drag to pan
            </span>
        </div>
    );
}

export function DiagramViewer({ chart, title, className }: DiagramViewerProps) {
    const [open, setOpen] = useState(false);
    const { resolvedTheme } = useTheme();
    const mermaidTheme = resolvedTheme === "dark" ? "dark" : "neutral";
    const result = useMermaidSvg(chart, { theme: mermaidTheme });

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
            {/* Inline preview — neutral theme SVG, sized by page container */}
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

            {/* Fullscreen dark canvas — like mermaid.live editor */}
            {open && fullscreenSvg && (
                <div
                    className="animate-in fade-in bg-background fixed inset-0 z-50 duration-200"
                    role="dialog"
                    aria-label={`${title} — fullscreen view`}
                    aria-modal="true"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, oklch(0.5 0 0 / 0.08) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                >
                    <TransformWrapper
                        initialScale={0.9}
                        minScale={0.1}
                        maxScale={5}
                        centerOnInit
                        limitToBounds={false}
                        wheel={{ step: 0.0005 }}
                        doubleClick={{ mode: "zoomIn" }}
                    >
                        <CanvasControls title={title} onClose={close} />
                        <CanvasHint />

                        <TransformComponent
                            wrapperStyle={{
                                width: "100%",
                                height: "100%",
                                cursor: "grab",
                            }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: fullscreenSvg }} />
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            )}
        </div>
    );
}
