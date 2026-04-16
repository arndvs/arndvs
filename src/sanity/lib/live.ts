import { defineLive } from "next-sanity/live";

import { token } from "../env";
import { liveClient } from "./client";

const liveConfig = defineLive({
    client: liveClient,
    serverToken: token,
});

export const { sanityFetch, SanityLive } = liveConfig;
