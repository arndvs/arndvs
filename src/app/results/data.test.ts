import { describe, expect, it } from "vitest";

import { PROJECTS } from "@/lib/data/projects";

import { PUBLISHED_TESTIMONIALS, RESULTS_PAGE, isPublishable } from "./data";

const ATTRIBUTIONS = ["solo", "lead"];
const VERIFICATIONS = ["confirmed", "counted", "case-study", "resume", "open"];
const PERMISSIONS = ["linkedin-approved", "written-approved", "written-pending"];
const PROJECT_HREFS = new Set(PROJECTS.map((project) => `/projects/${project.slug}`));

/**
 * The full text of each recommendation, as it appears at the source. Quotes on the page may cut
 * this text with an ellipsis, but every remaining piece must appear here word for word.
 */
const ORIGINALS: Record<string, string> = {
    "andrew-carrigan":
        "Working with Aaron at Ripemetrics’s was a pleasure, he was someone who always had deep curiosity and would find creative ways to tackle problems for results. Aaron was always able to grab onto new technologies and quickly and efficiently get up to speed and integrate them as needed. He was able extremely capable in staying a step ahead of the curve and find new and interesting ways to efficiently use AI at Ripemetrics’s as it was a burgeoning technology. Aaron is an asset on any team and he is someone who continuously pushes himself to upskill that was a pleasure to work with.",
    "philippe-recto":
        "After 4 months working directly under Aaron Davis, I can very much say that his vision for RipeMetrics is solid and the amount of learning has been nothing more than amazing! His generosity in educating his interns has made many who have left his wing several times better than when they first joined his business. I have learned under his guidance a stronger degree of Bootstrap4, VueJs, live teamwork in developing a SAAS, User story boards, and an overall understanding of creating a startup company. Anyone who is starting their new careers for web development will find working for Aaron a valuable step in the right direction. Kudos for your leadership and guidance!",
    "kevin-oefelein":
        "Aaron is a hell of a guy and a fantastic marketer. He seriously knows more about loyalty and cause marketing than anyone I've ever known or any author I've ever read--and I've studied dozens of loyalty and marketing books, courses, and programs over the years. If you're even thinking of doing any type of cause, loyalty, or reward marketing program in your business or non-profit, you'd be doing yourself a disservice not at least talking to Aaron and seeking out his advice. He is that good, and he has a handful of my own clients referred to him to prove it.",
    "bonnie-fischer":
        "Before AlignSD, my website was on WordPress, and I couldn't keep it current without waiting on someone. Aaron built the platform so I can update pages, events, and service content myself, without a developer in the loop. Patients now upload their insurance card and driver's license online, and my front desk only steps in when a case needs a person. Our emails run from one system instead of three, and the follow-ups after each visit are going live. We serve 5,000+ families, and I'd recommend Aaron to any practice that wants a website it can actually run.",
};

describe("RESULTS_PAGE results", () => {
    it("has required fields on every result", () => {
        expect(RESULTS_PAGE.results.length).toBeGreaterThan(0);
        for (const result of RESULTS_PAGE.results) {
            for (const field of ["id", "title", "before", "after", "change", "source"] as const) {
                expect(result[field].trim(), `${result.id}.${field}`).not.toBe("");
            }
            expect(ATTRIBUTIONS).toContain(result.attribution);
            expect(VERIFICATIONS).toContain(result.verification);
        }
    });

    it("uses unique ids", () => {
        const ids = RESULTS_PAGE.results.map((result) => result.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("links every result and client to a registered case study", () => {
        for (const item of [...RESULTS_PAGE.results, ...RESULTS_PAGE.clients]) {
            expect(PROJECT_HREFS, item.id).toContain(item.caseStudyHref);
        }
    });

    it("assigns every result to a known client, and every client has results", () => {
        const clientIds = RESULTS_PAGE.clients.map((client) => client.id);
        for (const result of RESULTS_PAGE.results) {
            expect(clientIds).toContain(result.clientId);
        }
        for (const id of clientIds) {
            expect(
                RESULTS_PAGE.results.some((result) => result.clientId === id),
                id,
            ).toBe(true);
        }
    });
});

describe("RESULTS_PAGE testimonials", () => {
    it("has valid permission values", () => {
        for (const testimonial of RESULTS_PAGE.testimonials) {
            expect(PERMISSIONS).toContain(testimonial.permission);
        }
    });

    it("never publishes a pending testimonial", () => {
        expect(PUBLISHED_TESTIMONIALS.every(isPublishable)).toBe(true);
        expect(PUBLISHED_TESTIMONIALS.some((t) => t.permission === "written-pending")).toBe(false);
    });

    it("gives every published testimonial attribution, an ISO date, and an https source", () => {
        for (const testimonial of PUBLISHED_TESTIMONIALS) {
            expect(testimonial.author.trim()).not.toBe("");
            expect(testimonial.title.trim()).not.toBe("");
            expect(testimonial.relationship.trim()).not.toBe("");
            expect(testimonial.date, testimonial.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            expect(new URL(testimonial.sourceUrl).protocol).toBe("https:");
        }
    });

    it("quotes every testimonial verbatim, with cuts marked by an ellipsis", () => {
        for (const testimonial of RESULTS_PAGE.testimonials) {
            const original = ORIGINALS[testimonial.id];
            expect(original, `no original on file for ${testimonial.id}`).toBeDefined();
            const pieces = testimonial.quote
                .split("…")
                .map((piece) => piece.trim())
                .filter(Boolean);
            for (const piece of pieces) {
                expect(original, `${testimonial.id}: "${piece.slice(0, 40)}…"`).toContain(piece);
            }
        }
    });
});
