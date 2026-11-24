"use client";

import { RotateCcw, Share2 } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Panel } from "@/components/experiments/panel";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { flash } from "@/lib/story-to-screens/dom";
import { derive, splitStory } from "@/lib/story-to-screens/engine";
import type { Finding, Product } from "@/lib/story-to-screens/engine";
import { DEFAULT_PRESET_ID, PRESETS, findPreset, fromPreset } from "@/lib/story-to-screens/presets";
import { clearProduct, loadProduct, saveProduct } from "@/lib/story-to-screens/storage";
import type { InvalidReason } from "@/lib/story-to-screens/url-state";
import {
    MAX_STORIES,
    decodeState,
    encodeState,
    hasSharedState,
} from "@/lib/story-to-screens/url-state";
import { cn } from "@/lib/utils";

import { Findings } from "./findings";
import { MakeItYoursDialog } from "./make-it-yours-dialog";
import { MapPanel } from "./map-panel";
import { ScreenFlow } from "./screen-flow";
import { ScreensPanel } from "./screens-panel";
import { ShareDialog } from "./share-dialog";
import { StoriesPanel } from "./stories-panel";
import { SummaryStrip } from "./summary-strip";

const blankProduct = (): Product => ({
    id: "yours",
    name: "Your product",
    origin: "blank",
    aliases: {},
    stories: [{ id: "st1", roleName: "Person", actor: "", text: "" }],
    choices: {
        corrections: {},
        cardinality: {},
        releases: {},
        manualScreens: [],
        dismissed: [],
        rulesOff: [],
    },
});

const resultTabs = [
    { id: "caught", label: "What it caught" },
    { id: "flow", label: "Flow" },
] as const;

type ResultTab = (typeof resultTabs)[number]["id"];

/** Why a shared link failed, in plain words. */
const LINK_PROBLEMS: Record<InvalidReason, string> = {
    "unknown-example": "there's no example with that name",
    unreadable: "it looks damaged",
    "too-large": "it carries more than this page can open",
    empty: "it has no stories in it",
};

/** Whether a product holds words the visitor wrote, as opposed to an example's. */
const hasOwnWork = (product: Product): boolean =>
    product.origin !== "example" && product.stories.some((story) => story.text.trim().length > 0);

/**
 * Story to Screens. The rules live in `src/lib/story-to-screens`; this component
 * owns the product being edited, keeps the URL in step with examples, and lays out the page.
 */
export function StoryToScreens() {
    const [product, setProduct] = useState<Product>(() => fromPreset(DEFAULT_PRESET_ID));
    const [editing, setEditing] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ResultTab>("caught");
    const [restored, setRestored] = useState(false);
    const [sharedView, setSharedView] = useState(false);
    const [yoursOpen, setYoursOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const [linkProblem, setLinkProblem] = useState<InvalidReason | null>(null);
    const [saveProblem, setSaveProblem] = useState<string | null>(null);
    const [restoredSaved, setRestoredSaved] = useState(false);
    const [confirming, setConfirming] = useState<null | (() => void)>(null);
    const announcedOpen = useRef<number | null>(null);

    const derived = useMemo(() => derive(product), [product]);
    const yours = product.origin !== "example";
    const openFindings = derived.findings.filter((finding) => finding.status === "open").length;

    const change = useCallback((apply: (draft: Product) => void) => {
        setProduct((previous) => {
            const next = structuredClone(previous);
            apply(next);

            return next;
        });
    }, []);

    // Restores a shared link once, after hydration, for the same reason as the
    // RAG Cost Estimator: the page is prerendered with the default example. With no
    // link, it restores whatever this browser saved.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (!hasSharedState(params)) {
            const saved = loadProduct();
            if (saved.status === "ok") {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- see the comment above
                setProduct(saved.product);
                setRestoredSaved(true);
            } else if (saved.status === "invalid") {
                clearProduct();
            }
            setRestored(true);
            return;
        }

        let cancelled = false;
        void decodeState(params).then((shared) => {
            if (cancelled) return;
            if (shared.status === "ok") {
                setProduct(shared.product);
                setSharedView(true);
            } else if (shared.status === "invalid") {
                setLinkProblem(shared.reason);
            }
            setRestored(true);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // Autosaves the visitor's own product, debounced so typing a sentence is one write.
    // An empty product clears the entry instead, so returning to a blank page says nothing.
    useEffect(() => {
        if (!restored || product.origin === "example") return;

        let cancelled = false;
        const timer = window.setTimeout(() => {
            if (cancelled) return;
            if (!hasOwnWork(product)) {
                clearProduct();
                setSaveProblem(null);
                return;
            }
            const result = saveProduct(product);
            setSaveProblem(result.ok ? null : result.reason);
        }, 500);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [restored, product]);

    // Keeps the address bar a link to the example on screen. Products people write
    // themselves stay out of the address bar until they choose to share them.
    useEffect(() => {
        if (!restored) return;

        let cancelled = false;
        const timer = window.setTimeout(() => {
            const write = (query: string): void => {
                if (cancelled) return;
                const { pathname, search } = window.location;
                const next = query ? `${pathname}?${query}` : pathname;
                if (next !== `${pathname}${search}`) window.history.replaceState(null, "", next);
            };

            if (product.origin !== "example") {
                if (!sharedView) write("");
                return;
            }
            void encodeState(product).then((params) =>
                write(
                    product.id === DEFAULT_PRESET_ID &&
                        params.toString() === `ex=${DEFAULT_PRESET_ID}`
                        ? ""
                        : params.toString(),
                ),
            );
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [restored, product, sharedView]);

    // Tells screen readers when the number of open findings changes.
    useEffect(() => {
        if (!restored) return;
        const previous = announcedOpen.current;
        announcedOpen.current = openFindings;
        if (previous === null || previous === openFindings) return;

        const timer = window.setTimeout(
            () => setAnnouncement(`Open findings went from ${previous} to ${openFindings}.`),
            400,
        );

        return () => window.clearTimeout(timer);
    }, [restored, openFindings]);

    /** Asks first when replacing something the visitor wrote, then does the thing. */
    const confirmIfYours = (action: () => void): void => {
        if (hasOwnWork(product)) {
            setConfirming(() => action);
            return;
        }
        action();
    };

    /** Opens the copy-or-blank chooser, asking first when the visitor's own work is at stake. */
    const openYours = (): void => confirmIfYours(() => setYoursOpen(true));

    const pickExample = (id: string): void => {
        if (!findPreset(id)) return;
        confirmIfYours(() => {
            setProduct(fromPreset(id));
            setEditing(null);
            setSharedView(false);
            setRestoredSaved(false);
            setSaveProblem(null);
            announcedOpen.current = null;
        });
    };

    /** Wipes this browser's saved copy and the page's state. */
    const startFresh = (): void => {
        clearProduct();
        setProduct(blankProduct());
        setEditing("st1");
        setSharedView(false);
        setRestoredSaved(false);
        setSaveProblem(null);
        announcedOpen.current = null;
    };

    const reset = (): void =>
        pickExample(product.origin === "example" ? product.id : DEFAULT_PRESET_ID);

    const makeYours = (mode: "copy" | "blank"): void => {
        setYoursOpen(false);
        setSharedView(false);
        announcedOpen.current = null;
        if (mode === "blank") {
            startFresh();
            return;
        }
        change((draft) => {
            draft.id = "yours";
            draft.origin = "copy";
            draft.name = `Your copy of ${draft.name}`;
        });
    };

    const split = (finding: Finding): void => {
        if (product.stories.length >= MAX_STORIES) {
            setAnnouncement(
                `You already have ${MAX_STORIES} stories. Delete one to split this one.`,
            );
            return;
        }
        const next = splitStory(product, finding, `st${Date.now()}`);
        setProduct(next);
        const moved = next.stories.at(-1);
        if (moved) setAnnouncement(`Moved part of the story into a new ${moved.roleName} story.`);
    };

    const showSource = (finding: Finding): void => {
        const source = finding.sources[0];
        if (!source) return;
        flash(source.kind === "relationship" ? `rel-${source.id}` : `story-${source.id}`);
    };

    const preset = product.origin === "example" ? findPreset(product.id) : undefined;
    const mvpCount = derived.screens.filter((screen) => screen.release === "mvp").length;

    return (
        <div className="space-y-6">
            {linkProblem ? (
                <div
                    role="alert"
                    className="border-destructive/40 bg-destructive/5 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                >
                    <p className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                        This link couldn&apos;t be opened ({LINK_PROBLEMS[linkProblem]}).
                        You&apos;re looking at the default example.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setLinkProblem(null);
                            history.replaceState(null, "", window.location.pathname);
                        }}
                    >
                        Dismiss
                    </Button>
                </div>
            ) : null}

            {restoredSaved ? (
                <div
                    role="status"
                    className="border-border bg-muted/40 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                >
                    <p className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                        Restored your stories from this browser.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => confirmIfYours(startFresh)}>
                        Start fresh
                    </Button>
                </div>
            ) : null}

            {saveProblem ? (
                <p role="alert" className="text-destructive text-sm">
                    Couldn&apos;t save in this browser ({saveProblem}). Copy a share link to keep
                    your work.
                </p>
            ) : null}

            {sharedView ? (
                <div
                    role="status"
                    className="border-primary/40 bg-primary/5 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3 text-sm"
                >
                    <p className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
                        <span className="font-medium">Shared view:</span>{" "}
                        {yours ? "someone's product" : product.name} · {product.stories.length}{" "}
                        {product.stories.length === 1 ? "story" : "stories"} · {openFindings} open
                        findings · MVP of {mvpCount} screens.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => confirmIfYours(startFresh)}>
                        Start over
                    </Button>
                    <Button size="sm" onClick={openYours}>
                        Make it yours
                    </Button>
                </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-3">
                <div
                    role="group"
                    aria-label="Example"
                    className="border-border flex flex-wrap rounded-md border p-1"
                >
                    {PRESETS.map((example) => (
                        <button
                            key={example.id}
                            type="button"
                            aria-pressed={!yours && product.id === example.id}
                            onClick={() => pickExample(example.id)}
                            className={cn(
                                "focus-visible:ring-ring rounded px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                !yours && product.id === example.id
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {example.name}
                        </button>
                    ))}
                    {yours ? (
                        <span className="bg-primary text-primary-foreground rounded px-3 py-1.5 text-sm">
                            Yours
                        </span>
                    ) : null}
                </div>
                <Button variant={yours ? "outline" : "default"} size="sm" onClick={openYours}>
                    {yours ? "Start again" : "Make it yours"}
                </Button>
                <p className="text-muted-foreground w-full text-sm">
                    {preset
                        ? preset.question
                        : "Your product. Mark the things and the actions in your stories."}
                </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(20rem,1fr)_minmax(0,1fr)] lg:gap-8">
                <aside aria-label="Stories and screens" className="order-2 space-y-4 lg:order-1">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-signal font-mono text-xs tracking-widest uppercase">
                            Your inputs
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                                <Share2 aria-hidden="true" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" onClick={reset}>
                                <RotateCcw aria-hidden="true" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    <Panel
                        step="01"
                        title="Stories"
                        tag="Click a word to mark it: thing, then action, then nothing. Dashed marks are suggestions."
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <StoriesPanel
                            product={product}
                            marksByStory={derived.marksByStory}
                            editable={yours}
                            editing={editing}
                            onEditing={setEditing}
                            change={change}
                        />
                    </Panel>

                    <Panel
                        step="02"
                        title="System map"
                        tag="The players and things you marked. Each line is an action: set whether it's one or many."
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <MapPanel derived={derived} change={change} />
                    </Panel>

                    <Panel
                        step="03"
                        title="Screens and releases"
                        tag="Every screen the rules found. Pick what ships first."
                        className="lg:grid-cols-1 lg:gap-4"
                    >
                        <ScreensPanel screens={derived.screens} change={change} />
                    </Panel>
                </aside>

                <section
                    aria-labelledby="results-heading"
                    className="order-1 min-w-0 space-y-4 lg:sticky lg:top-24 lg:order-2"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2
                                id="results-heading"
                                className="text-base font-semibold tracking-tight"
                            >
                                Screen list
                            </h2>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {product.stories.length}{" "}
                                {product.stories.length === 1 ? "story" : "stories"} ·{" "}
                                {derived.entities.length} players and things ·{" "}
                                {derived.relationships.length} actions
                            </p>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-2 pt-1 font-mono text-xs tracking-wide uppercase">
                            <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
                            Updates as you click
                        </span>
                    </div>

                    <SummaryStrip
                        derived={derived}
                        manualCount={product.choices.manualScreens.length}
                    />

                    <div
                        role="tablist"
                        aria-label="Results"
                        className="border-border flex gap-1 border-b"
                    >
                        {resultTabs.map((tab, index) => (
                            <button
                                key={tab.id}
                                id={`result-tab-${tab.id}`}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                aria-controls="result-panel"
                                tabIndex={activeTab === tab.id ? 0 : -1}
                                onClick={() => setActiveTab(tab.id)}
                                onKeyDown={(event) => {
                                    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft")
                                        return;
                                    event.preventDefault();
                                    const step = event.key === "ArrowRight" ? 1 : -1;
                                    const next =
                                        resultTabs[
                                            (index + step + resultTabs.length) % resultTabs.length
                                        ];
                                    if (!next) return;
                                    setActiveTab(next.id);
                                    document.getElementById(`result-tab-${next.id}`)?.focus();
                                }}
                                className={cn(
                                    "focus-visible:ring-ring border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                    activeTab === tab.id
                                        ? "border-primary text-foreground font-medium"
                                        : "text-muted-foreground hover:text-foreground border-transparent",
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <section
                        id="result-panel"
                        role="tabpanel"
                        aria-labelledby={`result-tab-${activeTab}`}
                        tabIndex={0}
                        className="focus-visible:ring-ring min-h-72 py-2 outline-none focus-visible:ring-2"
                    >
                        {activeTab === "caught" ? (
                            <Findings
                                derived={derived}
                                canSplit={yours}
                                rulesOff={product.choices.rulesOff}
                                onShowSource={showSource}
                                onSplit={split}
                                onToggleDismissed={(id) =>
                                    change((draft) => {
                                        const dismissed = new Set(draft.choices.dismissed);
                                        if (dismissed.has(id)) dismissed.delete(id);
                                        else dismissed.add(id);
                                        draft.choices.dismissed = [...dismissed];
                                    })
                                }
                                onToggleRule={(id) =>
                                    change((draft) => {
                                        const off = new Set(draft.choices.rulesOff);
                                        if (off.has(id)) off.delete(id);
                                        else off.add(id);
                                        draft.choices.rulesOff = [...off];
                                    })
                                }
                            />
                        ) : (
                            <ScreenFlow derived={derived} onPick={(id) => flash(`screen-${id}`)} />
                        )}
                    </section>
                </section>
            </div>

            <p className="text-muted-foreground border-border border-t pt-5 text-sm leading-relaxed">
                This is a first pass at a screen list, not a spec. The rules catch the common
                misses; a person still decides what ships. Suggested marks come from simple word
                rules, not AI, and nothing you type leaves your browser until you share a link.
            </p>

            <MakeItYoursDialog open={yoursOpen} onOpenChange={setYoursOpen} onChoose={makeYours} />
            <ShareDialog open={shareOpen} onOpenChange={setShareOpen} product={product} />

            <Dialog
                open={confirming !== null}
                onOpenChange={(open) => !open && setConfirming(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Replace your stories?</DialogTitle>
                        <DialogDescription>
                            What you wrote in this browser will be replaced. You can&apos;t undo it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirming(null)}>
                            Keep my work
                        </Button>
                        <Button
                            onClick={() => {
                                const action = confirming;
                                setConfirming(null);
                                action?.();
                            }}
                        >
                            Replace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <p className="sr-only" aria-live="polite">
                {announcement}
            </p>
        </div>
    );
}
