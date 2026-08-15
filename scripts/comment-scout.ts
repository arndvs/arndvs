/**
 * System B — comment scout CLI (research-only).
 *
 * Discovers LinkedIn conversations via the local linkedin-mcp-server,
 * scores them with the litmus test, drafts comments for review-qualifying
 * posts, and persists them as socialDraft docs (sourceType: comment).
 *
 * NEVER posts. The human reviews the queue and posts manually.
 *
 * Run: pnpm comment:scout [--dry-run]
 * Requires: local linkedin-mcp-server + logged-in browser session.
 */
import { config as loadDotenv } from "dotenv";

import { draftComment } from "@/lib/engine/comment-drafter";
import { runScout } from "@/lib/engine/comment-scout";
import { createLinkedInClient } from "@/lib/engine/linkedin-client";
import { createSanitySocialDraftStore } from "@/lib/engine/sanity";

loadDotenv({ path: ".env.local" });

const DRY_RUN = process.argv.includes("--dry-run");

// Kill switch — mirrors MCRDSE research-only default.
const ENABLED = process.env.COMMENT_SCOUT_ENABLED === "true";

const PILLARS = [
    "forward deployed ai",
    "vector search",
    "ai architecture",
    "multi-model orchestration",
];

const TARGET_KEYWORDS = [
    "forward deployed engineer",
    "applied ai engineer",
    "ai agents",
    "vector database",
    "creative automation",
];

async function main() {
    if (!ENABLED) {
        console.log("[SILENT] COMMENT_SCOUT_ENABLED != true — exiting.");
        return;
    }

    const client = createLinkedInClient();
    const result = await runScout(
        client,
        {
            scoring: { pillars: PILLARS },
            targets: TARGET_KEYWORDS.map((keyword) => ({ keyword })),
            datePosted: "past-24h",
        },
        draftComment,
    );

    const reviewable = result.scored.filter(
        (s) => s.decision === "review" || s.decision === "needs-verification",
    );

    console.log(`Discovered ${result.candidates.length} conversations.`);
    console.log(`Reviewable: ${reviewable.length}.`);

    if (DRY_RUN) {
        for (const s of reviewable.slice(0, 10)) {
            console.log(`\n[${s.score}] ${s.candidate.author} — ${s.candidate.url}`);
            console.log(`  ${s.candidate.text.slice(0, 120)}`);
            console.log(`  Draft: ${result.drafts[s.candidate.url] ?? "(none)"}`);
        }
        console.log(`\n[dry-run] would persist ${reviewable.length} comment drafts.`);
        return;
    }

    const store = createSanitySocialDraftStore();
    let created = 0;
    for (const s of reviewable) {
        const draft = result.drafts[s.candidate.url];
        if (!draft) continue;
        await store.create({
            platform: "linkedin",
            contentType: "post",
            body: draft,
            sourceType: "comment",
            targetPerson: s.candidate.author,
            score: s.score,
        });
        created++;
    }
    console.log(`Persisted ${created} comment drafts (status: draft). Nothing was posted.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
