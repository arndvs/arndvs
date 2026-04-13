import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Returns a Sanity client with write permissions.
 * Only call from server-side API routes — never expose to the browser.
 * Throws if SANITY_API_TOKEN is not set.
 */
export function getWriteClient() {
    const token = process.env.SANITY_API_TOKEN;

    if (!token) throw new Error("Missing environment variable: SANITY_API_TOKEN");

    return createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token,
    });
}
