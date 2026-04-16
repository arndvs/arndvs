import { describe, expect, it } from "vitest";

import { safeCompare } from "./auth";

describe("safeCompare", () => {
    it("returns true for equal strings", () => {
        expect(safeCompare("secret123", "secret123")).toBe(true);
    });

    it("returns false for unequal strings", () => {
        expect(safeCompare("secret123", "secret456")).toBe(false);
    });

    it("returns false for different lengths", () => {
        expect(safeCompare("short", "a-much-longer-string")).toBe(false);
    });

    it("returns true for empty strings", () => {
        expect(safeCompare("", "")).toBe(true);
    });

    it("returns false when one is empty", () => {
        expect(safeCompare("", "notempty")).toBe(false);
    });
});
