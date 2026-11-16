import type { Metadata } from "next";

import { personJsonLd } from "@/lib/data/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import AboutContent from "./about-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "About",
    description:
        "Applied AI full-stack engineer in San Diego. A decade in payments and loyalty programs, 8 years building RipeMetrics, and now AI systems and lifecycle marketing infrastructure. Background, stack, and certifications.",
    path: "/about",
});

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": `${siteConfig.url}/about/#webpage`,
                url: `${siteConfig.url}/about`,
                name: "About Aaron Davis",
                description:
                    "Applied AI full-stack engineer in San Diego. A decade in payments and loyalty programs, 8 years building RipeMetrics, and now AI systems and lifecycle marketing infrastructure.",
                isPartOf: { "@id": `${siteConfig.url}/#website` },
                breadcrumb: { "@id": `${siteConfig.url}/about/#breadcrumb` },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/about/#breadcrumb`,
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
                        name: "About",
                        item: `${siteConfig.url}/about`,
                    },
                ],
            },
            personJsonLd,
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <AboutContent />
        </>
    );
}
