import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const { buildLlmsFullTxt, buildLlmsTxt } = await import("./build");
const { CASE_STUDIES, listedCaseStudies } = await import("./sources");
const { PROJECTS } = await import("@/lib/data/projects");
const { EXPERIMENTS } = await import("@/lib/data/experiments");
const { SERVICES } = await import("@/lib/data/services");
const { RESULTS_PAGE, PUBLISHED_TESTIMONIALS } = await import("@/app/results/data");
const { TALKS } = await import("@/app/speaking/data");

const input = {
    siteUrl: "https://arndvs.com",
    caseStudies: listedCaseStudies(),
    experiments: EXPERIMENTS,
    services: SERVICES,
    posts: [
        {
            title: "Readable vs explainable",
            slug: "readable-vs-explainable",
            excerpt: "Why the two differ.",
            publishedAt: "2026-10-01T00:00:00Z",
            text: "Body text of the post.",
        },
    ],
    clients: RESULTS_PAGE.clients,
    results: RESULTS_PAGE.results,
    testimonials: PUBLISHED_TESTIMONIALS,
    talks: TALKS,
    generatedOn: "2026-11-24",
};

describe("llms.txt", () => {
    it("covers every listed project, so a new case study can't be left out", () => {
        expect(Object.keys(CASE_STUDIES).sort()).toEqual(PROJECTS.map((p) => p.slug).sort());
    });

    it("starts with the name, a summary and the location, per llmstxt.org", () => {
        const txt = buildLlmsTxt(input);
        expect(txt.startsWith("# Aaron Davis\n\n> ")).toBe(true);
        expect(txt).toContain("San Diego, California");
        expect(txt).toContain("- Profile: https://github.com/arndvs");
    });

    it("links every case study, experiment and post with an absolute https URL", () => {
        const txt = buildLlmsTxt(input);
        for (const p of PROJECTS) expect(txt).toContain(`(https://arndvs.com/projects/${p.slug})`);
        for (const e of EXPERIMENTS)
            expect(txt).toContain(`(https://arndvs.com/experiments/${e.slug})`);
        expect(txt).toContain(
            "(https://arndvs.com/blog/readable-vs-explainable): Why the two differ.",
        );
        expect(txt).not.toContain("http://");
    });

    it("puts each case study's deep dives, decisions and the post bodies in the full file", () => {
        const full = buildLlmsFullTxt(input);
        for (const { data } of listedCaseStudies()) {
            expect(full).toContain(`### ${data.title}`);
            for (const dive of data.deepDives)
                expect(full).toContain(`#### ${dive.title}: ${dive.subtitle}`);
        }
        expect(full).toContain("Body text of the post.");
    });

    it("leaves out results that aren't traced to a source, as the Results page does", () => {
        const full = buildLlmsFullTxt(input);
        for (const r of RESULTS_PAGE.results) {
            if (r.verification === "open") expect(full).not.toContain(r.title);
            else expect(full).toContain(r.title);
        }
    });

    it("lists every service in the index and its FAQs in the full file", () => {
        const txt = buildLlmsTxt(input);
        const full = buildLlmsFullTxt(input);
        for (const s of SERVICES) {
            expect(txt).toContain(`(https://arndvs.com/services/${s.slug})`);
            for (const f of s.faqs) expect(full).toContain(f.question);
        }
    });
});
