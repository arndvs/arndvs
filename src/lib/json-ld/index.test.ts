import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const lib = await import("./index");

describe("json-ld builders", () => {
    it("starts every breadcrumb trail at Home and ends at the page", () => {
        const b = lib.breadcrumbList("/services/ai", [
            { name: "Services", path: "/services" },
            { name: "AI features", path: "/services/ai" },
        ]);
        expect(b["@id"]).toBe("https://arndvs.com/services/ai/#breadcrumb");
        expect(b.itemListElement.map((i) => i.item)).toEqual([
            "https://arndvs.com",
            "https://arndvs.com/services",
            "https://arndvs.com/services/ai",
        ]);
        expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    });

    it("links pages to the site and services to the person", () => {
        const page = lib.webPage({ path: "/services", name: "Services", description: "d" });
        expect(page.isPartOf).toEqual({ "@id": "https://arndvs.com/#website" });
        expect(page.breadcrumb).toEqual({ "@id": "https://arndvs.com/services/#breadcrumb" });
        const s = lib.service({
            path: "/services/ai",
            name: "AI",
            description: "d",
            serviceType: "x",
        });
        expect(s.provider).toEqual({ "@id": "https://arndvs.com/#person" });
    });

    it("builds absolute https URLs and drops empty graph nodes", () => {
        expect(lib.absolute("/")).toBe("https://arndvs.com");
        expect(lib.absolute("blog")).toBe("https://arndvs.com/blog");
        expect(lib.graph({ a: 1 }, null, false)["@graph"]).toHaveLength(1);
    });

    it("turns FAQs into Question/Answer pairs", () => {
        const f = lib.faqPage("/services", [{ question: "Q?", answer: "A." }]);
        expect(f.mainEntity[0]).toEqual({
            "@type": "Question",
            name: "Q?",
            acceptedAnswer: { "@type": "Answer", text: "A." },
        });
    });
});
