import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/env", () => ({
    siteConfig: { url: "https://arndvs.com", studioUrl: "/studio" },
}));

const { default: robots, AI_SEARCH_BOTS } = await import("./robots");

describe("robots", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("allows everyone in production and points at the https sitemap", () => {
        vi.stubEnv("VERCEL_ENV", "production");
        const r = robots();
        expect(r.sitemap).toBe("https://arndvs.com/sitemap.xml");
        const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
        expect(rules[0]).toMatchObject({ userAgent: "*", allow: "/" });
        expect(rules[1]?.userAgent).toEqual([...AI_SEARCH_BOTS]);
    });

    it("blocks every crawler on preview deployments", () => {
        vi.stubEnv("VERCEL_ENV", "preview");
        expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    });
});
