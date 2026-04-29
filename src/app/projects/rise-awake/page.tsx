import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import {
    ArchitectureSection,
    BackButton,
    CTASection,
    DecisionLog,
    DeepDiveSection,
    GallerySection,
    HeroSection,
    LearningsGrid,
    MetricsSection,
    SituationSection,
} from "./components";
import { pageData } from "./data";

export const metadata: Metadata = generateSiteMetadata({
    title: "RISE Awake — Transmedia Corporate Website | Aaron Davis",
    description:
        "A 41-route Next.js 16 application operating as a fictional corporate website — Sanity v5, Convex, Clerk, 22 internal documents, and a transmedia universe connected to the PUSH short film.",
    path: "/projects/rise-awake",
});

export default function RiseAwakePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/rise-awake/#work`,
                name: "RISE Awake — Transmedia Corporate Website",
                description:
                    "A 41-route Next.js 16 application operating as a fictional corporate website — Sanity v5, Convex, Clerk, 22 internal documents, and a transmedia universe.",
                url: `${siteConfig.url}/projects/rise-awake`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2025-01-01",
                keywords: [
                    "Next.js 16",
                    "React 19",
                    "Sanity v5",
                    "Convex",
                    "Clerk",
                    "Transmedia",
                    "Creative Technology",
                    "Full-Stack",
                    "TypeScript",
                    "Corporate Satire",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/rise-awake/#breadcrumb`,
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
                        name: "RISE Awake",
                        item: `${siteConfig.url}/projects/rise-awake`,
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
            <main className="min-h-screen pt-16">
                <article className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <BackButton />
                    <HeroSection data={pageData.hero} />
                    <SituationSection data={pageData.situation} />
                    <ArchitectureSection data={pageData.architecture} />

                    {pageData.deepDives.map((dive) => (
                        <DeepDiveSection key={dive.id} data={dive} />
                    ))}

                    <DecisionLog decisions={pageData.decisions} />
                    <LearningsGrid learnings={pageData.learnings} />
                    <MetricsSection metrics={pageData.metrics} />
                    <GallerySection gallery={pageData.gallery} />
                    <CTASection data={pageData.cta} />
                </article>
            </main>
        </>
    );
}
