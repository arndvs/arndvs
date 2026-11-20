import type { Metadata } from "next";

import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { ReviewCapacityEstimator } from "@/components/review-capacity/review-capacity-estimator";
import { findExperiment } from "@/lib/data/experiments";
import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

const experiment = findExperiment("review-capacity");

export const metadata: Metadata = generateSiteMetadata({
    title: experiment.title,
    description: experiment.description,
    path: `/experiments/${experiment.slug}`,
});

export default function ReviewCapacityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/experiments/${experiment.slug}/#app`,
        name: experiment.title,
        description: experiment.description,
        url: `${siteConfig.url}/experiments/${experiment.slug}`,
        applicationCategory: "DeveloperApplication",
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
                backdrop="REVIEW"
                eyebrow="Experiment · Review capacity"
                title={
                    <>
                        Keep up with <span className="text-gradient">the agents</span>
                    </>
                }
            >
                <p>
                    Parallel agents open code faster than one person can read it. Set how many run,
                    how much they open, and how much a good review sitting covers. The result shows
                    how many agents you can keep fully reviewed, and the math behind it.
                </p>
            </ExperimentHero>

            <section className="px-6 pb-24 lg:px-12 lg:pb-32 xl:px-20">
                <div className="mx-auto max-w-7xl">
                    <ReviewCapacityEstimator />
                </div>
            </section>
        </main>
    );
}
