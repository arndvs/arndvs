import { describe, expect, it, vi } from "vitest";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const { default: ResultsPage } = await import("./page");
const { PUBLISHED_TESTIMONIALS, RESULTS_PAGE } = await import("./data");

const decode = (html: string) =>
    html
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

describe("/results page", () => {
    const html = decode(renderToStaticMarkup(createElement(ResultsPage)));

    it("renders every result title and client", () => {
        for (const result of RESULTS_PAGE.results) expect(html).toContain(result.title);
        for (const client of RESULTS_PAGE.clients) expect(html).toContain(client.name);
    });

    it("renders every published testimonial author in a blockquote with a cite", () => {
        expect(PUBLISHED_TESTIMONIALS.length).toBeGreaterThan(0);
        for (const testimonial of PUBLISHED_TESTIMONIALS) {
            expect(html).toContain(`>${testimonial.author}</cite>`);
        }
        expect(html.match(/<blockquote/g)?.length).toBe(PUBLISHED_TESTIMONIALS.length);
    });

    it("does not render pending testimonials", () => {
        for (const testimonial of RESULTS_PAGE.testimonials) {
            if (testimonial.permission === "written-pending") {
                expect(html).not.toContain(testimonial.quote.slice(0, 40));
            }
        }
    });

    it("never renders internal source references", () => {
        for (const result of RESULTS_PAGE.results) {
            expect(html).not.toContain(result.source);
            expect(html).not.toContain("facts ledger");
        }
    });

    it("opens external links safely", () => {
        const external = html.match(/<a[^>]+target="_blank"[^>]*>/g) ?? [];
        expect(external.length).toBeGreaterThan(0);
        for (const tag of external) expect(tag).toContain('rel="noopener noreferrer"');
    });

    it("emits WebPage JSON-LD and no Review markup", () => {
        expect(html).toContain('"@type":"WebPage"');
        expect(html).not.toMatch(/"@type":"(Review|AggregateRating)"/);
    });
});
