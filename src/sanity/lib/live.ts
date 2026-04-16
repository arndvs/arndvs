import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

import { token } from "../env.server";
import { baseConfig } from "./client";

const liveClient = createClient({
    ...baseConfig,
    useCdn: false,
    token,
});

const liveConfig = defineLive({
    client: liveClient,
    serverToken: token,
});

export const { sanityFetch, SanityLive } = liveConfig;
