"use client";

import { Check, Copy } from "lucide-react";

import { useCallback, useState } from "react";

export function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-zinc-400 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:text-zinc-100"
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
