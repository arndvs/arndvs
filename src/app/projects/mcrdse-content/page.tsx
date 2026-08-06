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
    title: "MCRDSE — Content & Community Platform",
    description:
        "Case study: A content approval-and-shipping worker with cryptographic approval locking, an educational community site with a branching archetype quiz, and a forward-looking AI-search (GEO) strategy.",
    path: "/projects/mcrdse-content",
});

export default function MCRDSEContentPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/mcrdse-content/#work`,
                name: "MCRDSE — Content & Community Platform",
                description:
                    "A content approval-and-shipping worker with cryptographic approval locking, an educational community site with a branching archetype quiz, and an AI-search (GEO) strategy.",
                url: `${siteConfig.url}/projects/mcrdse-content`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2026-04-01",
                keywords: [
                    "Cloudflare",
                    "Content Operations",
                    "Approval Workflow",
                    "GEO",
                    "AI-Search",
                    "Astro",
                    "TypeScript",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/mcrdse-content/#breadcrumb`,
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
                        name: "MCRDSE Content",
                        item: `${siteConfig.url}/projects/mcrdse-content`,
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
