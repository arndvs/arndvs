import type { SanityImageSource } from '@sanity/image-url'
import type { PortableTextBlock } from 'next-sanity'

export type SanityImageWithAlt = SanityImageSource & { alt?: string }

export type ChangelogEntryType = 'feature' | 'improvement' | 'fix' | 'content' | 'infrastructure'

export interface ChangelogEntry {
    _id: string
    title: string
    slug: { current: string }
    date: string
    type: ChangelogEntryType
    summary: string
    body?: PortableTextBlock[]
    relatedProject?: string
    commitHash?: string
    commitRange?: string
    isHighlight?: boolean
    source?: 'manual' | 'automated'
}
