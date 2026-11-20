"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTokenCount, parseTokenCount } from "@/lib/rag-cost/format";

type Props = {
    id: string;
    label: string;
    /** A short note beside the label, such as "tokens". */
    hint?: string;
    value: number;
    onChange: (value: number) => void;
    description?: string;
};

/**
 * A whole-number field that accepts shorthand such as 250k or 1.5M. While
 * someone types, it shows what they typed. Otherwise it shows the current
 * value, so a reset or a shared link appears without any syncing.
 */
export function TokenCountField({ id, label, hint, value, onChange, description }: Props) {
    const [draft, setDraft] = useState<string | null>(null);

    const text = draft ?? formatTokenCount(value);
    const invalid = parseTokenCount(text) === null;
    const describedBy = invalid ? `${id}-error` : description ? `${id}-description` : undefined;

    return (
        <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor={id}>{label}</Label>
                {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
            </div>
            <Input
                id={id}
                type="text"
                inputMode="numeric"
                value={text}
                onChange={(event) => {
                    setDraft(event.target.value);
                    const parsed = parseTokenCount(event.target.value);
                    if (parsed !== null) onChange(parsed);
                }}
                onFocus={() => setDraft(formatTokenCount(value))}
                // An invalid draft stays visible with its error; a valid one is reformatted.
                onBlur={() => setDraft(invalid ? text : null)}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                className="font-mono tabular-nums"
            />
            {invalid ? (
                <p id={`${id}-error`} className="text-destructive text-xs">
                    Enter a whole number, such as 250000, 250k, or 1.5M.
                </p>
            ) : description ? (
                <p id={`${id}-description`} className="text-muted-foreground text-xs">
                    {description}
                </p>
            ) : null}
        </div>
    );
}
