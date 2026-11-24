import type { Metadata } from "next";

import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { StoryToScreens } from "@/components/story-to-screens/story-to-screens";
import { findExperiment } from "@/lib/data/experiments";
import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

const experiment = findExperiment("story-to-screens");

export const metadata: Metadata = generateSiteMetadata({
    title: experiment.title,
    description: experiment.description,
    path: `/experiments/${experiment.slug}`,
    images: [
        {
            url: experiment.shareImage,
            width: 1200,
            height: 630,
            alt: `${experiment.title}: find the missing screen before the code.`,
        },
    ],
});

export default function StoryToScreensPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/experiments/${experiment.slug}/#app`,
        name: experiment.title,
        description: experiment.description,
        url: `${siteConfig.url}/experiments/${experiment.slug}`,
        applicationCategory: "DesignApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": `${siteConfig.url}/#person` },
        isPartOf: { "@id": `${siteConfig.url}/#website` },
    };

    return (
        <main className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <ExperimentHero
                backdrop="FLOW"
                compact
                eyebrow="Experiment · UX process"
                title={
                    <>
                        Find the missing screen{" "}
                        <span className="text-gradient">before the code</span>
                    </>
                }
            >
                <p>
                    Write what people do today. Mark the things and the actions. The rules from my
                    UX process turn that into a screen list, then walk the stories through it and
                    show what a first pass would have missed.
                </p>
            </ExperimentHero>

            <section className="pb-24 lg:pb-32">
                <div className="site-container">
                    <StoryToScreens />
                </div>
            </section>
        </main>
    );
}
