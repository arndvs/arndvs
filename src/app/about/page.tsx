import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import AboutContent from "./about-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "About",
    description:
        "Full-stack engineer based in San Diego with 8+ years of experience. From founding RipeMetrics to building AI-powered platforms — learn about my journey, tech stack, and approach.",
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
                    "Full-stack engineer based in San Diego with 8+ years of experience. From founding RipeMetrics to building AI-powered platforms.",
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
            {
                "@type": "Person",
                "@id": `${siteConfig.url}/#person`,
                name: "Aaron Davis",
                url: siteConfig.url,
                jobTitle: "Full-Stack Software Engineer",
                description:
                    "Self-taught software engineer with 8+ years of experience building AI-powered SaaS platforms.",
                sameAs: ["https://github.com/arndvs", "https://linkedin.com/in/arndvs"],
                knowsAbout: [
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Node.js",
                    "Python",
                    "AI Engineering",
                    "RAG Systems",
                    "OpenAI",
                    "Sanity CMS",
                    "Full-Stack Development",
                ],
                alumniOf: [
                    {
                        "@type": "EducationalOrganization",
                        name: "UC San Diego Extended Studies",
                    },
                    {
                        "@type": "EducationalOrganization",
                        name: "Stanford University Online",
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
            <AboutContent />
        </>
    );
}
