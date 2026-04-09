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
  title: "Align San Diego Family Chiropractic",
  description:
    "Case study: A 44,000-line healthcare platform with 5 AI integrations, 81 JSON-LD schemas, programmatic SEO across 158 pages, built on Next.js 16 and Sanity v5.",
}

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
        <GallerySection gallery={pageData.gallery} />
        <CTASection data={pageData.cta} />
      </article>
    </main>
  )
}
