"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/lib/story-to-screens/engine";
import { LONG_LINK, encodeState } from "@/lib/story-to-screens/url-state";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
};

/** A link to exactly what's on screen, with a warning when it carries someone's own stories. */
export function ShareDialog({ open, onOpenChange, product }: Props) {
    const [url, setUrl] = useState("");
    const [copied, setCopied] = useState<"yes" | "failed" | null>(null);
    const yours = product.origin !== "example";

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        void encodeState(product).then((params) => {
            if (cancelled) return;
            const { origin, pathname } = window.location;
            setUrl(`${origin}${pathname}?${params.toString()}`);
            setCopied(null);
        });

        return () => {
            cancelled = true;
        };
    }, [open, product]);

    const copy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied("yes");
        } catch {
            setCopied("failed");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this state</DialogTitle>
                    <DialogDescription>
                        {yours
                            ? "This link contains your stories' text. Anyone with it can read them."
                            : "This link opens this example with your changes."}
                    </DialogDescription>
                </DialogHeader>
                <p className="bg-muted max-h-32 overflow-y-auto rounded-md p-3 font-mono text-xs break-all select-all">
                    {url}
                </p>
                <p className="text-muted-foreground text-xs">
                    {url.length.toLocaleString()} characters
                    {url.length > LONG_LINK
                        ? ". Long enough that some email apps may break it; paste it in chat instead."
                        : ""}
                </p>
                <DialogFooter>
                    <Button onClick={copy} disabled={!url}>
                        {copied === "yes"
                            ? "Copied"
                            : copied === "failed"
                              ? "Select the link and copy it"
                              : "Copy link"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
