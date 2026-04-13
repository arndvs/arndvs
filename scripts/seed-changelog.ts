/**
 * Seed script — creates 18 backfill changelog entries from git history.
 * Idempotent: skips entries whose slug already exists.
 * Run: pnpm seed:changelog
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2025-03-19",
    token: process.env.SANITY_API_TOKEN!,
    useCdn: false,
});

type EntryType = "feature" | "improvement" | "fix" | "content" | "infrastructure";

interface SeedEntry {
    title: string;
    slug: string;
    date: string;
    type: EntryType;
    summary: string;
    relatedProject?: "alignsd" | "ctrl" | "ripemetrics" | "arndvs";
    commitHash?: string;
    commitRange?: string;
    isHighlight: boolean;
}

const entries: SeedEntry[] = [
    {
        title: "Site foundation — Next.js, Tailwind, initial deploy",
        slug: "site-foundation-nextjs-tailwind",
        date: "2025-01-15T00:00:00Z",
        type: "infrastructure",
        summary:
            "Scaffolded the arndvs.com portfolio with Next.js, Tailwind CSS, and Vercel deployment. Established the project structure, theme system, and base layout.",
        relatedProject: "arndvs",
        commitRange: "15c1a8c..8885d7b",
        isHighlight: false,
    },
    {
        title: "Portfolio case study pages",
        slug: "portfolio-case-study-pages",
        date: "2025-01-20T00:00:00Z",
        type: "feature",
        summary:
            "Added dedicated case study pages with project details, tech stacks, and outcome metrics.",
        relatedProject: "arndvs",
        commitHash: "5793bcd",
        isHighlight: true,
    },
    {
        title: "Glitch-text logo animation",
        slug: "glitch-text-logo-animation",
        date: "2025-01-22T00:00:00Z",
        type: "feature",
        summary:
            "Built a custom glitch-text animation for the site logo using CSS keyframes and randomized character swaps.",
        relatedProject: "arndvs",
        commitHash: "a11965a",
        isHighlight: false,
    },
    {
        title: "AlignSD Family Chiropractic case study",
        slug: "alignsd-case-study",
        date: "2025-02-01T00:00:00Z",
        type: "content",
        summary:
            "Published the AlignSD case study covering the full-stack healthcare platform build — 44k lines of code, 18 Sanity schema types, and 158 pages.",
        relatedProject: "alignsd",
        commitRange: "ca36ff8..267a8d7",
        isHighlight: true,
    },
    {
        title: "Contact form with email delivery via Resend",
        slug: "contact-form-resend",
        date: "2025-02-05T00:00:00Z",
        type: "feature",
        summary:
            "Implemented a contact form with server-side validation, honeypot spam protection, rate limiting, and email delivery through Resend.",
        relatedProject: "arndvs",
        commitRange: "0245d82..d78ab55",
        isHighlight: false,
    },
    {
        title: "SEO hardening — JSON-LD, sitemap, robots.txt",
        slug: "seo-hardening-jsonld-sitemap",
        date: "2025-02-10T00:00:00Z",
        type: "feature",
        summary:
            "Added structured data (JSON-LD) for Person, WebSite, and CollectionPage schemas. Generated dynamic sitemap and robots.txt.",
        relatedProject: "arndvs",
        commitRange: "378e73b..9364b57",
        isHighlight: true,
    },
    {
        title: "Dark mode with system-aware toggle",
        slug: "dark-mode-system-toggle",
        date: "2025-02-15T00:00:00Z",
        type: "feature",
        summary:
            "Implemented dark mode with next-themes, supporting system preference detection and a manual toggle that persists across sessions.",
        relatedProject: "arndvs",
        commitRange: "6561b40..2db1c60",
        isHighlight: false,
    },
    {
        title: "Mobile navigation with slide-out drawer",
        slug: "mobile-navigation-drawer",
        date: "2025-02-20T00:00:00Z",
        type: "feature",
        summary:
            "Built a responsive mobile navigation with an animated slide-out drawer using Radix Dialog and Framer Motion.",
        relatedProject: "arndvs",
        commitHash: "f9432e6",
        isHighlight: false,
    },
    {
        title: "RipeMetrics AI platform case study",
        slug: "ripemetrics-case-study",
        date: "2025-03-01T00:00:00Z",
        type: "content",
        summary:
            "Published the RipeMetrics case study detailing the AI-powered analytics platform build with real-time data pipelines and predictive modeling.",
        relatedProject: "ripemetrics",
        commitRange: "7a53ce6..fe430d9",
        isHighlight: true,
    },
    {
        title: "Ctrl Energy Drink case study",
        slug: "ctrl-energy-drink-case-study",
        date: "2025-03-10T00:00:00Z",
        type: "feature",
        summary:
            "Added the Ctrl Energy Drink case study showcasing the brand website build with dynamic product pages and e-commerce integration.",
        relatedProject: "ctrl",
        commitRange: "8bf44fa..754a931",
        isHighlight: true,
    },
    {
        title: "Accessibility — ARIA labels, reduced motion",
        slug: "accessibility-aria-reduced-motion",
        date: "2025-03-15T00:00:00Z",
        type: "improvement",
        summary:
            "Swept the entire site for accessibility: added ARIA labels to interactive elements, implemented prefers-reduced-motion support, and improved keyboard navigation.",
        relatedProject: "arndvs",
        commitRange: "238765f..713497c",
        isHighlight: false,
    },
    {
        title: "Case study architecture — shared types + section factory",
        slug: "case-study-architecture",
        date: "2025-03-20T00:00:00Z",
        type: "infrastructure",
        summary:
            "Refactored case study pages to use shared TypeScript types and a section factory pattern, eliminating duplication across project pages.",
        relatedProject: "arndvs",
        commitRange: "2dbc019..8c46f62",
        isHighlight: false,
    },
    {
        title: "Codebase audit — 34 unused deps purged",
        slug: "codebase-audit-dep-purge",
        date: "2025-04-01T00:00:00Z",
        type: "infrastructure",
        summary:
            "Ran a full codebase audit: removed 34 unused dependencies, cleaned up dead imports, and consolidated utility functions.",
        relatedProject: "arndvs",
        commitRange: "276cbe7..c62af33",
        isHighlight: false,
    },
    {
        title: "Homepage and About page rewrite",
        slug: "homepage-about-rewrite",
        date: "2025-04-05T00:00:00Z",
        type: "content",
        summary:
            "Rewrote homepage hero copy and About page to better communicate technical expertise and project outcomes.",
        relatedProject: "arndvs",
        commitRange: "6e9fbe1..23bec71",
        isHighlight: false,
    },
    {
        title: "Sanity CMS integration",
        slug: "sanity-cms-integration",
        date: "2025-05-01T00:00:00Z",
        type: "feature",
        summary:
            "Integrated Sanity as the content management system with embedded Studio, real-time preview via Presentation tool, and typed GROQ queries.",
        relatedProject: "arndvs",
        commitRange: "6a585a8..c059ece",
        isHighlight: true,
    },
    {
        title: "Blog system with Portable Text rendering",
        slug: "blog-portable-text",
        date: "2025-05-10T00:00:00Z",
        type: "feature",
        summary:
            "Launched the blog with Sanity-powered Portable Text rendering, syntax highlighting, image optimization, and dynamic OG images.",
        relatedProject: "arndvs",
        commitRange: "dfb23ae..232c0bb",
        isHighlight: true,
    },
    {
        title: "Blog JSON-LD — dateModified, wordCount, XSS protection",
        slug: "blog-jsonld-structured-data",
        date: "2025-05-15T00:00:00Z",
        type: "feature",
        summary:
            "Added Article structured data to blog posts with dateModified tracking, automatic word count, and XSS-safe JSON-LD serialization.",
        relatedProject: "arndvs",
        commitHash: "50e40e7",
        isHighlight: false,
    },
    {
        title: "AI SEO enhancement pipeline + IndexNow webhook",
        slug: "ai-seo-pipeline-indexnow",
        date: "2025-05-20T00:00:00Z",
        type: "feature",
        summary:
            "Built an AI-powered SEO enhancement pipeline that generates metadata on publish, plus an IndexNow webhook for instant search engine notification.",
        relatedProject: "arndvs",
        commitRange: "9761e75..c1ef350",
        isHighlight: true,
    },
];

function slugToId(slug: string): string {
    return `changelog-${slug}`;
}

async function seed() {
    console.log("Seeding changelog entries...\n");

    const existing = await client.fetch<string[]>(`*[_type == "changelogEntry"].slug.current`);
    const existingSet = new Set(existing);

    let created = 0;
    let skipped = 0;

    for (const entry of entries) {
        if (existingSet.has(entry.slug)) {
            console.log(`  ⏭ ${entry.slug} (exists)`);
            skipped++;
            continue;
        }

        await client.createOrReplace({
            _type: "changelogEntry",
            _id: slugToId(entry.slug),
            title: entry.title,
            slug: { _type: "slug", current: entry.slug },
            date: entry.date,
            type: entry.type,
            summary: entry.summary,
            relatedProject: entry.relatedProject,
            commitHash: entry.commitHash,
            commitRange: entry.commitRange,
            isHighlight: entry.isHighlight,
            source: "manual",
        });

        console.log(`  ✅ ${entry.slug}`);
        created++;
    }

    console.log(`\nDone: ${created} created, ${skipped} skipped.`);
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
