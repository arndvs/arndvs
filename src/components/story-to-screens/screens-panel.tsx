"use client";

import { X } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RELEASES } from "@/lib/story-to-screens/engine";
import type { Product, Release, Screen } from "@/lib/story-to-screens/engine";

type Props = {
    screens: Screen[];
    change: (apply: (draft: Product) => void) => void;
};

const RULE_LABEL: Record<Screen["ruleId"], string> = {
    stories: "stories",
    defaults: "default",
    crud: "edit rule",
    walk: "walkthrough",
    cardinality: "one or many",
    manual: "by hand",
};

const selectClass =
    "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-8 cursor-pointer rounded-md border bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]";

/** Panel 03: every screen the rules found, with the release it ships in. */
export function ScreensPanel({ screens, change }: Props) {
    const [name, setName] = useState("");

    return (
        <>
            <ul className="divide-border divide-y">
                {screens.map((screen) => (
                    <li
                        key={screen.id}
                        id={`screen-${screen.id}`}
                        className="data-[flash=true]:ring-primary flex items-center justify-between gap-3 rounded py-2 data-[flash=true]:ring-2"
                    >
                        <span className="min-w-0 text-sm">
                            <span
                                className={
                                    screen.release === "none"
                                        ? "text-muted-foreground line-through"
                                        : ""
                                }
                            >
                                {screen.name}
                            </span>
                            <span className="text-muted-foreground ml-2 font-mono text-[0.65rem] tracking-wide uppercase">
                                {RULE_LABEL[screen.ruleId]}
                            </span>
                            {screen.needsEmptyState ? (
                                <span className="text-muted-foreground block text-xs">
                                    Needs an empty state
                                </span>
                            ) : null}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                            <select
                                aria-label={`Release for ${screen.name}`}
                                className={selectClass}
                                value={screen.release}
                                onChange={(event) =>
                                    change((draft) => {
                                        draft.choices.releases[screen.id] = event.target
                                            .value as Release;
                                    })
                                }
                            >
                                {RELEASES.map((release) => (
                                    <option key={release.id} value={release.id}>
                                        {release.label}
                                    </option>
                                ))}
                            </select>
                            {screen.ruleId === "manual" ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Delete ${screen.name}`}
                                    onClick={() =>
                                        change((draft) => {
                                            draft.choices.manualScreens =
                                                draft.choices.manualScreens.filter(
                                                    (manual) => manual.id !== screen.id,
                                                );
                                        })
                                    }
                                >
                                    <X aria-hidden="true" />
                                </Button>
                            ) : null}
                        </span>
                    </li>
                ))}
            </ul>

            <form
                className="flex gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    const trimmed = name.trim();
                    if (!trimmed) return;
                    change((draft) => {
                        draft.choices.manualScreens.push({
                            id: `manual-${Date.now()}`,
                            name: trimmed,
                        });
                    });
                    setName("");
                }}
            >
                <Input
                    value={name}
                    maxLength={60}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Add a screen by hand"
                    aria-label="Screen name"
                    className="h-8"
                />
                <Button type="submit" variant="outline" size="sm">
                    Add
                </Button>
            </form>
        </>
    );
}
