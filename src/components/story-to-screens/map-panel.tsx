"use client";

import type { Cardinality, Derived, Product } from "@/lib/story-to-screens/engine";
import { capitalize } from "@/lib/story-to-screens/wording";
import { cn } from "@/lib/utils";

type Props = {
    derived: Derived;
    change: (apply: (draft: Product) => void) => void;
};

/** Panel 02: the players and things, and a one-or-many switch for every action between them. */
export function MapPanel({ derived, change }: Props) {
    const flagged = new Set(
        derived.findings
            .filter((finding) => finding.ruleId === "cardinality" && finding.status === "open")
            .flatMap((finding) => finding.sources.map((source) => source.id)),
    );

    return (
        <>
            {derived.entities.length ? (
                <ul aria-label="Players and things" className="flex flex-wrap gap-2">
                    {derived.entities.map((entity) => (
                        <li
                            key={entity.id}
                            className={cn(
                                "rounded-full border px-3 py-1 text-xs",
                                entity.isRole ? "border-primary/50 font-medium" : "border-border",
                            )}
                        >
                            {entity.name}
                            {entity.isRole ? (
                                <span className="text-muted-foreground"> · role</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">Mark some things in your stories.</p>
            )}

            {derived.relationships.length ? (
                <ul className="divide-border divide-y" aria-label="Actions">
                    {derived.relationships.map((rel) => (
                        <li
                            key={rel.id}
                            id={`rel-${rel.id}`}
                            className="data-[flash=true]:ring-primary flex flex-wrap items-center justify-between gap-3 rounded py-2 text-sm data-[flash=true]:ring-2"
                        >
                            <span>
                                <span className="font-medium">{capitalize(rel.from)}</span>{" "}
                                <span className="text-muted-foreground italic">
                                    {rel.verbs.join(" / ")}
                                </span>{" "}
                                <span className="font-medium">{capitalize(rel.to)}</span>
                            </span>
                            <span
                                role="group"
                                aria-label={`How many ${rel.to} for each ${rel.from}`}
                                className={cn(
                                    "flex rounded-md border p-0.5",
                                    flagged.has(rel.id)
                                        ? "border-amber-500 ring-1 ring-amber-500"
                                        : "border-border",
                                )}
                            >
                                {(["one", "many"] as const satisfies readonly Cardinality[]).map(
                                    (value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-pressed={rel.cardinality === value}
                                            onClick={() =>
                                                change((draft) => {
                                                    draft.choices.cardinality[rel.id] = value;
                                                })
                                            }
                                            className={cn(
                                                "focus-visible:ring-ring rounded px-2.5 py-1 text-xs focus-visible:ring-2 focus-visible:outline-none",
                                                rel.cardinality === value
                                                    ? "bg-foreground text-background"
                                                    : "text-muted-foreground hover:text-foreground",
                                            )}
                                        >
                                            {value}
                                        </button>
                                    ),
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm">
                    Mark an action followed by a thing to make a line here.
                </p>
            )}
        </>
    );
}
