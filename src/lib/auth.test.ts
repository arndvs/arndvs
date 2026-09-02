import { describe, expect, it } from "vitest";

import { safeCompare } from "./auth";

describe("safeCompare", () => {
    it("returns true only for equal strings", () => {
        expect(safeCompare("secret123", "secret123")).toBe(true);
        expect(safeCompare("secret123", "secret456")).toBe(false);
        expect(safeCompare("short", "a-much-longer-string")).toBe(false);
        expect(safeCompare("", "")).toBe(true);
        expect(safeCompare("", "notempty")).toBe(false);
    });
});
