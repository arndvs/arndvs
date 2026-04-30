"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

import { HeroSection, PhaseNav, PhaseSection, useScrollSpy } from "./design-components";
import { designPageData } from "./design-data";

const phaseIds = designPageData.phases.map((p) => p.id);

export default function DesignContent() {
    const activePhaseId = useScrollSpy(phaseIds);
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <main className="min-h-screen pt-16">
            <HeroSection data={designPageData.hero} />

            <PhaseNav phases={designPageData.phases} activePhaseId={activePhaseId} />

            {designPageData.phases.map((phase) => (
                <PhaseSection key={phase.id} phase={phase} />
            ))}

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
            >
                <motion.div
                    variants={itemVariants}
                    className="border-border bg-card mx-auto max-w-2xl rounded-2xl border p-8 text-center"
                >
                    <h2 className="text-2xl font-bold tracking-tight">See How It Was Built</h2>
                    <p className="text-muted-foreground mt-3">
                        Explore the engineering decisions behind these designs — from Laravel→React
                        migration to multi-tenant RAG architecture.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Button asChild>
                            <Link href="/projects/ripemetrics">
                                Engineering Case Study
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/projects">All Projects</Link>
                        </Button>
                    </div>
                </motion.div>
            </motion.section>
        </main>
    );
}
