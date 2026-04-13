"use client";

import type { ChangelogEntryType } from "@/lib/types/sanity";
import { cn } from "@/lib/utils";

const filterLabels: Record<ChangelogEntryType, string> = {
    feature: "Features",
    improvement: "Improvements",
    fix: "Fixes",
    content: "Content",
    infrastructure: "Infrastructure",
};

interface ChangelogFilterProps {
    types: ChangelogEntryType[];
    active: ChangelogEntryType | null;
    onChange: (type: ChangelogEntryType | null) => void;
}

export function ChangelogFilter({ types, active, onChange }: ChangelogFilterProps) {
    return (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter changelog entries">
            <button
                onClick={() => onChange(null)}
                className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active === null
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20",
                )}
                aria-pressed={active === null}
            >
                All
            </button>

            {types.map((type) => (
                <button
                    key={type}
                    onClick={() => onChange(active === type ? null : type)}
                    className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        active === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20",
                    )}
                    aria-pressed={active === type}
                >
                    {filterLabels[type]}
                </button>
            ))}
        </div>
    );
}
