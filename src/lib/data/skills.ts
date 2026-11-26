import { listedCaseStudies } from "@/lib/llms/sources";

import { latestDate } from "./page-dates";

/**
 * Skill pages: one per tool a hiring manager might search for ("Sanity developer",
 * "Cloudflare Workers developer"). Each page lists the case studies whose stack uses it,
 * found by matching the stack lines in the case-study data, so a page can never claim
 * work that isn't written up.
 *
 * A skill is indexed only when at least MIN_PROJECTS case studies use it. Below that the
 * page still renders for people following a link, but it is noindex and left out of the
 * sitemap: a page with one project behind it is thin, and thin pages drag the site down.
 */
export const MIN_PROJECTS = 2;

export interface Skill {
    slug: string;
    name: string;
    /** Matches a whole stack line in a case study, such as "Sanity v5". */
    match: RegExp;
    /** One or two sentences in Aaron's voice; no figures (those live in the case studies). */
    summary: string;
    /** Labels in the home page's technology list that should link here. */
    labels: string[];
    /** Service slugs this skill sits under. */
    services: string[];
}

export const SKILLS: Skill[] = [
    {
        slug: "nextjs",
        name: "Next.js",
        match: /^Next\.js\b/,
        summary:
            "Next.js is the framework under most of the sites and apps I build: a chiropractic practice's owner-run platform, the RipeMetrics customer app, and a full fictional corporate site.",
        labels: ["Next.js"],
        services: ["sanity-nextjs-development", "healthcare-practice-websites"],
    },
    {
        slug: "react",
        name: "React",
        match: /^React( \d+)?$/,
        summary:
            "React is how I build interfaces, from the RipeMetrics product app to a chiropractic practice's patient-facing site.",
        labels: ["React"],
        services: ["sanity-nextjs-development"],
    },
    {
        slug: "typescript",
        name: "TypeScript",
        match: /^TypeScript$/,
        summary:
            "I write TypeScript by default, in product code and in the agent tooling I build for my own work.",
        labels: ["TypeScript"],
        services: ["ai-development", "sanity-nextjs-development"],
    },
    {
        slug: "sanity",
        name: "Sanity",
        match: /^Sanity\b/,
        summary:
            "Sanity is my CMS of choice when owners need to edit their own site: content is structured data, so one edit updates the page, the structured data and the AI-readable files.",
        labels: ["Sanity CMS"],
        services: ["sanity-nextjs-development", "healthcare-practice-websites"],
    },
    {
        slug: "cloudflare-workers",
        name: "Cloudflare Workers",
        match: /^Cloudflare (Pages \/ )?Workers?$/,
        summary:
            "I build on Cloudflare Workers when the work belongs at the edge: storefronts, a loyalty program and a content approval worker for one brand.",
        labels: ["Cloudflare Workers"],
        services: ["ai-development"],
    },
    {
        slug: "astro",
        name: "Astro",
        match: /^Astro\b/,
        summary:
            "Astro is what I reach for when a site is mostly content and has to load fast on Cloudflare.",
        labels: [],
        services: ["sanity-nextjs-development"],
    },
    {
        slug: "gohighlevel",
        name: "GoHighLevel",
        match: /^GoHighLevel$/,
        summary:
            "I connect GoHighLevel to custom sites and apps so leads, bookings and orders land in the CRM a small business already runs on.",
        labels: ["GoHighLevel"],
        services: ["healthcare-practice-websites", "braze-lifecycle-engineering"],
    },
    {
        slug: "llm-apis",
        name: "OpenAI and Anthropic API",
        match: /^(OpenAI|Anthropic)\b/,
        summary:
            "I build features on the OpenAI and Anthropic APIs: retrieval-backed assistants, content drafting with a fact-check gate, and tools a practice's staff use.",
        labels: ["OpenAI / Claude API"],
        services: ["ai-development"],
    },
    {
        slug: "stripe",
        name: "Stripe",
        match: /^Stripe$/,
        summary:
            "I wire Stripe into storefronts and practice sites, including as a fallback beside another payment processor.",
        labels: [],
        services: ["sanity-nextjs-development"],
    },
    {
        slug: "braze",
        name: "Braze",
        match: /^Braze\b/,
        summary:
            "I build Braze lifecycle journeys end to end: Canvas, Catalogs, Connected Content, and Liquid that stops itself when the data is wrong.",
        labels: ["Braze", "Liquid"],
        services: ["braze-lifecycle-engineering"],
    },
    {
        slug: "snowflake",
        name: "Snowflake",
        match: /^Snowflake$/,
        summary:
            "I write the Snowflake data contracts that lifecycle messages read from, with SQL checks that pass or fail before anything sends.",
        labels: ["Snowflake"],
        services: ["braze-lifecycle-engineering"],
    },
    {
        slug: "claude-code",
        name: "Claude Code",
        match: /^Claude Code$/,
        summary:
            "I build agent infrastructure for Claude Code: skills, hooks and guardrails that let an agent do real work safely.",
        labels: ["Claude Code"],
        services: ["ai-development"],
    },
    {
        slug: "python",
        name: "Python",
        match: /^Python$/,
        summary: "I use Python for agent tooling, data work and scripts that need its libraries.",
        labels: ["Python"],
        services: ["ai-development"],
    },
];

export interface SkillProject {
    slug: string;
    title: string;
    tagline: string;
    /** The stack lines that matched, as the case study writes them. */
    used: string[];
    lastModified: string;
}

export function projectsFor(skill: Skill): SkillProject[] {
    return listedCaseStudies().flatMap(({ slug, lastModified, data }) => {
        const used = data.stack.filter((line) => skill.match.test(line.trim()));
        return used.length
            ? [{ slug, title: data.title, tagline: data.tagline, used, lastModified }]
            : [];
    });
}

export const isIndexed = (skill: Skill) => projectsFor(skill).length >= MIN_PROJECTS;

export const indexedSkills = () => SKILLS.filter(isIndexed);

export const findSkill = (slug: string) => SKILLS.find((s) => s.slug === slug);

export const skillForLabel = (label: string) => SKILLS.find((s) => s.labels.includes(label));

/** Newest of the skill's projects, so the sitemap moves only when the evidence does. */
export const skillLastModified = (skill: Skill) =>
    latestDate(
        projectsFor(skill).map((p) => p.lastModified),
        "2026-11-24",
    );

const SUFFIX_LENGTH = " | Aaron Davis".length;

export const skillTitle = (skill: Skill) => `${skill.name} Developer: Case Studies`;

/** Names as many projects as fit in a search snippet. */
export function skillDescription(skill: Skill): string {
    const titles = projectsFor(skill).map((p) => p.title.replace(" — ", " "));
    const lead = `${skill.name} work by Aaron Davis, a San Diego applied AI engineer`;
    for (let n = titles.length; n > 0; n--) {
        const shown = titles.slice(0, n).join(", ");
        const more = n < titles.length ? " and more" : "";
        const text = `${lead}, with full case studies: ${shown}${more}.`;
        if (text.length <= 160) return text;
    }
    return `${lead}, with full case studies.`;
}

export const TITLE_LIMIT = 62 - SUFFIX_LENGTH;
