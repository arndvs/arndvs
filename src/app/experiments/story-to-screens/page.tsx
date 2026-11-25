import type { Metadata } from "next";

import { ExperimentGuide } from "@/components/experiments/experiment-guide";
import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { JsonLd } from "@/components/json-ld";
import { StoryToScreens } from "@/components/story-to-screens/story-to-screens";
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

const experiment = findExperiment("story-to-screens");
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
            alt: `${experiment.title}: find the missing screen before the code.`,
        },
    ],
});

export default function StoryToScreensPage() {
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

            <ExperimentGuide
                experiment={experiment}
                related={[
                    {
                        label: "ctrl+shft: the UX process as agent skills",
                        href: "/projects/ctrlshft",
                    },
                    { label: "Services for businesses", href: "/services" },
                ]}
            />
        </main>
    );
}
