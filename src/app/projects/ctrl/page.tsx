import type { Metadata } from "next"
import { pageData } from "./data"
import {
    BackButton,
    HeroSection,
    SituationSection,
    ArchitectureSection,
    DeepDiveSection,
    DecisionLog,
    LearningsGrid,
    MetricsSection,
    GallerySection,
    CTASection,
} from "./components"

export const metadata: Metadata = {
    title: "ctrl — AI Agent Infrastructure | Aaron Davis",
    description:
        "Autonomous AI agent infrastructure — synced instructions, skills, and secrets from a single dotfiles repo. One git pull updates every machine.",
}

export default function CtrlPage() {
    return (
        <main className="min-h-screen pt-16">
            <article className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
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
    )
}
