"use client";

import { Button } from "@/components/ui/button";
import type { Product, Screen } from "@/lib/story-to-screens/engine";
import type { GuessMatch } from "@/lib/story-to-screens/guess";

type Props = {
    match: GuessMatch;
    screens: Screen[];
    /** Guesses the visitor linked to a screen by hand. */
    links: Record<string, string>;
    change: (apply: (draft: Product) => void) => void;
};

const selectClass =
    "border-input dark:bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-7 cursor-pointer rounded border bg-transparent px-1 text-xs shadow-xs outline-none focus-visible:ring-[3px]";

/** How the visitor's guess did against the rules' list. */
export function GuessCompare({ match, screens, links, change }: Props) {
    const named = match.matched.length + match.onlyYours.length;
    const addable = screens.filter((screen) => !screen.judgment);

    return (
        <div className="border-border bg-muted/40 rounded-lg border p-4">
            <p className="text-sm">
                Rules matched <strong>{match.matched.length}</strong> of your {named}. They added{" "}
                <strong>{match.missedByYou.length}</strong> you didn&apos;t name.{" "}
                <strong>{match.onlyYours.length}</strong> of yours aren&apos;t in the list.
            </p>
            {match.onlyYours.length ? (
                <ul className="mt-3 space-y-2">
                    {match.onlyYours.map((entry) => (
                        <li
                            key={entry}
                            className="flex flex-wrap items-center justify-between gap-2 text-sm"
                        >
                            <span className="min-w-0">{entry}</span>
                            <span className="flex shrink-0 flex-wrap items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() =>
                                        change((draft) => {
                                            draft.choices.manualScreens.push({
                                                id: `manual-${Date.now()}`,
                                                name: entry,
                                            });
                                            delete draft.choices.guessLinks[entry];
                                        })
                                    }
                                >
                                    Add as a screen
                                </Button>
                                <select
                                    aria-label={`Link ${entry} to a screen`}
                                    className={selectClass}
                                    value={links[entry] ?? ""}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        change((draft) => {
                                            if (value) draft.choices.guessLinks[entry] = value;
                                            else delete draft.choices.guessLinks[entry];
                                        });
                                    }}
                                >
                                    <option value="">Link to…</option>
                                    {addable.map((screen) => (
                                        <option key={screen.id} value={screen.id}>
                                            {screen.name}
                                        </option>
                                    ))}
                                </select>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}
