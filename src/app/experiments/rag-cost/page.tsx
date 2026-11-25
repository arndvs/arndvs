import type { Metadata } from "next";

import { ExperimentGuide } from "@/components/experiments/experiment-guide";
import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { JsonLd } from "@/components/json-ld";
import { RagCostEstimator } from "@/components/rag-cost/rag-cost-estimator";
import { findExperiment } from "@/lib/data/experiments";
import {
    absolute,
    breadcrumbList,
    faqPage,
    graph,
    softwareApplication,
    webPage,
} from "@/lib/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";
import {
    MODEL_CATALOG,
    decisionModel,
    generationModels,
    nonEmpty,
} from "@/lib/rag-cost/model-pricing";
import type { ModelPricing } from "@/lib/rag-cost/model-pricing";

const experiment = findExperiment("rag-cost");
const path = `/experiments/${experiment.slug}`;

export const metadata: Metadata = generateSiteMetadata({
    title: experiment.seoTitle,
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

    return (
        <main className="min-h-screen">
            <JsonLd
                data={graph(
                    webPage({
                        path,
                        name: experiment.seoTitle,
                        description: experiment.description,
                        extra: { mainEntity: { "@id": `${absolute(path)}/#app` } },
                    }),
                    softwareApplication({
                        path,
                        name: experiment.title,
                        description: experiment.description,
                        applicationCategory: experiment.applicationCategory,
                    }),
                    faqPage(path, experiment.faqs),
                    breadcrumbList(path, [
                        { name: "Experiments", path: "/experiments" },
                        { name: experiment.title, path },
                    ]),
                )}
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

            <section className="pb-24 lg:pb-32">
                <div className="site-container">
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

            <ExperimentGuide
                experiment={experiment}
                related={[
                    { label: "AI development services", href: "/services/ai-development" },
                    {
                        label: "RipeMetrics: a production RAG pipeline",
                        href: "/projects/ripemetrics",
                    },
                ]}
            />
        </main>
    );
}
