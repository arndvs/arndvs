import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/live";
import { WEEKLY_DIGEST_QUERY, WEEKLY_DIGEST_SLUGS_QUERY } from "@/sanity/lib/queries";

import { ShippedDetailContent } from "./shipped-detail-content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
    const { data: slugs } = await sanityFetch({
        query: WEEKLY_DIGEST_SLUGS_QUERY,
        perspective: "published",
        stega: false,
    });

    return (slugs || []).map((slug: string) => ({ slug }));
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const { slug } = await props.params;
    const { data: digest } = await sanityFetch({
        query: WEEKLY_DIGEST_QUERY,
        params: { slug },
        stega: false,
    });

    if (!digest) return {};

    return generateSiteMetadata({
        title: digest.title ?? "Weekly Digest",
        description: digest.excerpt ?? "Weekly development digest — what I shipped this week.",
        path: `/shipped/${slug}`,
        type: "article",
        publishedTime: digest.publishedAt ?? undefined,
        authors: ["Aaron Davis"],
    });
}

export default async function ShippedDetailPage(props: { params: Params }) {
    const { slug } = await props.params;
    const { data: digest } = await sanityFetch({
        query: WEEKLY_DIGEST_QUERY,
        params: { slug },
    });

    if (!digest) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: digest.title,
        description: digest.excerpt ?? "",
        url: `${siteConfig.url}/shipped/${slug}`,
        datePublished: digest.publishedAt ?? undefined,
        dateModified: digest._updatedAt ?? digest.publishedAt ?? undefined,
        inLanguage: "en-US",
        author: {
            "@type": "Person",
            "@id": `${siteConfig.url}/#person`,
            name: "Aaron Davis",
        },
        publisher: {
            "@type": "Person",
            "@id": `${siteConfig.url}/#person`,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/shipped/${slug}`,
        },
        ...(digest.tags?.length ? { keywords: digest.tags.join(", ") } : {}),
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.url,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Shipped",
                item: `${siteConfig.url}/shipped`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: digest.title,
                item: `${siteConfig.url}/shipped/${slug}`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd) }}
            />
            <ShippedDetailContent digest={digest} />
        </>
    );
}
