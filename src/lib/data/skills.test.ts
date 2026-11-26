import { describe, expect, it } from "vitest";

import { listedCaseStudies } from "@/lib/llms/sources";

import { SERVICES } from "./services";
import {
    MIN_PROJECTS,
    SKILLS,
    TITLE_LIMIT,
    indexedSkills,
    isIndexed,
    projectsFor,
    skillDescription,
    skillForLabel,
    skillTitle,
} from "./skills";
import { technologiesData } from "./technologies";

describe("skills", () => {
    it("has unique slugs and names", () => {
        expect(new Set(SKILLS.map((s) => s.slug)).size).toBe(SKILLS.length);
        expect(new Set(SKILLS.map((s) => s.name)).size).toBe(SKILLS.length);
    });

    it("never has a skill with no case study behind it", () => {
        for (const s of SKILLS) expect(projectsFor(s).length, s.slug).toBeGreaterThan(0);
    });

    it("indexes only skills with enough case studies", () => {
        for (const s of SKILLS) {
            expect(isIndexed(s), s.slug).toBe(projectsFor(s).length >= MIN_PROJECTS);
        }
        expect(indexedSkills().length).toBeGreaterThan(0);
    });

    it("matches whole stack lines only", () => {
        // "React Email" is an email library, not React work.
        const react = SKILLS.find((s) => s.slug === "react")!;
        expect(react.match.test("React Email")).toBe(false);
        expect(react.match.test("React 19")).toBe(true);
    });

    it("finds every case study that lists the skill", () => {
        const sanity = SKILLS.find((s) => s.slug === "sanity")!;
        const expected = listedCaseStudies()
            .filter((c) => c.data.stack.some((l) => l.startsWith("Sanity")))
            .map((c) => c.slug);
        expect(projectsFor(sanity).map((p) => p.slug)).toEqual(expected);
    });

    it("links only to services that exist", () => {
        const slugs = new Set(SERVICES.map((s) => s.slug));
        for (const s of SKILLS) for (const svc of s.services) expect(slugs, s.slug).toContain(svc);
    });

    it("keeps titles and descriptions within search-snippet limits", () => {
        for (const s of SKILLS) {
            expect(skillTitle(s).length, s.slug).toBeLessThanOrEqual(TITLE_LIMIT);
            const d = skillDescription(s);
            expect(d.length, s.slug).toBeGreaterThanOrEqual(70);
            expect(d.length, s.slug).toBeLessThanOrEqual(160);
        }
    });

    it("keeps figures out of the summaries", () => {
        for (const s of SKILLS) expect(s.summary, s.slug).not.toMatch(/\d/);
    });

    it("maps home page labels to real technologies", () => {
        for (const s of SKILLS) for (const l of s.labels) expect(technologiesData).toContain(l);
        expect(skillForLabel("Sanity CMS")?.slug).toBe("sanity");
    });
});
