import { BRAND } from "./brand";
import { loadEnv } from "./env";

/**
 * Composed application config.
 *
 * Lifted from Launch Core's `app.ts` pattern: a single structured config object
 * consumed everywhere. Never read `process.env` in app code. `typeof config`
 * keeps types in sync with defaults.
 */
const env = loadEnv();

export const config = {
    branding: {
        appName: BRAND.appName,
        slug: BRAND.slug,
        appUrl: BRAND.appUrl,
        supportEmail: BRAND.supportEmail,
        jobTitle: BRAND.jobTitle,
        social: BRAND.social,
    },
    sanity: {
        projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
        siteUrl: env.NEXT_PUBLIC_SITE_URL,
        readToken: env.SANITY_API_READ_TOKEN,
        writeToken: env.SANITY_API_TOKEN,
        webhookSecret: env.SANITY_WEBHOOK_SECRET,
    },
    features: {
        enableContentShip: env.ENABLE_CONTENT_SHIP,
        enableCommentScout: env.ENABLE_COMMENT_SCOUT,
        enableAi: env.ENABLE_AI,
        enableSanityStudio: env.ENABLE_SANITY_STUDIO,
        enableAnalytics: env.ENABLE_ANALYTICS,
    },
    ai: {
        openaiApiKey: env.OPENAI_API_KEY,
        model: "gpt-4o",
    },
    auth: {
        secret: env.BETTER_AUTH_SECRET,
        baseUrl: env.BETTER_AUTH_URL,
    },
} as const;

export type AppConfig = typeof config;
