"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { ContactForm } from "@/components/contact-form"

const projects = [
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
    id: "alignsd-wellness",
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
]

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-6xl">Projects</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">
            A collection of work showcasing my experience building AI-powered platforms, full-stack web applications,
            and modern user experiences.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        project.color === "green"
                          ? "bg-green-500"
                          : project.color === "blue"
                            ? "bg-blue-500"
                            : project.color === "cyan"
                              ? "bg-cyan-500"
                              : project.color === "orange"
                                ? "bg-orange-500"
                                : "bg-purple-500"
                      }`}
                    />
                    <span className="text-xs font-medium text-muted-foreground">{project.category}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{project.year}</span>
                </div>
                <div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{project.role}</p>
                </div>
                <CardDescription className="text-base leading-relaxed">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Button asChild variant="default" size="sm">
                    <Link href={`/projects/${project.id}`}>
                      View case study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {project.link && (
                    <Button asChild variant="outline" size="sm">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        Visit site <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-24 rounded-lg border border-border bg-card p-8 text-center lg:p-12">
          <h2 className="text-2xl font-bold tracking-tight">Interested in working together?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            I&apos;m currently taking on freelance projects and exploring full-time opportunities in AI-first companies.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
