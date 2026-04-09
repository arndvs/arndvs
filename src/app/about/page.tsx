import type { Metadata } from "next"
import AboutContent from "./about-content"

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-stack engineer based in San Diego with 8+ years of experience. From founding RipeMetrics to building AI-powered platforms — learn about my journey, tech stack, and approach.",
}

export default function AboutPage() {
  return <AboutContent />
}

