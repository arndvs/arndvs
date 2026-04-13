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
    title: "ctrl — AI Agent Infrastructure | Aaron Davis",
    description:
        "Autonomous AI agent infrastructure — synced instructions, skills, and secrets from a single dotfiles repo. One git pull updates every machine.",
    path: "/projects/ctrl",
});

export default function CtrlPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/ctrl/#work`,
                name: "ctrl — AI Agent Infrastructure",
                description:
                    "Autonomous AI agent infrastructure — synced instructions, skills, and secrets from a single dotfiles repo.",
                url: `${siteConfig.url}/projects/ctrl`,
                author: { "@id": `${siteConfig.url}/#person` },
                datePublished: "2025-01-01",
                keywords: [
                    "AI Agents",
                    "Developer Tools",
                    "Dotfiles",
                    "Claude Code",
                    "VS Code Copilot",
                    "Shell Scripts",
                    "Open Source",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/ctrl/#breadcrumb`,
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
                        name: "ctrl",
                        item: `${siteConfig.url}/projects/ctrl`,
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
