import { describe, expect, it } from "vitest";

import { normalizeSiteUrl } from "./site-url";

describe("normalizeSiteUrl", () => {
    it("upgrades http to https on a real host", () => {
        expect(normalizeSiteUrl("http://arndvs.com")).toBe("https://arndvs.com");
        expect(normalizeSiteUrl("http://www.arndvs.com/")).toBe("https://www.arndvs.com");
    });

    it("adds https when the scheme is missing", () => {
        expect(normalizeSiteUrl("arndvs.com")).toBe("https://arndvs.com");
    });

    it("keeps http for local development", () => {
        expect(normalizeSiteUrl("http://localhost:3000/")).toBe("http://localhost:3000");
        expect(normalizeSiteUrl("http://127.0.0.1:3456")).toBe("http://127.0.0.1:3456");
    });

    it("leaves a correct origin alone and drops any path", () => {
        expect(normalizeSiteUrl("https://arndvs.com")).toBe("https://arndvs.com");
        expect(normalizeSiteUrl(" https://arndvs.com/// ")).toBe("https://arndvs.com");
    });
});
