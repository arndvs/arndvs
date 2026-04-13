import type { Metadata } from "next";

import { siteConfig } from "@/sanity/env";

interface SiteMetadataOptions {
    title: string;
    description: string;
    path: string;
    images?: { url: string; width: number; height: number; alt: string }[];
    robots?: Metadata["robots"];
    canonical?: string;
    type?: "website" | "article";
    publishedTime?: string;
    authors?: string[];
}

const defaultOgImage = {
    url: "/images/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Aaron Davis - Full Stack Software Engineer",
};

export function generateSiteMetadata({
    title,
    description,
    path,
    images,
    robots,
    canonical,
    type = "website",
    publishedTime,
    authors,
}: SiteMetadataOptions): Metadata {
    const url = `${siteConfig.url}${path}`;
    const resolvedCanonical = canonical ?? path;
    const resolvedImages = images ?? [defaultOgImage];

    return {
        title,
        description,
        alternates: {
            canonical: resolvedCanonical,
            types: {
                "application/rss+xml": "/blog/feed.xml",
            },
        },
        openGraph: {
            title,
            description,
            type,
            url,
            siteName: "Aaron Davis Portfolio",
            locale: "en_US",
            images: resolvedImages,
            ...(publishedTime && { publishedTime }),
            ...(authors && { authors }),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: resolvedImages.map((img) => img.url),
        },
        robots: robots ?? {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
    };
}
