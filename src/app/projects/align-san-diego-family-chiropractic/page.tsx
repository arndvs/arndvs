"use client"

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
  CTASection,
} from "./components"

export default function AlignSDPage() {
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
        <CTASection data={pageData.cta} />
      </article>
    </main>
  )
}
