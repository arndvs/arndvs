import { apiVersion, dataset, projectId } from '../env'
import { createClient } from 'next-sanity'

const baseConfig = {
    projectId,
    dataset,
    apiVersion,
    stega: {
        studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio',
    },
}

export const client = createClient({
    ...baseConfig,
    useCdn: true,
})

export const writeClient = createClient({
    ...baseConfig,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

export const liveClient = createClient({
    ...baseConfig,
    useCdn: true,
    token: process.env.SANITY_API_READ_TOKEN,
})
