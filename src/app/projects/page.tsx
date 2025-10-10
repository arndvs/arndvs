"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, cardVariants, itemVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const pageData = {
  header: {
    title: "Projects",
    description:
      "A collection of work showcasing my experience in building web applications, from AI-powered platforms to design systems.",
  },
  projects: [
    {
      id: "ripemetrics",
      title: "RipeMetrics",
      description:
        "AI-powered food waste reduction platform helping restaurants reduce waste by up to 40% through predictive analytics and real-time inventory tracking.",
      category: "AI / SaaS",
      color: "green" as const,
      technologies: ["React", "Next.js", "AI/ML", "PostgreSQL", "TypeScript"],
      featured: true,
      caseStudy: "/projects/ripemetrics",
    },
    {
      id: "align-san-diego-family-chiropractic",
      title: "Align San Diego Family Chiropractic",
      description: "Full-stack website for a chiropractic practice.",
      category: "Web App",
      color: "blue" as const,
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"],
      featured: true,
      caseStudy: "/projects/align-san-diego-family-chiropractic",
    },
  ],
}

// ===== TypeScript Interfaces =====
interface ProjectCardProps {
  id: string
  title: string
  description: string
  category: string
  color: "green" | "blue" | "purple"
  technologies: string[]
  caseStudy?: string
}

// ===== Helper Components =====

/**
 * Project card component with hover animations
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, category, color, technologies, caseStudy }) => {
  const colorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  }

  return (
    <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card className="group h-full overflow-hidden transition-all hover:border-primary/50">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${colorMap[color]}`} />
            <span className="text-xs font-medium text-muted-foreground">{category}</span>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
          {caseStudy && (
            <Button asChild variant="link" className="mt-4 p-0">
              <Link href={caseStudy}>
                View case study <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ===== Main Component =====

/**
 * Projects page displaying all portfolio projects in a grid layout
 * with scroll-triggered animations.
 * 
 * Uses Framer Motion for animations and shadcn components for UI.
 * 
 * @example
 * <ProjectsPage />
 */
export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-16">
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <motion.div variants={itemVariants} className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-balance">{pageData.header.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">{pageData.header.description}</p>
        </motion.div>

        <motion.div variants={containerVariants} className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pageData.projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </motion.div>
      </motion.section>
    </main>
  )
}
