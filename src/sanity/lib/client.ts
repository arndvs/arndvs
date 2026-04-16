import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, siteConfig } from "../env";

const baseConfig = {
    projectId,
    dataset,
    apiVersion,
    stega: {
        studioUrl: siteConfig.studioUrl,
    },
};

export const client = createClient({
    ...baseConfig,
    useCdn: true,
});

export { baseConfig };
