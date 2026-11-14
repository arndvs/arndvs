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

const DESCRIPTION =
    "Case study: a Braze first-reward journey built end to end as a work sample. A Snowflake data contract, a Canvas, Liquid that stops itself when the data is wrong, and a Rails outbox. Fictional data, not affiliated with inKind.";

export const metadata: Metadata = generateSiteMetadata({
    title: "First-Reward Journey — Lifecycle Marketing Work Sample",
    description: DESCRIPTION,
    path: "/projects/inkind-first-reward-journey",
    images: [
        {
            url: "/og/inkind-first-reward-journey.jpg",
            width: 1200,
            height: 630,
            alt: "First-Reward Journey — lifecycle marketing work sample",
        },
    ],
});

export default function InkindFirstRewardJourneyPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/inkind-first-reward-journey/#work`,
                name: "First-Reward Journey",
                description: DESCRIPTION,
                url: `${siteConfig.url}/projects/inkind-first-reward-journey`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2026-11-13",
                keywords: [
                    "Braze",
                    "Lifecycle Marketing",
                    "Marketing Automation",
                    "Liquid",
                    "Snowflake",
                    "Cloud Data Ingestion",
                    "Ruby on Rails",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/inkind-first-reward-journey/#breadcrumb`,
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
                        name: "First-Reward Journey",
                        item: `${siteConfig.url}/projects/inkind-first-reward-journey`,
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
