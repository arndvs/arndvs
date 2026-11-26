import type { Result, ResultsClient, Testimonial } from "@/app/results/data";
import type { Talk } from "@/app/speaking/data";
import type { ExperimentEntry } from "@/lib/data/experiments";
import { personJsonLd } from "@/lib/data/json-ld";
import type { Service } from "@/lib/data/services";

import type { LlmsCaseStudy } from "./sources";

/**
 * Builds /llms.txt (a short index, per llmstxt.org) and /llms-full.txt (the same, with
 * every case study, result and post in full) from the data the pages already render.
 * Pure functions: the routes fetch, these format, the tests check.
 */

export interface LlmsPost {
    title: string;
    slug: string;
    excerpt?: string | null;
    publishedAt?: string | null;
    /** Plain text of the body; only used by the full file. */
    text?: string | null;
}

export interface LlmsInput {
    siteUrl: string;
    caseStudies: { slug: string; lastModified: string; data: LlmsCaseStudy }[];
    experiments: ExperimentEntry[];
    services: Service[];
    posts: LlmsPost[];
    clients: ResultsClient[];
    results: Result[];
    testimonials: Testimonial[];
    talks: Talk[];
    /** ISO date the file was generated, printed so readers can judge freshness. */
    generatedOn: string;
}

const PERSON = personJsonLd;

/** One line, no markdown breakers. */
const line = (s: string) => s.replace(/\s+/g, " ").trim();
const day = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");

function header(i: LlmsInput): string {
    return [
        `# ${PERSON.name}`,
        "",
        `> ${line(PERSON.description)}`,
        "",
        `${PERSON.name} (handle: arndvs) is an applied AI full-stack engineer based in San Diego, California. He co-founded RipeMetrics and built on it from 2017 to 2025, and now builds AI features, agent infrastructure and lifecycle marketing systems. He is open to full-time and contract work, in San Diego or remote.`,
        "",
        "- Site: " + i.siteUrl,
        "- Contact: aaron@arndvs.com, or the form at " + `${i.siteUrl}/work-with-me`,
        ...PERSON.sameAs.map((u) => `- Profile: ${u}`),
        `- Last generated: ${i.generatedOn}`,
    ].join("\n");
}

function pagesIndex(i: LlmsInput): string {
    const u = i.siteUrl;
    return [
        "## About and hiring",
        "",
        `- [About](${u}/about): background, stack, certifications and talks`,
        `- [Work with me](${u}/work-with-me): the roles and contract work he takes on, and how to get in touch`,
        `- [Results](${u}/results): before-and-after outcomes from client and company work, each linked to its case study`,
        `- [Speaking](${u}/speaking): past sessions and topics he can bring to a group`,
    ].join("\n");
}

function servicesIndex(i: LlmsInput): string {
    if (i.services.length === 0) return "";
    return [
        "## Services for businesses",
        "",
        `- [All services](${i.siteUrl}/services): contract work for businesses, each service backed by case studies`,
        ...i.services.map(
            (s) => `- [${s.name}](${i.siteUrl}/services/${s.slug}): ${line(s.description)}`,
        ),
    ].join("\n");
}

function servicesFull(i: LlmsInput): string {
    if (i.services.length === 0) return "";
    const out = ["## Services for businesses"];
    for (const s of i.services) {
        out.push(
            "",
            `### ${s.name}`,
            "",
            `URL: ${i.siteUrl}/services/${s.slug}`,
            "",
            line(s.intro),
            "",
            "What gets built:",
            ...s.deliverables.map((d) => `- ${line(d)}`),
            "",
            "Proof: " + s.caseStudies.map((c) => `${i.siteUrl}/projects/${c.slug}`).join(", "),
            "",
            ...s.faqs.flatMap((f) => [`**${line(f.question)}** ${line(f.answer)}`, ""]),
        );
    }
    return out.join("\n").trimEnd();
}

function projectsIndex(i: LlmsInput): string {
    return [
        "## Case studies",
        "",
        ...i.caseStudies.map(
            ({ slug, data }) =>
                `- [${data.title}](${i.siteUrl}/projects/${slug}): ${line(data.tagline)}`,
        ),
    ].join("\n");
}

function experimentsIndex(i: LlmsInput): string {
    if (i.experiments.length === 0) return "";
    return [
        "## Interactive experiments",
        "",
        ...i.experiments.map(
            (e) => `- [${e.title}](${i.siteUrl}/experiments/${e.slug}): ${line(e.description)}`,
        ),
    ].join("\n");
}

function postsIndex(i: LlmsInput): string {
    if (i.posts.length === 0) return "";
    return [
        "## Writing",
        "",
        ...i.posts.map(
            (p) =>
                `- [${line(p.title)}](${i.siteUrl}/blog/${p.slug})${p.excerpt ? `: ${line(p.excerpt)}` : ""}`,
        ),
    ].join("\n");
}

function optional(i: LlmsInput): string {
    return [
        "## Optional",
        "",
        `- [Full text for language models](${i.siteUrl}/llms-full.txt): every case study, result and post in one file`,
        `- [Blog RSS](${i.siteUrl}/blog/feed.xml)`,
        `- [Sitemap](${i.siteUrl}/sitemap.xml)`,
    ].join("\n");
}

export function buildLlmsTxt(i: LlmsInput): string {
    return [
        header(i),
        pagesIndex(i),
        servicesIndex(i),
        projectsIndex(i),
        experimentsIndex(i),
        postsIndex(i),
        optional(i),
    ]
        .filter(Boolean)
        .join("\n\n")
        .concat("\n");
}

function caseStudyFull(
    siteUrl: string,
    slug: string,
    lastModified: string,
    d: LlmsCaseStudy,
): string {
    const out: string[] = [
        `### ${d.title}`,
        "",
        `URL: ${siteUrl}/projects/${slug} · Updated: ${lastModified}`,
        `Role: ${line(d.role)} · When: ${line(d.timeline)}${d.client ? ` · For: ${line(d.client)}` : ""}`,
        `Stack: ${d.stack.join(", ")}`,
        "",
        line(d.tagline),
        "",
        ...d.narrative.map(line),
    ];
    if (d.architecture) out.push("", `**Architecture.** ${line(d.architecture)}`);
    for (const dive of d.deepDives) {
        out.push(
            "",
            `#### ${dive.title}: ${dive.subtitle}`,
            "",
            `**Problem.** ${line(dive.problem)}`,
            "",
            ...dive.walkthrough.map((w) => `- ${line(w)}`),
            "",
            `**${line(dive.insight.title)}.** ${line(dive.insight.body)}`,
        );
    }
    if (d.decisions.length) {
        out.push("", "#### Decisions", "");
        for (const x of d.decisions) {
            out.push(
                `- **${line(x.decision)}** (instead of: ${line(x.alternatives)}). ${line(x.reasoning)}`,
            );
        }
    }
    if (d.learnings.length) {
        out.push("", "#### Learnings", "");
        for (const l of d.learnings) out.push(`- **${line(l.title)}.** ${line(l.body)}`);
    }
    return out.join("\n");
}

function resultsFull(i: LlmsInput): string {
    const clients = new Map(i.clients.map((c) => [c.id, c]));
    // Only results traced to a source are listed; "open" figures stay off, as on the page.
    const shown = i.results.filter((r) => r.verification !== "open");
    const out = ["## Results", ""];
    for (const r of shown) {
        const c = clients.get(r.clientId);
        out.push(
            `- **${line(r.title)}** (${c ? `${c.name}, ${c.descriptor}` : r.clientId}). Before: ${line(r.before)}. After: ${line(r.after)}. ${line(r.change)} Case study: ${i.siteUrl}${r.caseStudyHref}`,
        );
    }
    if (i.testimonials.length) {
        out.push("", "### Recommendations", "");
        for (const t of i.testimonials) {
            out.push(
                `> ${line(t.quote)}`,
                `> — ${t.author}, ${t.title}${t.organization ? `, ${t.organization}` : ""} (${t.relationship})`,
                "",
            );
        }
    }
    return out.join("\n").trimEnd();
}

function talksFull(i: LlmsInput): string {
    if (i.talks.length === 0) return "";
    return [
        "## Talks",
        "",
        ...i.talks.map(
            (t) =>
                `- **${line(t.title)}** · ${t.event}, ${t.host}${t.city ? `, ${t.city}` : ""} · ${day(t.date)}. ${line(t.summary)} ${i.siteUrl}/speaking#${t.id}`,
        ),
    ].join("\n");
}

function postsFull(i: LlmsInput): string {
    if (i.posts.length === 0) return "";
    const out = ["## Writing"];
    for (const p of i.posts) {
        out.push(
            "",
            `### ${line(p.title)}`,
            "",
            `URL: ${i.siteUrl}/blog/${p.slug}${p.publishedAt ? ` · Published: ${day(p.publishedAt)}` : ""}`,
            "",
            (p.text ?? p.excerpt ?? "").trim(),
        );
    }
    return out.join("\n");
}

export function buildLlmsFullTxt(i: LlmsInput): string {
    const studies = [
        "## Case studies",
        ...i.caseStudies.map(
            (c) => "\n" + caseStudyFull(i.siteUrl, c.slug, c.lastModified, c.data),
        ),
    ].join("\n");
    return [
        header(i),
        pagesIndex(i),
        servicesFull(i),
        resultsFull(i),
        studies,
        experimentsIndex(i),
        talksFull(i),
        postsFull(i),
    ]
        .filter(Boolean)
        .join("\n\n")
        .concat("\n");
}
