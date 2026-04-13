/**
 * Generates a weekly changelog digest from git history.
 * Queries Sanity for the last entry date, groups new commits by type,
 * uses OpenAI to synthesize a single polished entry, then publishes to Sanity.
 *
 * Idempotent: derives "since when" from the last Sanity entry — no local state.
 * Run: pnpm changelog:digest
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { execSync } from "node:child_process";
import OpenAI from "openai";

config({ path: ".env.local" });

// ── Sanity client ──────────────────────────────────────────────

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-03-19",
    token: process.env.SANITY_API_TOKEN!,
    useCdn: false,
});

// ── Types ──────────────────────────────────────────────────────

type ChangelogType = "feature" | "improvement" | "fix" | "content" | "infrastructure";

interface Commit {
    hash: string;
    message: string;
    type: ChangelogType | null;
    scope: string | null;
}

interface DigestResult {
    title: string;
    summary: string;
    body: Array<{
        _type: "block";
        style: string;
        children: Array<{ _type: "span"; text: string }>;
    }>;
    type: ChangelogType;
    isHighlight: boolean;
}

// ── Commit prefix → changelog type mapping ─────────────────────

const PREFIX_MAP: Record<string, ChangelogType> = {
    feat: "feature",
    fix: "fix",
    refactor: "infrastructure",
    chore: "infrastructure",
    content: "content",
    docs: "content",
    perf: "improvement",
};

const SKIP_PREFIXES = new Set(["style", "test"]);
const SKIP_PATTERNS = [/^merge /i, /\bwip\b/i, /\btemp\b/i];

// ── Git log parsing ────────────────────────────────────────────

function parseConventionalCommit(
    message: string,
): { prefix: string; scope: string | null; description: string } | null {
    const match = message.match(/^(\w+)(?:\(([^)]*)\))?!?:\s*(.+)/);

    if (!match) return null;

    return {
        prefix: match[1]!.toLowerCase(),
        scope: match[2] ?? null,
        description: match[3]!,
    };
}

function getCommitsSince(sinceDate: string): Commit[] {
    const format = "%H %s";
    const raw = execSync(`git log --since="${sinceDate}" --format="${format}" --no-merges`, {
        encoding: "utf-8",
    }).trim();

    if (!raw) return [];

    return raw.split("\n").map((line) => {
        const hash = line.slice(0, 40);
        const message = line.slice(41);
        const parsed = parseConventionalCommit(message);

        return {
            hash,
            message,
            type: parsed ? (PREFIX_MAP[parsed.prefix] ?? null) : null,
            scope: parsed?.scope ?? null,
        };
    });
}

function filterCommits(commits: Commit[]): Commit[] {
    return commits.filter((c) => {
        if (SKIP_PATTERNS.some((p) => p.test(c.message))) return false;

        const parsed = parseConventionalCommit(c.message);

        if (parsed && SKIP_PREFIXES.has(parsed.prefix)) return false;

        return true;
    });
}

function groupByType(commits: Commit[]): Record<ChangelogType, Commit[]> {
    const groups: Record<ChangelogType, Commit[]> = {
        feature: [],
        improvement: [],
        fix: [],
        content: [],
        infrastructure: [],
    };

    for (const commit of commits) {
        const type = commit.type ?? "infrastructure";

        groups[type].push(commit);
    }

    return groups;
}

function dominantType(groups: Record<ChangelogType, Commit[]>): ChangelogType {
    let max: ChangelogType = "infrastructure";
    let maxCount = 0;

    for (const [type, commits] of Object.entries(groups) as Array<[ChangelogType, Commit[]]>) {
        if (commits.length > maxCount) {
            maxCount = commits.length;
            max = type;
        }
    }

    return max;
}

// ── OpenAI digest generation ───────────────────────────────────

const SYSTEM_PROMPT = `You are a changelog writer for a software engineering portfolio (arndvs.com). Generate a concise, professional changelog digest from a list of git commits grouped by category.

Rules:
- title: Short, descriptive. Format: "Week of [Month Day] — [main highlight]". Max 80 characters.
- summary: 1-2 sentences covering the week's highlights. Max 300 characters.
- body: An array of Sanity Portable Text blocks. Use h3 blocks for category headers (Features, Fixes, Infrastructure, Content) and normal blocks for bullet points. Each bullet starts with "• ". Only include categories that have commits.
- type: The dominant category as a string: "feature", "improvement", "fix", "content", or "infrastructure".
- isHighlight: true if there are any feature commits, false otherwise.

If there are 50+ commits, be concise — highlight the top 5 changes and summarize the rest.

Respond with valid JSON only. No markdown wrapping, no explanation.`;

async function generateDigest(
    groups: Record<ChangelogType, Commit[]>,
    sinceDate: string,
): Promise<DigestResult> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) throw new Error("Missing environment variable: OPENAI_API_KEY");

    const openai = new OpenAI({ apiKey });

    const commitSummary = Object.entries(groups)
        .filter(([, commits]) => commits.length > 0)
        .map(([type, commits]) => {
            const lines = commits.map((c) => `  - ${c.message}`);
            return `${type} (${commits.length}):\n${lines.join("\n")}`;
        })
        .join("\n\n");

    const totalCommits = Object.values(groups).reduce((sum, c) => sum + c.length, 0);
    const weekStart = new Date(sinceDate);
    const weekLabel = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const userPrompt = `Week starting: ${weekLabel}
Total meaningful commits: ${totalCommits}
${totalCommits > 50 ? "\nNOTE: Large batch — be concise, highlight top 5.\n" : ""}
Commits by category:
${commitSummary}

Generate the changelog digest as JSON with keys: title, summary, body (Portable Text blocks), type, isHighlight`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) throw new Error("OpenAI returned empty response");

    const parsed = JSON.parse(content) as Record<string, unknown>;

    if (!parsed.title || !parsed.summary)
        throw new Error(`OpenAI returned incomplete data: ${content}`);

    return {
        title: String(parsed.title),
        summary: String(parsed.summary),
        body: Array.isArray(parsed.body) ? parsed.body : [],
        type:
            (typeof parsed.type === "string" && parsed.type in PREFIX_MAP) ||
            ["feature", "improvement", "fix", "content", "infrastructure"].includes(
                parsed.type as string,
            )
                ? (parsed.type as ChangelogType)
                : dominantType(groups),
        isHighlight: Boolean(parsed.isHighlight),
    };
}

// ── Slug generation ────────────────────────────────────────────

function toSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 96);
}

// ── Main ───────────────────────────────────────────────────────

async function main() {
    console.log("Generating changelog digest...\n");

    // 1. Get last entry date from Sanity
    const lastDate = await client.fetch<string | null>(
        `*[_type == "changelogEntry"] | order(date desc) [0].date`,
    );

    const sinceDate =
        lastDate ??
        execSync("git log --reverse --format=%aI | head -1", { encoding: "utf-8" }).trim();

    console.log(`  Last entry: ${lastDate ?? "(none — using repo start)"}`);
    console.log(`  Fetching commits since: ${sinceDate}\n`);

    // 2. Get and filter commits
    const rawCommits = getCommitsSince(sinceDate);
    const commits = filterCommits(rawCommits);

    console.log(`  Raw commits: ${rawCommits.length}`);
    console.log(`  After filtering: ${commits.length}`);

    if (commits.length === 0) {
        console.log("\n  No meaningful commits since last entry. Exiting.");
        process.exit(0);
    }

    // 3. Group by type
    const groups = groupByType(commits);

    for (const [type, list] of Object.entries(groups)) {
        if (list.length > 0) console.log(`  ${type}: ${list.length}`);
    }

    // 4. Generate digest via OpenAI
    console.log("\n  Generating digest via OpenAI...");
    const digest = await generateDigest(groups, sinceDate);

    console.log(`  Title: ${digest.title}`);
    console.log(`  Type: ${digest.type}`);
    console.log(`  Highlight: ${digest.isHighlight}`);

    // 5. Check for overlapping entry (idempotency)
    const slug = toSlug(digest.title);
    const exists = await client.fetch<string | null>(
        `*[_type == "changelogEntry" && slug.current == $slug][0]._id`,
        { slug },
    );

    if (exists) {
        console.log(`\n  Entry "${slug}" already exists. Skipping.`);
        process.exit(0);
    }

    // 6. Determine commit range
    const firstHash = commits[commits.length - 1]!.hash.slice(0, 7);
    const lastHash = commits[0]!.hash.slice(0, 7);
    const commitRange = firstHash === lastHash ? undefined : `${firstHash}..${lastHash}`;

    // 7. Create Sanity document
    const doc = {
        _type: "changelogEntry" as const,
        _id: `changelog-${slug}`,
        title: digest.title,
        slug: { _type: "slug" as const, current: slug },
        date: new Date().toISOString(),
        type: digest.type,
        summary: digest.summary,
        body: digest.body,
        commitHash: commits[0]!.hash.slice(0, 7),
        commitRange,
        isHighlight: digest.isHighlight,
        source: "automated" as const,
    };

    await client.createOrReplace(doc);

    console.log(`\n  ✅ Published: ${digest.title}`);
    console.log(`  Slug: ${slug}`);
    console.log("  Sanity webhook will handle cache revalidation.");
}

main().catch((err) => {
    console.error("Digest generation failed:", err);
    process.exit(1);
});
