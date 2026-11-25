"use client";

import { X } from "lucide-react";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/story-to-screens/engine";

type Props = {
    guess: string[];
    change: (apply: (draft: Product) => void) => void;
};

/** The prompt, before the visitor has looked at the screen list. */
export function GuessCard({ guess, change }: Props) {
    const [open, setOpen] = useState(guess.length === 0);
    const [text, setText] = useState("");

    const add = (): void => {
        const trimmed = text.trim();
        if (!trimmed || guess.includes(trimmed) || guess.length >= 40) return;
        change((draft) => {
            draft.choices.guess.push(trimmed);
        });
        setText("");
    };

    if (!open) {
        return (
            <div className="border-border rounded-lg border border-dashed p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">You named {guess.length} screens</p>
                    <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                        Change your guess
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="border-border rounded-lg border border-dashed p-4">
            <h3 className="text-sm font-semibold">
                Before you look: which screens would you build?
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
                Name them now and the page compares your list with the rules&apos;. Optional.
            </p>
            <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    add();
                }}
            >
                <Input
                    value={text}
                    maxLength={60}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="e.g. Applicants list"
                    aria-label="A screen you would build"
                    className="h-8"
                />
                <Button type="submit" variant="outline" size="sm" disabled={!text.trim()}>
                    Add
                </Button>
            </form>
            {guess.length ? (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Your guess">
                    {guess.map((entry) => (
                        <li key={entry}>
                            <Badge variant="secondary" className="gap-1 pr-1">
                                {entry}
                                <button
                                    type="button"
                                    aria-label={`Remove ${entry}`}
                                    className="hover:text-foreground text-muted-foreground rounded-full p-0.5"
                                    onClick={() =>
                                        change((draft) => {
                                            draft.choices.guess = draft.choices.guess.filter(
                                                (candidate) => candidate !== entry,
                                            );
                                            delete draft.choices.guessLinks[entry];
                                        })
                                    }
                                >
                                    <X aria-hidden="true" className="size-3" />
                                </button>
                            </Badge>
                        </li>
                    ))}
                </ul>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                    {guess.length ? "Done" : "Skip"}
                </Button>
                {guess.length ? (
                    <span className="text-muted-foreground text-xs">You named {guess.length}</span>
                ) : null}
            </div>
        </div>
    );
}
