import { defineLive } from "next-sanity/live";

import { tokens } from "../env";
import { liveClient } from "./client";

const liveConfig = defineLive({
    client: liveClient,
    serverToken: tokens.read,
    browserToken: tokens.read,
});

export const { sanityFetch, SanityLive } = liveConfig;
