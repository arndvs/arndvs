import { describe, expect, it } from "vitest";

import { BRAND } from "./brand";

describe("BRAND", () => {
    it("does not leak launch branding", () => {
        expect(JSON.stringify(BRAND).toLowerCase()).not.toContain("launch");
        expect(JSON.stringify(BRAND).toLowerCase()).not.toContain("flint");
    });

    it("defines the core identity", () => {
        expect(BRAND.appName).toBe("Aaron Davis");
        expect(BRAND.slug).toBe("arndvs");
        expect(BRAND.appUrl).toBe("https://arndvs.com");
    });

    it("defines social links", () => {
        expect(BRAND.social.github).toContain("github.com");
        expect(BRAND.social.linkedin).toContain("linkedin.com");
    });
});
