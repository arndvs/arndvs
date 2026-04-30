import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import RipeMetricsContent from "./ripemetrics-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "RipeMetrics",
    description:
        "Case study: AI-native customer growth platform spanning 8 repositories — 880+ components, production RAG pipeline with dual-LLM failover across chat, SMS, email, and voice.",
    path: "/projects/ripemetrics",
});

export default function RipeMetricsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/ripemetrics/#work`,
                name: "RipeMetrics",
                description:
                    "AI-native customer growth platform spanning 8 repositories — 880+ components, production RAG pipeline with multi-channel AI service.",
                url: `${siteConfig.url}/projects/ripemetrics`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2017-01-01",
                keywords: [
                    "React",
                    "Next.js",
                    "TypeScript",
                    "AI",
                    "OpenAI",
                    "SaaS",
                    "Enterprise",
                    "Customer Growth",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/ripemetrics/#breadcrumb`,
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
            <RipeMetricsContent />
        </>
    );
}
