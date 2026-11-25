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
    "Case study: an AI scribe that drafts a chiropractor's SOAP notes from recorded visits, carries forward what didn't change, and writes into her chart only on her click. TypeScript, Node, MongoDB, a Chrome extension. Synthetic data, not affiliated with Jane App.";

export const metadata: Metadata = generateSiteMetadata({
    title: "SOAP Scribe — An AI Scribe Built for One Practice",
    description: DESCRIPTION,
    path: "/projects/soap-scribe",
    images: [
        {
            url: "/projects/soap-scribe/hero.jpg",
            width: 1200,
            height: 630,
            alt: "SOAP Scribe — a draft note beside the chart",
        },
    ],
});

export default function SoapScribePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/soap-scribe/#work`,
                name: "SOAP Scribe",
                description: DESCRIPTION,
                url: `${siteConfig.url}/projects/soap-scribe`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2026-11-25",
                keywords: [
                    "Applied AI",
                    "AI Scribe",
                    "TypeScript",
                    "Node.js",
                    "MongoDB",
                    "Chrome Extension",
                    "Healthcare",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/soap-scribe/#breadcrumb`,
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
                        name: "SOAP Scribe",
                        item: `${siteConfig.url}/projects/soap-scribe`,
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
                <article className="site-container py-24">
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
