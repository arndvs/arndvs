import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import WorkWithMeContent from "./work-with-me-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Work With Me",
    description:
        "AI agent systems built for your business — discovery, architecture, implementation, and ongoing tuning. Also taking full-stack development projects.",
    path: "/work-with-me",
});

export default function WorkWithMePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${siteConfig.url}/work-with-me/#webpage`,
                url: `${siteConfig.url}/work-with-me`,
                name: "Work With Me — Aaron Davis",
                description:
                    "AI agent systems built for your business — discovery, architecture, implementation, and ongoing tuning.",
                isPartOf: { "@id": `${siteConfig.url}/#website` },
                breadcrumb: { "@id": `${siteConfig.url}/work-with-me/#breadcrumb` },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/work-with-me/#breadcrumb`,
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
                        name: "Work With Me",
                        item: `${siteConfig.url}/work-with-me`,
                    },
                ],
            },
            {
                "@type": "Service",
                "@id": `${siteConfig.url}/work-with-me/#service`,
                name: "AI Agent Systems Consulting",
                provider: { "@id": `${siteConfig.url}/#person` },
                description:
                    "Bespoke AI agent system design and implementation — specialist architectures tuned to how your business actually works.",
                serviceType: "AI Systems Consulting",
                url: `${siteConfig.url}/work-with-me`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <WorkWithMeContent />
        </>
    );
}
