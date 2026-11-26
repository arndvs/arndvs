import type { MetadataRoute } from "next";

import { siteConfig } from "@/sanity/env";

/**
 * AI search and assistant crawlers, named so the intent is explicit: these fetch pages to
 * answer questions and cite sources, and the portfolio wants to be cited. The `*` rule
 * already allows them; naming them also keeps them allowed if `*` is ever tightened.
 */
export const AI_SEARCH_BOTS = [
    "OAI-SearchBot",
    "ChatGPT-User",
    "GPTBot",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
] as const;

// /ops and /login carry noindex instead: a disallow would hide that tag from crawlers.
const PRIVATE_PATHS = ["/studio", "/api/*"];

export default function robots(): MetadataRoute.Robots {
    // Vercel preview and development deployments must never be indexed.
    const env = process.env.VERCEL_ENV;
    if (env && env !== "production") {
        return { rules: { userAgent: "*", disallow: "/" } };
    }

    return {
        rules: [
            { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
            { userAgent: [...AI_SEARCH_BOTS], allow: "/", disallow: PRIVATE_PATHS },
        ],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    };
}
