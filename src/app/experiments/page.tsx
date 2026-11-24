import { ArrowRight } from "lucide-react";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ExperimentHero } from "@/components/experiments/experiment-hero";
import { EXPERIMENTS } from "@/lib/data/experiments";
import { generateSiteMetadata } from "@/lib/metadata";

const INTRO =
    "Small interactive tools I've built to answer specific questions about what AI costs, how coding agents work, and how products get designed.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Experiments",
    description: INTRO,
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
                        Small tools, <span className="text-gradient">specific questions</span>
                    </>
                }
            >
                <p>{INTRO}</p>
            </ExperimentHero>

            <section className="pb-24 lg:pb-32">
                <ul className="site-container grid gap-6 md:grid-cols-2">
                    {EXPERIMENTS.map((experiment) => (
                        <li key={experiment.slug}>
                            <Link
                                href={`/experiments/${experiment.slug}`}
                                className="group bg-card border-border hover:border-primary/50 focus-visible:ring-ring/50 block h-full overflow-hidden rounded-xl border transition-colors outline-none focus-visible:ring-[3px]"
                            >
                                <div className="border-border overflow-hidden border-b">
                                    <Image
                                        src={experiment.image.src}
                                        alt={experiment.image.alt}
                                        width={2400}
                                        height={1350}
                                        sizes="(min-width: 768px) 50vw, 100vw"
                                        className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>
                                <div className="p-6 lg:p-8">
                                    <h2 className="font-display group-hover:text-signal text-3xl font-bold tracking-tight transition-colors lg:text-4xl">
                                        {experiment.title}
                                    </h2>
                                    <p className="text-muted-foreground mt-4 leading-relaxed">
                                        {experiment.description}
                                    </p>
                                    <span className="text-muted-foreground group-hover:text-signal mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                                        Open the experiment
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        />
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
