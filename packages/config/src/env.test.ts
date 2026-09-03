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
    it("accepts a minimal valid env with capability flags off by default", () => {
        const result = envSchema.safeParse(BASE_ENV);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.ENABLE_AI).toBe(false);
            expect(result.data.ENABLE_CONTENT_SHIP).toBe(false);
        }
    });

    it("requires OPENAI_API_KEY when ENABLE_AI=true", () => {
        const missing = envSchema.safeParse({ ...BASE_ENV, ENABLE_AI: "true" });
        expect(missing.success).toBe(false);
        if (!missing.success) {
            expect(JSON.stringify(missing.error.issues)).toContain("OPENAI_API_KEY");
        }

        const present = envSchema.safeParse({
            ...BASE_ENV,
            ENABLE_AI: "true",
            OPENAI_API_KEY: "sk-test",
        });
        expect(present.success).toBe(true);
    });

    it("requires SANITY_API_TOKEN when ENABLE_CONTENT_SHIP=true", () => {
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
