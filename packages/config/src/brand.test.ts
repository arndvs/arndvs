import { describe, expect, it } from "vitest";

import { BRAND } from "./brand";

describe("BRAND", () => {
    it("defines the core identity without leaking launch branding", () => {
        expect(BRAND.appName).toBe("Aaron Davis");
        expect(BRAND.slug).toBe("arndvs");
        expect(BRAND.appUrl).toBe("https://arndvs.com");

        const lower = JSON.stringify(BRAND).toLowerCase();
        expect(lower).not.toContain("launch");
        expect(lower).not.toContain("flint");
    });
});
