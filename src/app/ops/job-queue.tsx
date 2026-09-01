"use client";

import { useCallback, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Client-safe job posting shape for the ops console. */
export interface ConsoleJob {
    _id: string;
    title: string;
    company?: string;
    level?: string;
    workType?: "on-site" | "hybrid" | "remote";
    location?: string;
    salary?: string;
    url: string;
    status: "discovered" | "saved" | "applied" | "skip" | "expired";
    score: number;
    reasons: string[];
    ageHours?: number;
    discoveredAt?: string;
}

interface JobQueueProps {
    jobs: ConsoleJob[];
}

type StatusFilter = "all" | ConsoleJob["status"];

/**
 * Job queue — the job scout triage surface.
 *
 * Lists scored LinkedIn jobs from the daily scout, filterable by status.
 * Save / skip / expire actions hit the /api/ops/jobs routes. This never
 * applies to anything — application drafts flow through the socialDraft
 * queue.
 */
export function JobQueue({ jobs }: JobQueueProps) {
    const [filter, setFilter] = useState<StatusFilter>("all");
    const [localJobs, setLocalJobs] = useState(jobs);
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filtered = useMemo(
        () => (filter === "all" ? localJobs : localJobs.filter((j) => j.status === filter)),
        [localJobs, filter],
    );

    const statusColor = useCallback(
        (status: ConsoleJob["status"]): "default" | "secondary" | "destructive" | "outline" => {
            switch (status) {
                case "discovered":
                    return "secondary";
                case "saved":
                    return "default";
                case "applied":
                    return "outline";
                case "skip":
                case "expired":
                    return "destructive";
                default:
                    return "secondary";
            }
        },
        [],
    );

    async function transition(id: string, to: ConsoleJob["status"]) {
        setBusy(id);
        setError(null);
        try {
            const res = await fetch(`/api/ops/jobs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: to }),
            });
            if (!res.ok) {
                const body = (await res.json()) as { error?: string };
                throw new Error(body.error ?? "Failed to update job");
            }
            const data = (await res.json()) as { job: ConsoleJob };
            setLocalJobs((prev) => prev.map((j) => (j._id === id ? data.job : j)));
        } catch (e) {
            setError(e instanceof Error ? e.message : "Update failed");
        } finally {
            setBusy(null);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Badge
                    variant={filter === "all" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setFilter("all")}
                >
                    All ({localJobs.length})
                </Badge>
                {(["discovered", "saved", "applied"] as const).map((s) => (
                    <Badge
                        key={s}
                        variant={filter === s ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => setFilter(s)}
                    >
                        {s} ({localJobs.filter((j) => j.status === s).length})
                    </Badge>
                ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                    No job postings yet — the daily job scout populates this queue.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {filtered.map((job) => (
                        <div
                            key={job._id}
                            className="flex flex-col gap-2 rounded-lg border p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <a
                                        href={job.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium underline-offset-2 hover:underline"
                                    >
                                        {job.title}
                                    </a>
                                    <div className="text-sm text-muted-foreground">
                                        {job.company ?? "Unknown company"}
                                        {job.location ? ` · ${job.location}` : ""}
                                        {job.workType ? ` · ${job.workType}` : ""}
                                    </div>
                                    {job.salary && (
                                        <div className="text-sm text-muted-foreground">
                                            {job.salary}
                                        </div>
                                    )}
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Badge variant={statusColor(job.status)}>{job.status}</Badge>
                                    <Badge variant="outline">fit {job.score}</Badge>
                                </div>
                            </div>

                            {job.reasons.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {job.reasons.map((r) => (
                                        <Badge key={r} variant="outline" className="text-xs">
                                            {r}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {job.status === "discovered" && (
                                    <Button
                                        size="sm"
                                        disabled={busy === job._id}
                                        onClick={() => transition(job._id, "saved")}
                                    >
                                        Save
                                    </Button>
                                )}
                                {job.status !== "skip" && job.status !== "expired" && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            disabled={busy === job._id}
                                            onClick={() => transition(job._id, "skip")}
                                        >
                                            Skip
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled={busy === job._id}
                                            onClick={() => transition(job._id, "expired")}
                                        >
                                            Expire
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}