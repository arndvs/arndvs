import { describe, expect, it } from "vitest";

import { BRAND } from "./brand";

describe("BRAND", () => {
    it("never leaks launch branding", () => {
        const lower = JSON.stringify(BRAND).toLowerCase();
        expect(lower).not.toContain("launch");
        expect(lower).not.toContain("flint");
    });
});
