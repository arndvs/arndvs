"use client"

import { pageData } from "./data"
import {
  HeaderSection,
  OverviewSection,
  ChallengeSection,
  SolutionSection,
  ImpactSection,
  ArchitectureDiagram,
  DeepDiveSection,
  DecisionsSection,
  LearningsSection,
  TechImplementationSection,
  AchievementsSection,
  ConclusionSection,
} from "./components"

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
      <ImpactSection
        title={pageData.impact.title}
        metrics={pageData.impact.metrics}
      />
      <ArchitectureDiagram diagramKey={pageData.architectureDiagramKey} />
      {pageData.deepDives.map((dive) => (
        <DeepDiveSection key={dive.id} data={dive} />
      ))}
      <DecisionsSection decisions={pageData.decisions} />
      <LearningsSection learnings={pageData.learnings} />
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
  )
}
