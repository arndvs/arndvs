import type { Metadata } from "next";

import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import ProjectsContent from "./projects-content";

export const metadata: Metadata = generateSiteMetadata({
    title: "Projects",
    description:
        "Case studies and portfolio projects showcasing AI-powered platforms, full-stack web applications, and modern user experiences built with React, Next.js, and TypeScript.",
    path: "/projects",
});

const projects = [
    {
        name: "Align San Diego Family Chiropractic",
        url: `${siteConfig.url}/projects/align-san-diego-family-chiropractic`,
    },
    {
        name: "ctrl+shft — AI Agent Infrastructure",
        url: `${siteConfig.url}/projects/ctrlshft`,
    },
    {
        name: "RipeMetrics",
        url: `${siteConfig.url}/projects/ripemetrics`,
    },
];

export default function ProjectsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/projects/#webpage`,
        name: "Projects",
        description:
            "Case studies and portfolio projects showcasing AI-powered platforms, full-stack web applications, and modern user experiences.",
        url: `${siteConfig.url}/projects`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: projects.length,
            itemListElement: projects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.name,
                url: project.url,
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <ProjectsContent />
        </>
    );
}
