import "server-only";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) throw new Error(errorMessage);

    if (typeof v === "string" && v.trim().length === 0) throw new Error(errorMessage);

    return v;
}

export const token = assertValue(
    process.env.SANITY_API_READ_TOKEN,
    "Missing environment variable: SANITY_API_READ_TOKEN",
);

export const webhookSecret = assertValue(
    process.env.SANITY_WEBHOOK_SECRET,
    "Missing environment variable: SANITY_WEBHOOK_SECRET",
);
