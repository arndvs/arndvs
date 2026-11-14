import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import WorkWithMeContent from "./work-with-me-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Work With Me",
    description:
        "Applied AI full-stack engineer open to full-time and contract roles: applied AI, forward-deployed, and marketing automation engineering. San Diego or remote.",
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
                name: "Work With Me",
                description:
                    "Applied AI full-stack engineer open to full-time and contract roles. San Diego or remote.",
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
