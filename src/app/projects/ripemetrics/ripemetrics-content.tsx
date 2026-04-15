"use client";

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
            <div className="mx-auto max-w-5xl px-6 pt-16 lg:px-8">
                <DecisionLog decisions={pageData.decisions} />
            </div>
            <div className="mx-auto max-w-5xl px-6 pt-16 lg:px-8">
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
