import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { WEEKLY_DIGESTS_QUERY } from "@/sanity/lib/queries";

import { ShippedContent } from "./shipped-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Shipped",
    description:
        "What I shipped this week — weekly development digest tracking commits, projects, and progress.",
    path: "/shipped",
});

export default async function ShippedPage() {
    const { data: digests } = await sanityFetch({ query: WEEKLY_DIGESTS_QUERY });

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "What I Shipped — Weekly Development Digest",
        description:
            "What I shipped this week — weekly development digest tracking commits, projects, and progress.",
        url: `${siteConfig.url}/shipped`,
        inLanguage: "en-US",
        isPartOf: {
            "@type": "WebSite",
            "@id": `${siteConfig.url}/#website`,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: digests.length,
            itemListElement: digests.map(
                (digest: { slug: string; title: string }, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${siteConfig.url}/shipped/${digest.slug}`,
                    name: digest.title,
                }),
            ),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(collectionJsonLd) }}
            />
            <ShippedContent digests={digests} />
        </>
    );
}
