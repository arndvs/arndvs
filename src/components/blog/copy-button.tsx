"use client";

import { Check, Copy } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

export function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopy = useCallback(async () => {
        try {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            await navigator.clipboard.writeText(code);
            setCopied(true);
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable — silently no-op
        }
    }, [code]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-zinc-400 opacity-100 backdrop-blur-sm transition-all hover:text-zinc-100 focus-visible:pointer-events-auto focus-visible:opacity-100 sm:pointer-events-none sm:opacity-0 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100"
            aria-label={copied ? "Copied" : "Copy code"}
        >
            {copied ? (
                <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
}
