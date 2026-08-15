/**
 * Generates a LinkedIn post draft from the latest weekly digest.
 *
 * Reads the most recent weeklyDigest from Sanity, runs it through the
 * SocialDrafter (Warm Builder writeprint) + Halbert editor, then stores a
 * socialDraft doc (status: draft) via the DAO store.
 *
 * Idempotent: skips if a socialDraft already exists for that digest.
 * Run: pnpm linkedin:draft
 */
import { createClient } from "@sanity/client";
import { config as loadDotenv } from "dotenv";

import { halbertEdit } from "@/lib/engine/halbert-editor";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";
import { generateLinkedInDraft } from "@/lib/engine/social-drafter";
import { apiVersion, dataset, projectId } from "@/sanity/env";

loadDotenv({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");

// ── Sanity read client (for the weekly digest) ──────────────────

const readClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
});

interface WeeklyDigest {
    _id: string;
    weekLabel?: string;
    title?: string;
    summary?: string;
    excerpt?: string;
    highlights?: string[];
}

async function getLatestDigest(): Promise<WeeklyDigest | null> {
    return readClient.fetch<WeeklyDigest | null>(
        `*[_type == "weeklyDigest"] | order(weekOf desc)[0] {
            _id,
            weekLabel,
            title,
            summary,
            excerpt,
            highlights
        }`,
    );
}

async function draftExistsForDigest(digestId: string): Promise<boolean> {
    const existing = await readClient.fetch<Array<{ _id: string }>>(
        `*[_type == "socialDraft" && sourceDigestId == $digestId][0..0] { _id }`,
        { digestId },
    );
    return existing.length > 0;
}

async function main() {
    const store = createSanitySocialDraftStore();

    const digest = await getLatestDigest();
    if (!digest) {
        console.log("No weekly digest found — nothing to draft.");
        return;
    }

    if (await draftExistsForDigest(digest._id)) {
        console.log(`Draft already exists for digest ${digest._id} — skipping (idempotent).`);
        return;
    }

    const highlights = digest.highlights?.length
        ? digest.highlights
        : [digest.summary ?? "", digest.excerpt ?? ""].filter(Boolean);

    const digestInput = {
        weekLabel: digest.weekLabel ?? digest.title ?? "Last week",
        summary: digest.summary ?? digest.excerpt ?? "Shipped a batch of engineering work.",
        highlights,
    };

    console.log(`Drafting LinkedIn post for digest ${digest._id}...`);
    const { body } = await generateLinkedInDraft(digestInput);

    console.log("Running Halbert editor pass...");
    const { editedBody, editorNotes } = await halbertEdit(body);

    if (DRY_RUN) {
        console.log("\n=== RAW DRAFT ===\n" + body + "\n");
        console.log("=== EDITED DRAFT ===\n" + editedBody + "\n");
        console.log("=== EDITOR NOTES ===\n" + editorNotes + "\n");
        console.log(`[dry-run] would create socialDraft for digest ${digest._id}`);
        return;
    }

    const record = await store.create({
        platform: "linkedin",
        contentType: "post",
        body,
        sourceType: "weeklyDigest",
        sourceDigestId: digest._id,
    });

    // Store the edited body/notes on the draft for the ops console triage.
    await readClient.patch(record._id).set({ editedBody, editorNotes }).commit();

    console.log(`Created socialDraft ${record._id} (status: draft).`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
