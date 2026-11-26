import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

vi.mock("@/sanity/lib/client", () => ({
    client: { withConfig: () => ({ fetch: async () => [] }) },
}));

const { default: sitemap } = await import("./sitemap");

describe("sitemap", () => {
    it("includes /results and /speaking", async () => {
        const urls = (await sitemap()).map((entry) => entry.url);
        expect(urls).toContain("https://arndvs.com/results");
        expect(urls).toContain("https://arndvs.com/speaking");
    });

    it("never stamps a page with the build time", async () => {
        const before = Date.now();
        const entries = await sitemap();
        for (const e of entries) {
            const t = new Date(e.lastModified ?? 0).getTime();
            expect(Number.isNaN(t)).toBe(false);
            // A real edit date is at least a little in the past; "now" would land at or after `before`.
            expect(t).toBeLessThan(before);
        }
    });

    it("dates /projects by its newest project", async () => {
        const { PROJECTS } = await import("@/lib/data/projects");
        const newest = Math.max(...PROJECTS.map((p) => new Date(p.lastModified).getTime()));
        const entry = (await sitemap()).find((e) => e.url === "https://arndvs.com/projects");
        expect(new Date(entry!.lastModified!).getTime()).toBe(newest);
    });

    it("lists the services hub and every service page", async () => {
        const { SERVICES } = await import("@/lib/data/services");
        const urls = (await sitemap()).map((e) => e.url);
        expect(urls).toContain("https://arndvs.com/services");
        for (const s of SERVICES) expect(urls).toContain(`https://arndvs.com/services/${s.slug}`);
    });
});
