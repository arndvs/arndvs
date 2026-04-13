"use client";

import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
const DEFAULT_ZOOM_INDEX = 2; // 100%

interface DiagramViewerProps {
    chart: string;
    title: string;
    className?: string;
}

export function DiagramViewer({ chart, title, className }: DiagramViewerProps) {
    const [open, setOpen] = useState(false);
    const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
    const scrollRef = useRef<HTMLDivElement>(null);

    const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;

    const zoomIn = useCallback(() => {
        setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
    }, []);

    const zoomOut = useCallback(() => {
        setZoomIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const resetZoom = useCallback(() => {
        setZoomIndex(DEFAULT_ZOOM_INDEX);
    }, []);

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen)
            setZoomIndex(DEFAULT_ZOOM_INDEX);
    }

    return (
        <div className={cn("group relative", className)}>
            <MermaidDiagram chart={chart} ariaLabel={title} />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-background/80 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
                                        disabled={zoomIndex === 0}
                                        aria-label="Zoom out"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>

                                    <span className="text-muted-foreground w-14 text-center text-sm tabular-nums">
                                        {Math.round(zoom * 100)}%
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={zoomIn}
                                        disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                                        aria-label="Zoom in"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={resetZoom}
                                        aria-label="Reset zoom"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>

                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-auto p-6"
                        >
                            <div
                                className="origin-top-left transition-transform duration-150 ease-out [&_svg]:max-w-none"
                                style={{ transform: `scale(${zoom})` }}
                            >
                                <MermaidDiagram chart={chart} ariaLabel={title} />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
