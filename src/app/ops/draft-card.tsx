"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ConsoleDraft } from "./types";

interface DraftCardProps {
    draft: ConsoleDraft;
    active: boolean;
    onClick: () => void;
}

const STATUS_LABEL: Record<ConsoleDraft["status"], string> = {
    draft: "Draft",
    editing: "Editing",
    ready: "Ready",
    posted: "Posted",
    skipped: "Skipped",
};

const STATUS_VARIANT: Record<
    ConsoleDraft["status"],
    "outline" | "secondary" | "default" | "destructive"
> = {
    draft: "outline",
    editing: "secondary",
    ready: "default",
    posted: "outline",
    skipped: "destructive",
};

/**
 * A queue card for a single draft — shows platform, status, score, and preview.
 */
export function DraftCard({ draft, active, onClick }: DraftCardProps) {
    const preview = (draft.editedBody ?? draft.body).slice(0, 140);
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "border-border bg-card w-full rounded-lg border text-left transition",
                active && "ring-ring ring-2",
            )}
        >
            <Card className="gap-2 border-0 py-4">
                <div className="flex items-center justify-between px-5">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{draft.platform}</Badge>
                        {draft.targetPerson ? (
                            <span className="text-sm font-medium">{draft.targetPerson}</span>
                        ) : (
                            <span className="text-sm font-medium">LinkedIn Post</span>
                        )}
                    </div>
                    <Badge variant={STATUS_VARIANT[draft.status]}>
                        {STATUS_LABEL[draft.status]}
                    </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 px-5 text-sm">{preview}</p>
                {draft.score !== undefined && (
                    <div className="px-5">
                        <Badge variant={draft.score >= 45 ? "default" : "secondary"}>
                            Score {draft.score}
                        </Badge>
                    </div>
                )}
            </Card>
        </button>
    );
}
