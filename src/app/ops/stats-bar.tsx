"use client";

import { Card } from "@/components/ui/card";

import type { ConsoleDraft } from "./types";

interface StatsBarProps {
    drafts: ConsoleDraft[];
}

/**
 * Queue stats — counts by status and source type, for a quick glance.
 */
export function StatsBar({ drafts }: StatsBarProps) {
    const actionable = drafts.filter((d) => d.status !== "posted" && d.status !== "skipped").length;
    const ready = drafts.filter((d) => d.status === "ready").length;
    const posts = drafts.filter((d) => d.sourceType === "weeklyDigest").length;
    const comments = drafts.filter((d) => d.sourceType === "comment").length;

    const stats = [
        { label: "Actionable", value: actionable },
        { label: "Ready to send", value: ready },
        { label: "Posts", value: posts },
        { label: "Comments", value: comments },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
                <Card key={s.label} className="gap-1 py-4">
                    <div className="px-5">
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-muted-foreground text-xs">{s.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
}
