/** Client-safe social draft shape for the ops console. */
export interface ConsoleDraft {
    _id: string;
    platform: "linkedin" | "twitter";
    contentType: "post" | "thread" | "tweet";
    body: string;
    editedBody?: string;
    editorNotes?: string;
    status: "draft" | "editing" | "ready" | "posted" | "skipped";
    sourceType: "weeklyDigest" | "comment";
    sourceDigestId?: string;
    targetPerson?: string;
    score?: number;
    generatedAt?: string;
    postedAt?: string;
}
