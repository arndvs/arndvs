import { z } from "zod";

import { BRAND } from "./brand";

/**
 * Capability-flag env validation.
 *
 * Lifted from Launch Core's `env.ts` pattern: features are physically disabled
 * (not just hidden in UI) by failing env validation at boot when a flag is on
 * but its required vars are missing. All flags default to "false" (opt-in).
 */

const boolFlag = z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true");

export const envSchema = z
    .object({
        // Core
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

        // Sanity (always required for the portfolio)
        NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
        NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
        NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1),
        NEXT_PUBLIC_SITE_URL: z.string().min(1),

        // Server-only Sanity tokens
        SANITY_API_READ_TOKEN: z.string().optional(),
        SANITY_API_TOKEN: z.string().optional(),
        SANITY_WEBHOOK_SECRET: z.string().optional(),

        // Capability flags — all default to false (opt-in)
        ENABLE_CONTENT_SHIP: boolFlag,
        ENABLE_COMMENT_SCOUT: boolFlag,
        ENABLE_AI: boolFlag,
        ENABLE_SANITY_STUDIO: boolFlag,
        ENABLE_ANALYTICS: boolFlag,

        // Conditional vars (validated only when their flag is enabled)
        OPENAI_API_KEY: z.string().optional(),
        ENHANCE_POST_SECRET: z.string().optional(),
        INDEXNOW_KEY: z.string().optional(),
        RESEND_API_KEY: z.string().optional(),
        BETTER_AUTH_SECRET: z.string().min(32).optional(),
        BETTER_AUTH_URL: z.string().optional(),
    })
    .superRefine((values, ctx) => {
        function requireWhenEnabled(flag: string, enabled: boolean, vars: string[]) {
            if (!enabled) return;
            for (const name of vars) {
                if (!values[name as keyof typeof values]) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [name],
                        message: `${name} is required when ${flag}=true`,
                    });
                }
            }
        }

        requireWhenEnabled("ENABLE_AI", values.ENABLE_AI, ["OPENAI_API_KEY"]);
        requireWhenEnabled("ENABLE_CONTENT_SHIP", values.ENABLE_CONTENT_SHIP, [
            "SANITY_API_TOKEN",
            "OPENAI_API_KEY",
        ]);
        requireWhenEnabled("ENABLE_COMMENT_SCOUT", values.ENABLE_COMMENT_SCOUT, [
            "SANITY_API_TOKEN",
        ]);
    });

export type Env = z.infer<typeof envSchema>;

export function loadEnv(env: Record<string, string | undefined> = process.env): Env {
    const result = envSchema.safeParse(env);
    if (!result.success) {
        const message = result.error.issues
            .map((i) => `- ${i.path.join(".")}: ${i.message}`)
            .join("\n");
        throw new Error(`Invalid environment configuration:\n${message}`);
    }
    return result.data;
}

export { BRAND };
