import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import { RESULTS_PAGE } from "./data";
import ResultsContent from "./results-content";

const description =
    "Measured results from Aaron Davis's recent work for a San Diego clinic, a direct-to-consumer brand, and RipeMetrics, with testimonials from people who worked with him.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Results",
    description,
    path: "/results",
});

export default function ResultsPage() {
    // WebPage only. No Review markup: self-serving reviews are against search guidelines.
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${siteConfig.url}/results/#webpage`,
                url: `${siteConfig.url}/results`,
                name: "Results",
                description,
                isPartOf: { "@id": `${siteConfig.url}/#website` },
                about: { "@id": `${siteConfig.url}/#person` },
                breadcrumb: { "@id": `${siteConfig.url}/results/#breadcrumb` },
                hasPart: RESULTS_PAGE.clients.map((client) => ({
                    "@type": "CreativeWork",
                    name: client.name,
                    url: `${siteConfig.url}${client.caseStudyHref}`,
                })),
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/results/#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Results",
                        item: `${siteConfig.url}/results`,
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
            <ResultsContent />
        </>
    );
}
