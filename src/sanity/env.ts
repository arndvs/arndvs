export const apiVersion = assertValue(
    process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    'Missing environment variable: NEXT_PUBLIC_SANITY_API_VERSION'
)

export const dataset = assertValue(
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const tokens = {
    read: process.env.SANITY_API_READ_TOKEN,
    write: process.env.SANITY_API_TOKEN,
} as const

export const siteConfig = {
    url: assertValue(
        process.env.NEXT_PUBLIC_SITE_URL,
        'Missing environment variable: NEXT_PUBLIC_SITE_URL'
    ),
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '/studio',
} as const

function assertValue<T>(v: T | undefined, errorMessage: string): T {
    if (v === undefined)
        throw new Error(errorMessage)

    return v
}
