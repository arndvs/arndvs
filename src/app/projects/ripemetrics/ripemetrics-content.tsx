"use client";

import { ArrowRight, Palette } from "lucide-react";

import Link from "next/link";

import {
    AchievementsSection,
    ArchitectureDiagram,
    ChallengeSection,
    ConclusionSection,
    DecisionLog,
    DeepDiveSection,
    HeaderSection,
    ImpactSection,
    LearningsGrid,
    OverviewSection,
    SolutionSection,
    TechImplementationSection,
} from "./components";
import { pageData } from "./data";

export default function RipeMetricsContent() {
    return (
        <main className="min-h-screen pt-16">
            <HeaderSection data={pageData.header} />

            <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                <Link
                    href="/projects/ripemetrics/design"
                    className="group flex items-center gap-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                        <Palette className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold">See the Design Portfolio</p>
                        <p className="text-muted-foreground text-sm">
                            4,666 Figma frames across 9 design phases — brand, sprints, production
                            UI, mobile, and more
                        </p>
                    </div>
                    <ArrowRight className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <OverviewSection data={pageData.overview} />
            <ChallengeSection
                title={pageData.challenge.title}
                description={pageData.challenge.description}
            />
            <SolutionSection
                title={pageData.solution.title}
                description={pageData.solution.description}
                features={pageData.solution.features}
            />
            <ImpactSection title={pageData.impact.title} metrics={pageData.impact.metrics} />
            <ArchitectureDiagram diagramKey={pageData.architectureDiagramKey} />
            {pageData.deepDives.map((dive) => (
                <DeepDiveSection key={dive.id} data={dive} />
            ))}
            <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
                <DecisionLog decisions={pageData.decisions} />
            </div>
            <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-8">
                <LearningsGrid learnings={pageData.learnings} />
            </div>
            <TechImplementationSection
                title={pageData.technicalImplementation.title}
                sections={pageData.technicalImplementation.sections}
            />
            <AchievementsSection
                title={pageData.achievements.title}
                items={pageData.achievements.items}
            />
            <ConclusionSection data={pageData.conclusion} />
        </main>
    );
}
