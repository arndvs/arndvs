"use client";

import { X } from "lucide-react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flash } from "@/lib/story-to-screens/dom";
import { RELEASES, inProduct } from "@/lib/story-to-screens/engine";
import type { Judgment, Product, Release, Screen } from "@/lib/story-to-screens/engine";

type Props = {
    screens: Screen[];
    change: (apply: (draft: Product) => void) => void;
};

const RULE_LABEL: Record<Screen["ruleId"], string> = {
    "story-check": "story check",
    signals: "signals",
    stories: "stories",
    defaults: "default",
    crud: "edit rule",
    walk: "walkthrough",
    cardinality: "one or many",
    trace: "trace",
    manual: "by hand",
};

/** Long enough to recognise the sentence, short enough to sit under a screen name. */
const excerpt = (sentence: string): string =>
    sentence.length > 80 ? `${sentence.slice(0, 80).trimEnd()}…` : sentence;

const selectClass =
    "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 h-8 cursor-pointer rounded-md border bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]";

/** The judgment select's value: "screen" for a real screen, else the judgment. */
const judgmentValue = (screen: Screen): string => {
    if (!screen.judgment) return "screen";
    if (screen.judgment.kind === "misfire") return "misfire";

    return `feature:${screen.judgment.of}`;
};

const readJudgment = (value: string): Judgment | null => {
    if (value === "screen") return null;
    if (value === "misfire") return { kind: "misfire" };
    if (value.startsWith("feature:")) return { kind: "feature", of: value.slice(8) };

    return null;
};

/** "misfire", or "feature of Profile" when the parent is still in the list. */
const judgmentLabel = (screen: Screen, screens: Screen[]): string => {
    const judgment = screen.judgment;
    if (!judgment) return "";
    if (judgment.kind === "misfire") return "misfire";

    const parent = screens.find((other) => other.id === judgment.of);

    return `feature of ${parent?.name ?? judgment.of}`;
};

/** Panel 03: every screen the rules found, with the release it ships in. */
export function ScreensPanel({ screens, change }: Props) {
    const [name, setName] = useState("");
    // A screen can only be folded into another screen that is still in the product.
    const parents = screens.filter(inProduct);

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
                                    screen.judgment ? "text-muted-foreground line-through" : ""
                                }
                            >
                                {screen.name}
                            </span>
                            <span className="text-muted-foreground ml-2 font-mono text-[0.65rem] tracking-wide uppercase">
                                {RULE_LABEL[screen.ruleId]}
                            </span>
                            {screen.judgment ? (
                                <span className="text-muted-foreground block text-xs">
                                    {judgmentLabel(screen, screens)}
                                </span>
                            ) : null}
                            {screen.needsEmptyState ? (
                                <span className="text-muted-foreground block text-xs">
                                    Needs an empty state
                                </span>
                            ) : null}
                            {screen.sources[0] ? (
                                <span className="text-muted-foreground mt-0.5 block text-xs">
                                    From: “{excerpt(screen.sources[0].sentence)}”{" "}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-1 py-0 text-xs"
                                        onClick={() => flash(`story-${screen.sources[0]!.storyId}`)}
                                    >
                                        Show where
                                    </Button>
                                </span>
                            ) : null}
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                            <select
                                aria-label={`Release for ${screen.name}`}
                                className={selectClass}
                                value={screen.release}
                                disabled={Boolean(screen.judgment)}
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
                            <select
                                aria-label={`Judgment for ${screen.name}`}
                                className={selectClass}
                                value={judgmentValue(screen)}
                                onChange={(event) => {
                                    const judgment = readJudgment(event.target.value);
                                    change((draft) => {
                                        if (judgment) draft.choices.judgments[screen.id] = judgment;
                                        else delete draft.choices.judgments[screen.id];
                                    });
                                }}
                            >
                                <option value="screen">It&apos;s a screen</option>
                                <option value="misfire">Rule misfire</option>
                                {parents
                                    .filter((parent) => parent.id !== screen.id)
                                    .map((parent) => (
                                        <option key={parent.id} value={`feature:${parent.id}`}>
                                            Feature on {parent.name}
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
