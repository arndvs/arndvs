/**
 * Job scout CLI (research-only).
 *
 * Discovers LinkedIn job postings via the local linkedin-mcp-server daemon
 * (streamable-http), scores them for role fit, and persists review-
 * qualifying jobs as Sanity `jobPosting` docs.
 *
 * NEVER applies. The human reviews the queue in the ops console and
 * applies manually.
 *
 * Run: pnpm job:scout [--dry-run]
 * Requires: linkedin-mcp-server daemon running on http://127.0.0.1:8899/mcp
 *           (start once: TRANSPORT=streamable-http mcp-server-linkedin --daemon --port 8899)
 */
import { config as loadDotenv } from "dotenv";

import { JOB_COMPANY_TIERS, JOB_ROLE_PROFILE, JOB_SEARCH_TARGETS } from "@/lib/engine/job-profile";
import { runJobScout } from "@/lib/engine/job-scout";
import { createSanityJobPostingStore } from "@/lib/engine/job-store";
import { createLinkedInJobsClient } from "@/lib/engine/linkedin-jobs-client";

// override: true so .env.local wins over any OS/process env — on the
// always-on OptiPlex, Task Scheduler may inject env vars that would
// otherwise silently shadow the repo's .env.local.
loadDotenv({ path: ".env.local", override: true });

const DRY_RUN = process.argv.includes("--dry-run");

// Kill switch — mirrors MCRDSE research-only default.
const ENABLED = process.env.JOB_SCOUT_ENABLED === "true";
const MCP_BASE_URL = process.env.LINKEDIN_MCP_URL ?? "http://127.0.0.1:8899/mcp";

async function main() {
    if (!ENABLED) {
        console.log("[SILENT] JOB_SCOUT_ENABLED != true — exiting.");
        return;
    }

    const client = createLinkedInJobsClient({ baseUrl: MCP_BASE_URL });
    const store = createSanityJobPostingStore();

    const result = await runJobScout(
        client,
        async (key) => (await store.findByDedupeKey(key)) !== null,
        async (scored) => store.upsert(scored),
        {
            scoring: {
                profile: JOB_ROLE_PROFILE,
                companyTiers: JOB_COMPANY_TIERS,
            },
            targets: JOB_SEARCH_TARGETS,
            maxPersist: 15,
        },
    );

    const reviewable = result.scored.filter(
        (s) => s.decision === "review" || s.decision === "needs-verification",
    );

    console.log(
        `Discovered ${result.candidates.length} candidates across ${JOB_SEARCH_TARGETS.length} targets.`,
    );
    console.log(
        `Reviewable: ${reviewable.length}. Persisted: ${result.persisted}. Deduped: ${result.deduped}.`,
    );

    if (DRY_RUN) {
        for (const s of reviewable.slice(0, 10)) {
            console.log(`\n[${s.score}] ${s.candidate.title} — ${s.candidate.company ?? "?"}`);
            console.log(
                `  ${s.candidate.location ?? "?"} · ${s.candidate.workType ?? "?"} · ${s.candidate.ageHours !== undefined ? `${s.candidate.ageHours}h` : "age?"}`,
            );
            console.log(`  ${s.reasons.join(" | ")}`);
        }
        console.log(
            `\n[dry-run] would persist ${reviewable.length} job postings. Nothing was stored.`,
        );
        return;
    }

    console.log(
        `Persisted ${result.persisted} job postings (status: discovered). Nothing was applied.`,
    );
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
