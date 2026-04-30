import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import WorkWithMeContent from "./work-with-me-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Work With Me",
    description:
        "Full-stack engineer available for contract and full-time roles. 15+ years building for the web — from WordPress to React to AI-powered platforms.",
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
                    "Full-stack engineer available for contract and full-time roles. 15+ years building for the web.",
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
                name: "Full-Stack Engineering & AI Integration",
                provider: { "@id": `${siteConfig.url}/#person` },
                description:
                    "Production web applications, AI integrations, and full-stack platforms from a senior engineer with 15+ years building for the web.",
                serviceType: "Software Engineering",
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
