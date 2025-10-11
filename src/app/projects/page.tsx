"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, cardVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const projectsPageData = {
  hero: {
    title: "Projects",
    description:
      "A collection of work showcasing my experience building AI-powered platforms, full-stack web applications, and modern user experiences.",
  },
  projects: [
    {
      id: "ripemetrics",
      title: "RipeMetrics",
      description:
        "AI-powered customer growth platform serving 50+ enterprise clients with automated customer service, reducing costs by 40% and achieving 95%+ uptime.",
      category: "AI / SaaS",
      color: "green",
      technologies: ["React", "Next.js", "TypeScript", "Redux RTK", "OpenAI", "Pinecone", "PostgreSQL"],
      featured: true,
      role: "Founder & Full-Stack Developer",
      year: "2017-2025",
    },
    {
      id: "align-san-diego-family-chiropractic",
      title: "AlignSD Wellness Center",
      description:
        "Comprehensive wellness center website with Sanity CMS, advanced blog system, unique review platform, AI content generation, and intricate SEO optimization.",
      category: "Healthcare / Web",
      color: "cyan",
      technologies: ["Next.js 15", "React 19", "Sanity CMS", "TypeScript", "OpenAI", "Stripe", "Tailwind CSS v4"],
      featured: true,
      role: "Full-Stack Developer",
      year: "2024",
      link: "https://alignsdwellness.com",
    },
    {
      id: "mainstream-merchant-services",
      title: "MainStream Merchant Services",
      description:
        "Complete digital transformation including corporate rebranding with new brand identity, ground-up website rebuild, and sophisticated marketing automation with Infusionsoft campaign sequences and automated lead distribution.",
      category: "Digital Transformation",
      color: "orange",
      technologies: ["Web Development", "Brand Identity", "Infusionsoft", "Marketing Automation", "CRM Integration"],
      featured: true,
      role: "Regional Sales Manager & Web Technology Lead",
      year: "2013-2017",
    },
  ],
  cta: {
    title: "Interested in working together?",
    description:
      "I'm currently taking on freelance projects and exploring full-time opportunities in AI-first companies.",
    buttonText: "Get in touch",
  },
}

// ===== TypeScript Interfaces =====

/**
 * Project data interface
 * @property {string} id - Unique project identifier for routing
 * @property {string} title - Project title
 * @property {string} description - Project description
 * @property {string} category - Project category/type
 * @property {string} color - Color theme (green, blue, cyan, orange, purple)
 * @property {string[]} technologies - Array of technologies used
 * @property {boolean} featured - Whether project is featured
 * @property {string} role - Role in the project
 * @property {string} year - Year or time period
 * @property {string} [link] - Optional external link to live site
 */
interface Project {
  id: string
  title: string
  description: string
  category: string
  color: string
  technologies: string[]
  featured: boolean
  role: string
  year: string
  link?: string
}

// ===== Helper Functions =====

/**
 * Get Tailwind background color class based on color name
 * @param {string} color - Color name (green, blue, cyan, orange, purple)
 * @returns {string} Tailwind class string
 */
const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  }
  return colorMap[color] || "bg-primary"
}

// ===== Subcomponents =====

/**
 * Project card component displaying project information with hover animations
 * Shows project title, description, technologies, role, year, and action buttons
 */
const ProjectCard: React.FC<Project> = ({
  id,
  title,
  description,
  category,
  color,
  technologies,
  role,
  year,
  link,
}) => {
  return (
    <motion.div variants={cardVariants}>
      <Card className="group h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
        <CardHeader className="space-y-4">
          {/* Category and Year */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getColorClass(color)}`} />
              <span className="text-xs font-medium text-muted-foreground">{category}</span>
            </div>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>

          {/* Title and Role */}
          <div>
            <CardTitle className="text-2xl group-hover:text-primary transition-colors">{title}</CardTitle>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{role}</p>
          </div>

          {/* Description */}
          <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span key={tech} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild variant="default" size="sm">
              <Link href={`/projects/${id}`}>
                View case study <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {link && (
              <Button asChild variant="outline" size="sm">
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Visit site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ===== Main Component =====

/**
 * Projects listing page showcasing portfolio work.
 * Displays featured projects with filtering, categories, and technology stacks.
 * 
 * Features:
 * - Hero section with page title and description
 * - Grid of project cards with hover effects
 * - Project categories and year badges
 * - Technology stack tags
 * - Links to case studies and live sites
 * - CTA section with contact form
 * - Scroll-triggered animations for all sections
 * 
 * All sections use Framer Motion's whileInView for smooth scroll-triggered animations.
 * Project cards have hover effects and responsive grid layout.
 * 
 * @example
 * // Automatically rendered at /projects route
 * <ProjectsPage />
 */
export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-3xl"
        >
          <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-balance lg:text-6xl">
            {projectsPageData.hero.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">
            {projectsPageData.hero.description}
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-16 grid gap-8 md:grid-cols-2"
          role="list"
          aria-label="Projects"
        >
          {projectsPageData.projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24"
        >
          <motion.div variants={itemVariants}>
            <Card className="text-center">
              <CardContent className="p-8 lg:p-12">
                <h2 className="text-2xl font-bold tracking-tight">{projectsPageData.cta.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{projectsPageData.cta.description}</p>
                <div className="mt-6">
                  <ContactForm triggerText={projectsPageData.cta.buttonText} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
