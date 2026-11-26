import { describe, expect, it } from "vitest";

import { RESULTS_PAGE } from "@/app/results/data";

import { EXPERIMENTS } from "./experiments";
import { PROJECTS } from "./projects";
import { SERVICES } from "./services";

describe("services", () => {
    it("has unique slugs, titles and target queries, so pages don't compete", () => {
        for (const key of ["slug", "title", "query"] as const) {
            const values = SERVICES.map((s) => s[key].toLowerCase());
            expect(new Set(values).size).toBe(values.length);
        }
    });

    it("keeps titles and descriptions within what search results show", () => {
        for (const s of SERVICES) {
            // The layout appends " | Aaron Davis" (14 characters); Google shows about 60.
            expect(s.title.length + 14, s.slug).toBeLessThanOrEqual(62);
            expect(s.description.length, s.slug).toBeGreaterThanOrEqual(70);
            expect(s.description.length, s.slug).toBeLessThanOrEqual(160);
        }
    });

    it("links only to listed case studies and existing experiments", () => {
        const projects = new Set(PROJECTS.map((p) => p.slug));
        const experiments = new Set(EXPERIMENTS.map((e) => e.slug));
        for (const s of SERVICES) {
            expect(s.caseStudies.length, s.slug).toBeGreaterThan(0);
            for (const c of s.caseStudies)
                expect(projects.has(c.slug), `${s.slug} → ${c.slug}`).toBe(true);
            for (const e of s.experiments ?? [])
                expect(experiments.has(e), `${s.slug} → ${e}`).toBe(true);
        }
    });

    it("uses only results that are traced to a source", () => {
        const results = new Map(RESULTS_PAGE.results.map((r) => [r.id, r]));
        for (const s of SERVICES) {
            for (const id of s.resultIds) {
                const r = results.get(id);
                expect(r, `${s.slug} → ${id}`).toBeDefined();
                expect(r!.verification, `${s.slug} → ${id}`).not.toBe("open");
            }
        }
    });

    it("keeps figures out of service copy: numbers belong in traced results", () => {
        for (const s of SERVICES) {
            const copy = [s.h1, s.intro, ...s.forWho, ...s.deliverables].join(" ");
            // Allowed: years and version numbers like "Next.js 16" or "Sanity v5".
            const numbers = copy.match(/\b\d[\d,.]*%?\b/g) ?? [];
            const allowed = numbers.filter((n) => !/^(19|20)\d\d$/.test(n) && !/^\d{1,2}$/.test(n));
            expect(allowed, s.slug).toEqual([]);
        }
    });

    it("answers how engagements work on every page", () => {
        for (const s of SERVICES)
            expect(
                s.faqs.some((f) => /contract/i.test(f.answer)),
                s.slug,
            ).toBe(true);
    });
});
