import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

const baseConfig = {
    projectId,
    dataset,
    apiVersion,
    stega: {
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio",
    },
};

export const client = createClient({
    ...baseConfig,
    useCdn: true,
});

export const liveClient = createClient({
    ...baseConfig,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
});
