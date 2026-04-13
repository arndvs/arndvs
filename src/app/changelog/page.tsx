import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { CHANGELOG_QUERY } from '@/sanity/lib/queries'
import { safeJsonLdStringify } from '@/lib/utils/safe-json-ld'
import { siteConfig } from '@/sanity/env'
import { ChangelogContent } from './changelog-content'

export const metadata: Metadata = {
    title: 'Changelog',
    description:
        'What\'s new on arndvs.com — features, improvements, fixes, and infrastructure updates.',
    alternates: {
        canonical: '/changelog',
        types: {
            'application/rss+xml': '/changelog/feed.xml',
        },
    },
}

export default async function ChangelogPage() {
    const { data: entries } = await sanityFetch({ query: CHANGELOG_QUERY })

    const collectionJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Changelog',
        description: 'What\'s new on arndvs.com — features, improvements, fixes, and infrastructure updates.',
        url: `${siteConfig.url}/changelog`,
        inLanguage: 'en-US',
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${siteConfig.url}/#website`,
        },
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: entries.length,
            itemListElement: entries.map((entry: { title: string; date: string }, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: entry.title,
            })),
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(collectionJsonLd) }}
            />
            <ChangelogContent entries={entries} />
        </>
    )
}
