"use client";

import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMermaidSvg } from "@/lib/hooks/use-mermaid-svg";
import { cn } from "@/lib/utils";

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

interface DiagramViewerProps {
    chart: string;
    title: string;
    className?: string;
}

export function DiagramViewer({ chart, title, className }: DiagramViewerProps) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [fitZoom, setFitZoom] = useState(1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const result = useMermaidSvg(chart);

    // Calculate fit-to-width zoom when dialog opens
    useEffect(() => {
        if (!open || !result || !scrollRef.current) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const containerWidth = entry.contentRect.width - 48; // minus p-6 padding
            const fit = Math.min(containerWidth / result.naturalWidth, 1);
            setFitZoom(fit);
            setZoom(fit);
        });

        observer.observe(scrollRef.current);
        return () => observer.disconnect();
    }, [open, result]);

    const zoomIn = useCallback(() => {
        setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    }, []);

    const zoomOut = useCallback(() => {
        setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));
    }, []);

    const resetZoom = useCallback(() => {
        setZoom(fitZoom);
    }, [fitZoom]);

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
    }

    const displayPercent = result
        ? Math.round((zoom / fitZoom) * 100)
        : 100;

    return (
        <div className={cn("group relative overflow-hidden rounded-lg border", className)}>
            <div className="overflow-hidden" role="img" aria-label={title}>
                {result ? (
                    <div
                        className="mx-auto"
                        dangerouslySetInnerHTML={{ __html: result.svg }}
                    />
                ) : (
                    <div className="bg-muted flex h-64 items-center justify-center rounded-lg">
                        <div className="border-muted-foreground/20 border-t-muted-foreground h-8 w-8 animate-spin rounded-full border-4" />
                    </div>
                )}
            </div>

            <div className="from-background/80 pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-end bg-gradient-to-t to-transparent p-4 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="pointer-events-auto shadow-md"
                        >
                            <Maximize2 className="mr-2 h-4 w-4" />
                            Expand Diagram
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        className="flex h-[90vh] max-w-[95vw] flex-col gap-0 p-0"
                        showCloseButton
                    >
                        <DialogHeader className="flex-none border-b px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle>{title}</DialogTitle>
                                    <DialogDescription className="sr-only">
                                        Expanded view of the {title} diagram
                                    </DialogDescription>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={zoomOut}
                                        disabled={zoom <= MIN_ZOOM}
                                        aria-label="Zoom out"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="text-muted-foreground w-14 text-center text-sm tabular-nums">
                                        {displayPercent}%
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={zoomIn}
                                        disabled={zoom >= MAX_ZOOM}
                                        aria-label="Zoom in"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={resetZoom}
                                        aria-label="Fit to width"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>

                        <div ref={scrollRef} className="flex-1 overflow-auto p-6">
                            {result && (
                                <div
                                    className="transition-[width] duration-150 ease-out [&_svg]:!max-w-none [&_svg]:w-full"
                                    style={{
                                        width: result.naturalWidth * zoom,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: result.svg }}
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
