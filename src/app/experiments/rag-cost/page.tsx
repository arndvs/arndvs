import type { Metadata } from "next";

import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { RagCostEstimator } from "@/components/rag-cost/rag-cost-estimator";
import { findExperiment } from "@/lib/data/experiments";
import { generateSiteMetadata } from "@/lib/metadata";
import {
    MODEL_CATALOG,
    decisionModel,
    generationModels,
    nonEmpty,
} from "@/lib/rag-cost/model-pricing";
import type { ModelPricing } from "@/lib/rag-cost/model-pricing";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

const experiment = findExperiment("rag-cost");

export const metadata: Metadata = generateSiteMetadata({
    title: experiment.title,
    description: experiment.description,
    path: `/experiments/${experiment.slug}`,
    images: [
        {
            url: experiment.shareImage,
            width: 1200,
            height: 630,
            alt: `${experiment.title}: pull a lever, watch the bill shrink.`,
        },
    ],
});

/** The course's example pairing. If either is removed, the first and last models stand in. */
const DEFAULT_MAIN_MODEL_ID = "claude-sonnet-5-5";
const DEFAULT_ROUTED_MODEL_ID = "claude-haiku-4-5";

export default function RagCostPage() {
    const models = nonEmpty(generationModels(MODEL_CATALOG), "generation model");
    const pick = (id: string, fallback: ModelPricing): string =>
        (models.find((model) => model.id === id) ?? fallback).id;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "@id": `${siteConfig.url}/experiments/${experiment.slug}/#app`,
        name: experiment.title,
        description: experiment.description,
        url: `${siteConfig.url}/experiments/${experiment.slug}`,
        applicationCategory: "BusinessApplication",
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
                backdrop="COST"
                compact
                eyebrow="Experiment · Cost, latency, and scale"
                title={
                    <>
                        Make the bill <span className="text-gradient">make sense</span>
                    </>
                }
            >
                <p>
                    Model a retrieval-augmented chatbot at production scale. Change the traffic, the
                    context, the caching, and the routing, and see what drives the monthly bill, how
                    much each lever saves, and where the math comes from.
                </p>
            </ExperimentHero>

            <section className="px-6 pb-24 lg:px-12 lg:pb-32 xl:px-20">
                <div className="mx-auto max-w-7xl">
                    <RagCostEstimator
                        models={models}
                        decisionModel={decisionModel(MODEL_CATALOG)}
                        updated={MODEL_CATALOG.updated}
                        defaultMainModelId={pick(DEFAULT_MAIN_MODEL_ID, models[0])}
                        defaultRoutedModelId={pick(
                            DEFAULT_ROUTED_MODEL_ID,
                            models.at(-1) ?? models[0],
                        )}
                    />
                </div>
            </section>
        </main>
    );
}
