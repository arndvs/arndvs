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
    title: "Align San Diego Family Chiropractic",
    description:
        "Case study: A 44,000-line healthcare platform with 5 AI integrations, 81 JSON-LD schemas, programmatic SEO across 158 pages, built on Next.js 16 and Sanity v5.",
    path: "/projects/align-san-diego-family-chiropractic",
});

export default function AlignSDPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/align-san-diego-family-chiropractic/#work`,
                name: "Align San Diego Family Chiropractic",
                description:
                    "A 44,000-line healthcare platform with 5 AI integrations, 81 JSON-LD schemas, programmatic SEO across 158 pages.",
                url: `${siteConfig.url}/projects/align-san-diego-family-chiropractic`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2025-01-01",
                keywords: [
                    "Next.js",
                    "Sanity CMS",
                    "AI Integration",
                    "Healthcare",
                    "Programmatic SEO",
                    "JSON-LD",
                    "TypeScript",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/align-san-diego-family-chiropractic/#breadcrumb`,
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
                        name: "Align San Diego",
                        item: `${siteConfig.url}/projects/align-san-diego-family-chiropractic`,
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
                <article className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
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
