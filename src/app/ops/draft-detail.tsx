"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { ConsoleDraft } from "./types";

interface DraftDetailProps {
    draft: ConsoleDraft;
    onUpdated: (draft: ConsoleDraft) => void;
}

/**
 * The draft detail panel — review body vs editedBody, see editor notes,
 * and approve / edit / reject / send.
 *
 * Edit-vs-approve: if the textarea is changed from the draft, PATCH (edit);
 * if unchanged, POST (approve). Lifted from mcrdse-ops/reply-queue.
 */
export function DraftDetail({ draft, onUpdated }: DraftDetailProps) {
    const [text, setText] = useState(draft.editedBody ?? draft.body);
    const [note, setNote] = useState("");
    const [rejecting, setRejecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const original = draft.editedBody ?? draft.body;
    const changed = text !== original;
    const isEditing = draft.status === "editing";
    const isReady = draft.status === "ready";
    const terminal = draft.status === "posted" || draft.status === "skipped";

    async function api<T>(path: string, init?: RequestInit): Promise<T | { error: string }> {
        const res = await fetch(path, {
            ...init,
            headers: { "Content-Type": "application/json" },
        });
        const body = (await res.json()) as T | { error: string };
        if (!res.ok) return body as { error: string };
        return body;
    }

    async function handleApprove() {
        setError(null);
        setBusy(true);
        const result = await api<{ draft: ConsoleDraft }>(`/api/ops/drafts/${draft._id}`, {
            method: "POST",
            body: JSON.stringify({}),
        });
        setBusy(false);

        if ("error" in result) {
            setError(result.error);
            return;
        }
        onUpdated(result.draft);
    }

    async function handleEdit() {
        setError(null);
        setBusy(true);
        const result = await api<{ draft: ConsoleDraft }>(`/api/ops/drafts/${draft._id}`, {
            method: "PATCH",
            // Write to editedBody so the edited version is what the UI reads
            // back (editedBody ?? body). Writing to body left stale editedBody
            // winning on refresh, making edits appear lost.
            body: JSON.stringify({ editedBody: text }),
        });
        setBusy(false);
        if ("error" in result) {
            setError(result.error);
            return;
        }
        onUpdated(result.draft);
    }

    async function handleReject() {
        setError(null);
        setBusy(true);
        const result = await api<{ draft: ConsoleDraft }>(`/api/ops/drafts/${draft._id}/reject`, {
            method: "POST",
            body: JSON.stringify({ note }),
        });
        setBusy(false);
        if ("error" in result) {
            setError(result.error);
            return;
        }
        onUpdated(result.draft);
    }

    async function handleSend() {
        setError(null);
        setBusy(true);
        const result = await api<{ draft: ConsoleDraft }>(`/api/ops/drafts/${draft._id}/send`, {
            method: "POST",
        });
        setBusy(false);
        if ("error" in result) {
            setError(result.error);
            return;
        }
        onUpdated(result.draft);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{draft.targetPerson ?? "LinkedIn Post"}</CardTitle>
                <p className="text-muted-foreground text-xs">
                    {draft.platform} · {draft.contentType} · status: {draft.status}
                </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {!isEditing && (
                    <div>
                        <Label>Generated draft</Label>
                        <pre className="bg-muted mt-1 rounded-md border p-3 text-sm whitespace-pre-wrap">
                            {draft.body}
                        </pre>
                    </div>
                )}

                <div>
                    <Label htmlFor="edit-body">
                        {isEditing ? "Editing body" : "Body (edit to review)"}
                    </Label>
                    <Textarea
                        id="edit-body"
                        className="mt-1 min-h-44"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        readOnly={isReady || terminal}
                    />
                </div>

                {draft.editorNotes && (
                    <div>
                        <Label>Editor notes (Halbert)</Label>
                        <p className="bg-muted text-muted-foreground mt-1 rounded border p-3 text-xs">
                            {draft.editorNotes}
                        </p>
                    </div>
                )}

                {error && <p className="text-destructive text-sm">{error}</p>}

                <div className="flex flex-wrap gap-2">
                    {!terminal && !isReady && (
                        <>
                            {changed ? (
                                <Button onClick={handleEdit} disabled={busy}>
                                    {busy ? "Saving…" : "Save edit"}
                                </Button>
                            ) : (
                                <Button onClick={handleApprove} disabled={busy}>
                                    {busy ? "…" : "Approve"}
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => setRejecting((v) => !v)}
                                disabled={busy}
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {isReady && (
                        <Button onClick={handleSend} disabled={busy}>
                            {busy ? "Send…" : "Mark as sent"}
                        </Button>
                    )}
                </div>

                {rejecting && (
                    <div className="flex flex-col gap-2 rounded border p-3">
                        <Label htmlFor="reject-note">Rejection note (required)</Label>
                        <Textarea
                            id="reject-note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Why is this rejected?"
                        />
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={!note.trim() || busy}
                        >
                            {busy ? "Rejecting…" : "Confirm reject"}
                        </Button>
                    </div>
                )}

                {terminal && (
                    <p className="text-muted-foreground text-sm">
                        This draft is {draft.status} — no further actions.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
