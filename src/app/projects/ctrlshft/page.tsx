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
    title: "ctrl+shft — AI Agent Infrastructure | Aaron Davis",
    description:
        "Autonomous AI agent infrastructure — 24 skills, lifecycle hooks, compliance HUD, and secrets management from a single dotfiles repo. One git pull updates every machine.",
    path: "/projects/ctrlshft",
});

export default function CtrlShftPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CreativeWork",
                "@id": `${siteConfig.url}/projects/ctrlshft/#work`,
                name: "ctrl+shft — AI Agent Infrastructure",
                description:
                    "Autonomous AI agent infrastructure — 24 skills, lifecycle hooks, compliance HUD, and secrets management from a single dotfiles repo.",
                url: `${siteConfig.url}/projects/ctrlshft`,
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
                    "Compliance",
                    "Observability",
                ],
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${siteConfig.url}/projects/ctrlshft/#breadcrumb`,
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
                        name: "ctrl+shft",
                        item: `${siteConfig.url}/projects/ctrlshft`,
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
