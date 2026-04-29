import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import DesignContent from "./design-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "RipeMetrics — Design Portfolio",
    description:
        "Design case study: 4,666 Figma frames across 9 phases — brand creation, design sprints with 8 designers, 180+ production screens, mobile app, and email design system for an AI-powered customer growth platform.",
    path: "/projects/ripemetrics/design",
});

export default function RipeMetricsDesignPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/ripemetrics/design/#work`,
                name: "RipeMetrics — Design Portfolio",
                description:
                    "Design case study covering brand creation, design system, collaborative sprints, production UI, mobile app, and email design for an AI-powered customer growth platform.",
                url: `${siteConfig.url}/projects/ripemetrics/design`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2017-01-01",
                isPartOf: {
                    "@type": "CreativeWork",
                    "@id": `${siteConfig.url}/projects/ripemetrics/#work`,
                },
                keywords: [
                    "Figma",
                    "UI Design",
                    "UX Design",
                    "Design System",
                    "Design Sprints",
                    "SaaS",
                    "Mobile App",
                    "Brand Identity",
                    "Data Visualization",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/ripemetrics/design/#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Projects",
                        item: `${siteConfig.url}/projects`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "RipeMetrics",
                        item: `${siteConfig.url}/projects/ripemetrics`,
                    },
                    {
                        "@type": "ListItem",
                        position: 4,
                        name: "Design Portfolio",
                        item: `${siteConfig.url}/projects/ripemetrics/design`,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <DesignContent />
        </>
    );
}
