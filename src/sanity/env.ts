export const apiVersion = assertValue(
    process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    "Missing environment variable: NEXT_PUBLIC_SANITY_API_VERSION",
);

export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const token = assertValue(
    process.env.SANITY_API_READ_TOKEN,
    "Missing environment variable: SANITY_API_READ_TOKEN",
);

export const webhookSecret = assertValue(
    process.env.SANITY_WEBHOOK_SECRET,
    "Missing environment variable: SANITY_WEBHOOK_SECRET",
);

export const siteConfig = {
    url: assertValue(
        process.env.NEXT_PUBLIC_SITE_URL,
        "Missing environment variable: NEXT_PUBLIC_SITE_URL",
    ),
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "/studio",
} as const;

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined) throw new Error(errorMessage);

    if (typeof v === "string" && v.trim().length === 0) throw new Error(errorMessage);

    return v;
}
