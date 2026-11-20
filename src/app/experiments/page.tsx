import { ArrowRight } from "lucide-react";

import type { Metadata } from "next";
import Link from "next/link";

import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { EXPERIMENTS } from "@/lib/data/experiments";
import { generateSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateSiteMetadata({
    title: "Experiments",
    description:
        "Interactive tools that show how the numbers behind AI systems work: cost, latency, scale, and the trade-offs between them.",
    path: "/experiments",
});

export default function ExperimentsPage() {
    return (
        <main className="min-h-screen">
            <ExperimentHero
                backdrop="LAB"
                eyebrow="Experiments"
                title={
                    <>
                        Show the <span className="text-gradient">math</span>
                    </>
                }
            >
                <p>
                    Interactive tools that show how the numbers behind AI systems work. Change any
                    input and every result explains itself.
                </p>
            </ExperimentHero>

            <section className="px-6 pb-24 lg:px-12 lg:pb-32 xl:px-20">
                <ul className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
                    {EXPERIMENTS.map((experiment) => (
                        <li key={experiment.slug}>
                            <Link
                                href={`/experiments/${experiment.slug}`}
                                className="group bg-card border-border hover:border-primary/50 focus-visible:ring-ring/50 block h-full rounded-xl border p-6 transition-colors outline-none focus-visible:ring-[3px] lg:p-8"
                            >
                                <h2 className="font-display group-hover:text-primary text-3xl font-bold tracking-tight transition-colors lg:text-4xl">
                                    {experiment.title}
                                </h2>
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                    {experiment.description}
                                </p>
                                <span className="text-muted-foreground group-hover:text-primary mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                                    Open the experiment
                                    <ArrowRight
                                        aria-hidden="true"
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
