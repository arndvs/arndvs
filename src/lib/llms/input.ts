import { PUBLISHED_TESTIMONIALS, RESULTS_PAGE } from "@/app/results/data";
import { TALKS } from "@/app/speaking/data";
import { EXPERIMENTS } from "@/lib/data/experiments";
import { siteConfig } from "@/sanity/env";
import { client } from "@/sanity/lib/client";
import { LLMS_POSTS_QUERY } from "@/sanity/lib/queries";

import type { LlmsInput, LlmsPost } from "./build";
import { listedCaseStudies } from "./sources";

/** Gathers everything the llms files describe. Posts come from Sanity; the rest is code. */
export async function loadLlmsInput(): Promise<LlmsInput> {
    let posts: LlmsPost[] = [];
    try {
        posts = await client.fetch(LLMS_POSTS_QUERY);
    } catch (error) {
        // The file still describes the projects and results if Sanity is unreachable.
        console.error("llms.txt: failed to fetch posts", error);
    }
    return {
        siteUrl: siteConfig.url,
        caseStudies: listedCaseStudies(),
        experiments: EXPERIMENTS,
        posts,
        clients: RESULTS_PAGE.clients,
        results: RESULTS_PAGE.results,
        testimonials: PUBLISHED_TESTIMONIALS,
        talks: TALKS,
        generatedOn: new Date().toISOString().slice(0, 10),
    };
}

export const LLMS_HEADERS = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
    "X-Robots-Tag": "noindex",
} as const;
