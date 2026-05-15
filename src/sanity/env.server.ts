import "server-only";

import { assertValue } from "./lib/assert-value";

export const token = assertValue(
    process.env.SANITY_API_READ_TOKEN,
    "Missing environment variable: SANITY_API_READ_TOKEN",
);

export const webhookSecret = assertValue(
    process.env.SANITY_WEBHOOK_SECRET,
    "Missing environment variable: SANITY_WEBHOOK_SECRET",
);
