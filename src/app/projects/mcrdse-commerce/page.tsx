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
    title: "MCRDSE — E-Commerce & Loyalty Platform",
    description:
        "Case study: A 6-repo Cloudflare edge ecosystem for a functional-mushroom brand — two storefronts, a loyalty program built for correctness under concurrency, and order reconciliation across four external systems.",
    path: "/projects/mcrdse-commerce",
});

export default function MCRDSECommercePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/mcrdse-commerce/#work`,
                name: "MCRDSE — E-Commerce & Loyalty Platform",
                description:
                    "A 6-repo Cloudflare edge ecosystem for a functional-mushroom supplement brand — two storefronts, a loyalty program, and order reconciliation across four external systems.",
                url: `${siteConfig.url}/projects/mcrdse-commerce`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2026-03-01",
                keywords: [
                    "Astro",
                    "Cloudflare",
                    "E-Commerce",
                    "Loyalty Program",
                    "Edge Computing",
                    "D1",
                    "TypeScript",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/mcrdse-commerce/#breadcrumb`,
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
                        name: "MCRDSE Commerce",
                        item: `${siteConfig.url}/projects/mcrdse-commerce`,
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
