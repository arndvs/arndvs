import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

import { BlogListContent } from "./blog-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Blog",
    description:
        "Technical articles on Sanity CMS, Next.js, AI engineering, and modern web development by Aaron Davis.",
    path: "/blog",
});

export default async function BlogPage() {
    const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Blog",
        description:
            "Technical articles on Sanity CMS, Next.js, AI engineering, and modern web development by Aaron Davis.",
        url: `${siteConfig.url}/blog`,
        inLanguage: "en-US",
        isPartOf: {
            "@type": "WebSite",
            "@id": `${siteConfig.url}/#website`,
        },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map(
                (post: { slug: string; title: string }, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${siteConfig.url}/blog/${post.slug}`,
                    name: post.title,
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
            <BlogListContent posts={posts} />
        </>
    );
}
