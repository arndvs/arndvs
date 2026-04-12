import { tokens } from '../env'
import { liveClient } from './client'
import { defineLive } from 'next-sanity/live'

const liveConfig = defineLive({
    client: liveClient,
    serverToken: tokens.read,
    browserToken: tokens.read,
})

export const { sanityFetch, SanityLive } = liveConfig
