"use client";

import { Plus, Trash2 } from "lucide-react";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Mark, Product } from "@/lib/story-to-screens/engine";
import { clearStoryCorrections } from "@/lib/story-to-screens/engine";
import { tokenize } from "@/lib/story-to-screens/suggest";
import { MAX_STORIES, MAX_STORY_LENGTH } from "@/lib/story-to-screens/url-state";
import { cn } from "@/lib/utils";

type Props = {
    product: Product;
    marksByStory: Record<string, Mark[]>;
    /** Examples can be marked but not rewritten. */
    editable: boolean;
    editing: string | null;
    onEditing: (id: string | null) => void;
    change: (apply: (draft: Product) => void) => void;
};

const wordClass = (mark: Mark | undefined): string =>
    cn(
        "focus-visible:ring-ring cursor-pointer rounded-sm px-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none",
        !mark && "hover:bg-muted",
        mark?.kind === "noun" &&
            "bg-sky-500/15 text-sky-900 dark:text-sky-100 border-b-2 border-sky-600",
        mark?.kind === "verb" &&
            "bg-amber-500/15 text-amber-950 dark:text-amber-100 border-b-2 border-amber-600",
        mark?.status === "suggested" && "border-dashed",
    );

/** Panel 01: the stories, with every word clickable to mark it. */
export function StoriesPanel({
    product,
    marksByStory,
    editable,
    editing,
    onEditing,
    change,
}: Props) {
    const cycle = (storyId: string, start: number, mark: Mark | undefined): void => {
        const next = !mark ? "noun" : mark.kind === "noun" ? "verb" : "none";
        change((draft) => {
            draft.choices.corrections[`${storyId}:${start}`] = next;
        });
    };

    return (
        <>
            <div className="text-muted-foreground flex flex-wrap gap-3 text-xs" aria-hidden="true">
                <span className={wordClass({ kind: "noun", status: "confirmed" } as Mark)}>
                    thing
                </span>
                <span className={wordClass({ kind: "verb", status: "confirmed" } as Mark)}>
                    action
                </span>
                <span className={wordClass({ kind: "noun", status: "suggested" } as Mark)}>
                    suggested
                </span>
            </div>

            {product.stories.map((story) => {
                const marks = new Map(
                    (marksByStory[story.id] ?? []).map((mark) => [mark.start, mark]),
                );
                const isEditing = editable && editing === story.id;
                const parts: ReactNode[] = [];
                let position = 0;
                for (const token of tokenize(story.text)) {
                    parts.push(story.text.slice(position, token.start));
                    const mark = marks.get(token.start);
                    parts.push(
                        <span
                            key={token.start}
                            role="button"
                            tabIndex={0}
                            aria-label={`${token.word}: ${mark ? (mark.kind === "noun" ? "thing" : "action") : "not marked"}`}
                            className={wordClass(mark)}
                            onClick={() => cycle(story.id, token.start, mark)}
                            onKeyDown={(event) => {
                                if (event.key !== "Enter" && event.key !== " ") return;
                                event.preventDefault();
                                cycle(story.id, token.start, mark);
                            }}
                        >
                            {token.word}
                        </span>,
                    );
                    position = token.end;
                }
                parts.push(story.text.slice(position));

                return (
                    <article
                        key={story.id}
                        id={`story-${story.id}`}
                        className="border-border data-[flash=true]:ring-primary space-y-3 rounded-lg border p-4 transition-shadow data-[flash=true]:ring-2"
                    >
                        <header className="flex items-center gap-2">
                            {editable ? (
                                <Input
                                    value={story.roleName}
                                    maxLength={40}
                                    aria-label="Role"
                                    className="h-8 max-w-48 font-medium"
                                    onChange={(event) =>
                                        change((draft) => {
                                            const target = draft.stories.find(
                                                (s) => s.id === story.id,
                                            );
                                            if (target) target.roleName = event.target.value;
                                        })
                                    }
                                />
                            ) : (
                                <p className="text-sm font-medium">{story.roleName}</p>
                            )}
                            {editable ? (
                                <div className="ml-auto flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEditing(isEditing ? null : story.id)}
                                    >
                                        {isEditing ? "Done, mark it" : "Edit text"}
                                    </Button>
                                    {product.stories.length > 1 ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            aria-label={`Delete the ${story.roleName} story`}
                                            onClick={() =>
                                                change((draft) => {
                                                    draft.stories = draft.stories.filter(
                                                        (s) => s.id !== story.id,
                                                    );
                                                    clearStoryCorrections(draft.choices, story.id);
                                                })
                                            }
                                        >
                                            <Trash2 aria-hidden="true" />
                                        </Button>
                                    ) : null}
                                </div>
                            ) : null}
                        </header>

                        {isEditing ? (
                            <div className="space-y-1">
                                <Textarea
                                    autoFocus
                                    value={story.text}
                                    maxLength={MAX_STORY_LENGTH}
                                    rows={6}
                                    aria-label={`${story.roleName} story`}
                                    placeholder="Write what this person does today, in their words. Who they are, what they use, what they check, what slows them down."
                                    onChange={(event) =>
                                        change((draft) => {
                                            const target = draft.stories.find(
                                                (s) => s.id === story.id,
                                            );
                                            if (!target) return;
                                            target.text = event.target.value.slice(
                                                0,
                                                MAX_STORY_LENGTH,
                                            );
                                            delete target.hand;
                                            clearStoryCorrections(draft.choices, story.id);
                                        })
                                    }
                                />
                                <p className="text-muted-foreground text-xs">
                                    {story.text.length} of {MAX_STORY_LENGTH.toLocaleString()}{" "}
                                    characters
                                </p>
                            </div>
                        ) : story.text ? (
                            <p className="text-sm leading-7">{parts}</p>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                This story is empty. Choose Edit text to write it.
                            </p>
                        )}
                    </article>
                );
            })}

            {editable && product.stories.length < MAX_STORIES ? (
                <Button
                    variant="outline"
                    size="sm"
                    className="self-start"
                    onClick={() => {
                        const id = `st${Date.now()}`;
                        change((draft) => {
                            draft.stories.push({
                                id,
                                roleName: "Another role",
                                actor: "",
                                text: "",
                            });
                        });
                        onEditing(id);
                    }}
                >
                    <Plus aria-hidden="true" />
                    Add a story ({product.stories.length} of {MAX_STORIES})
                </Button>
            ) : null}
        </>
    );
}
