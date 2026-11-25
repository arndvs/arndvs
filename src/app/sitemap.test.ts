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
});
