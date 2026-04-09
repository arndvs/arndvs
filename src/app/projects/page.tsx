import type { Metadata } from "next"
import ProjectsContent from "./projects-content"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies and portfolio projects showcasing AI-powered platforms, full-stack web applications, and modern user experiences built with React, Next.js, and TypeScript.",
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
