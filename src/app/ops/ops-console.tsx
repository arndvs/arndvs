"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { DraftCard } from "./draft-card";
import { DraftDetail } from "./draft-detail";
import { JobQueue, type ConsoleJob } from "./job-queue";
import { StatsBar } from "./stats-bar";
import type { ConsoleDraft } from "./types";

interface OpsConsoleProps {
    drafts: ConsoleDraft[];
    jobs: ConsoleJob[];
}

type Tab = "posts" | "comments" | "jobs";

/**
 * The ops console — a triage surface for LinkedIn drafts.
 *
 * Posts (System A) and comments (System B) are listed in a queue, scored,
 * and can be approved/edited/rejected/sent. Client component: all actions
 * hit the /api/ops routes and optimistically update.
 */
export function OpsConsole({ drafts, jobs }: OpsConsoleProps) {
    const [tab, setTab] = useState<Tab>("posts");
    const [activeId, setActiveId] = useState<string | null>(null);
    const [localDrafts, setLocalDrafts] = useState(drafts);

    const activeDraft = useMemo(
        () => (tab === "posts" ? (localDrafts.find((d) => d._id === activeId) ?? null) : null),
        [localDrafts, activeId, tab],
    );

    const posts = localDrafts.filter((d) => d.sourceType === "weeklyDigest");
    const comments = localDrafts.filter((d) => d.sourceType === "comment");

    function handleUpdated(updated: ConsoleDraft) {
        setLocalDrafts((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
        // If the draft moved to a terminal state, drop it from the queue.
        if (updated.status === "posted" || updated.status === "skipped") {
            setLocalDrafts((prev) => prev.filter((d) => d._id !== updated._id));
            if (activeId === updated._id) setActiveId(null);
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Ops Console</h1>
                    <p className="text-muted-foreground text-sm">
                        LinkedIn awareness engine — review, edit, and ship drafts.
                    </p>
                </div>
                <Badge variant="outline">Local</Badge>
            </div>

            <StatsBar drafts={localDrafts} />

            <div className="flex gap-2 border-b pb-3">
                <Button
                    variant={tab === "posts" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        setTab("posts");
                        setActiveId(null);
                    }}
                >
                    Posts ({posts.length})
                </Button>
                <Button
                    variant={tab === "comments" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        setTab("comments");
                        setActiveId(null);
                    }}
                >
                    Comments ({comments.length})
                </Button>
                <Button
                    variant={tab === "jobs" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        setTab("jobs");
                        setActiveId(null);
                    }}
                >
                    Jobs ({jobs.length})
                </Button>
            </div>

            {tab === "posts" ? (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <div className="flex flex-col gap-4">
                        {posts.length === 0 ? (
                            <EmptyState kind="posts" />
                        ) : (
                            posts.map((d) => (
                                <DraftCard
                                    key={d._id}
                                    draft={d}
                                    active={d._id === activeId}
                                    onClick={() => setActiveId(d._id)}
                                />
                            ))
                        )}
                    </div>
                    <div>
                        {activeDraft ? (
                            <DraftDetail draft={activeDraft} onUpdated={handleUpdated} />
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Select a post draft to review it.
                            </p>
                        )}
                    </div>
                </div>
            ) : tab === "jobs" ? (
                <JobQueue jobs={jobs} />
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.length === 0 ? (
                        <EmptyState kind="comments" />
                    ) : (
                        comments.map((d) => (
                            <DraftCard key={d._id} draft={d} active={false} onClick={() => {}} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function EmptyState({ kind }: { kind: "posts" | "comments" }) {
    return (
        <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            {kind === "posts" ? (
                <>No post drafts yet. The weekly content-ship cron will add them.</>
            ) : (
                <>No comment drafts yet. The comment scout will find conversations to review.</>
            )}
        </div>
    );
}
