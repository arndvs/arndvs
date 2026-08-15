import { describe, expect, it } from "vitest";

import { envSchema } from "./env";

const BASE_ENV = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123",
    NEXT_PUBLIC_SANITY_DATASET: "production",
    NEXT_PUBLIC_SANITY_API_VERSION: "2025-03-19",
    NEXT_PUBLIC_SITE_URL: "https://arndvs.com",
    NODE_ENV: "test" as const,
};

describe("env schema", () => {
    it("accepts a minimal valid env", () => {
        const result = envSchema.safeParse(BASE_ENV);
        expect(result.success).toBe(true);
    });

    it("defaults capability flags to false", () => {
        const result = envSchema.safeParse(BASE_ENV);
        expect(result.success && result.data.ENABLE_AI).toBe(false);
        expect(result.success && result.data.ENABLE_CONTENT_SHIP).toBe(false);
    });

    it("fails when ENABLE_AI=true without OPENAI_API_KEY", () => {
        const result = envSchema.safeParse({ ...BASE_ENV, ENABLE_AI: "true" });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(JSON.stringify(result.error.issues)).toContain("OPENAI_API_KEY");
        }
    });

    it("passes when ENABLE_AI=true with OPENAI_API_KEY", () => {
        const result = envSchema.safeParse({
            ...BASE_ENV,
            ENABLE_AI: "true",
            OPENAI_API_KEY: "sk-test",
        });
        expect(result.success).toBe(true);
    });

    it("fails when ENABLE_CONTENT_SHIP=true without SANITY_API_TOKEN", () => {
        const result = envSchema.safeParse({
            ...BASE_ENV,
            ENABLE_CONTENT_SHIP: "true",
            OPENAI_API_KEY: "sk-test",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(JSON.stringify(result.error.issues)).toContain("SANITY_API_TOKEN");
        }
    });

    it("fails when required Sanity vars are missing", () => {
        const result = envSchema.safeParse({});
        expect(result.success).toBe(false);
    });
});
