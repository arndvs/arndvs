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
    ProductionProgress,
    SituationSection,
} from "./components";
import { pageData } from "./data";

export const metadata: Metadata = generateSiteMetadata({
    title: "PUSH — AI Video Short Film (In Progress)",
    description:
        "A comedy short being produced with AI generative video — currently in pre-production with a 55-shot prompt library, character consistency pipeline, and companion transmedia universe.",
    path: "/projects/push",
});

export default function PushPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/push/#work`,
                name: "PUSH — AI Video Short Film (In Progress)",
                description:
                    "A comedy short being produced with AI generative video — currently in pre-production with a 55-shot prompt library, character consistency pipeline, and companion transmedia universe.",
                url: `${siteConfig.url}/projects/push`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2025-01-01",
                keywords: [
                    "AI Video",
                    "Short Film",
                    "Sora",
                    "Runway",
                    "Kling",
                    "Creative Technology",
                    "Transmedia",
                    "Production Design",
                    "Character Consistency",
                    "Screenwriting",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/push/#breadcrumb`,
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
                        name: "PUSH",
                        item: `${siteConfig.url}/projects/push`,
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
                    <ProductionProgress />
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
