"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  cardVariants,
} from "@/lib/utils/animations";
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
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Redux RTK",
        "OpenAI",
        "Pinecone",
        "PostgreSQL",
      ],
      featured: true,
      role: "Founder & Full-Stack Developer",
      year: "2017-2025",
    },
    {
      id: "align-san-diego-family-chiropractic",
      title: "Align San Diego Family Chiropractic",
      description:
        "Full-stack healthcare platform with 5 AI integrations, 25+ Schema.org types with medical coding, programmatic SEO across 60+ routes, and a 26-template transactional email system — built on Next.js 16, Sanity v5, and OpenAI.",
      category: "Healthcare / Web",
      color: "cyan",
      technologies: [
        "Next.js 16",
        "React 19",
        "Sanity v5",
        "TypeScript",
        "OpenAI",
        "Schema.org",
        "Programmatic SEO",
      ],
      featured: true,
      role: "Full-Stack Developer",
      year: "2024-Present",
      link: "https://alignsd.com",
    },
  ],
  cta: {
    title: "Interested in working together?",
    description:
      "I'm currently taking on freelance projects and exploring full-time opportunities in AI-first companies.",
    buttonText: "Get in touch",
  },
};
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  technologies: string[];
  featured: boolean;
  role: string;
  year: string;
  link?: string;
}
const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };
  return colorMap[color] || "bg-primary";
};
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
              <span className="text-xs font-medium text-muted-foreground">
                {category}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>

          {/* Title and Role */}
          <div>
            <CardTitle className="text-2xl group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {role}
            </p>
          </div>

          {/* Description */}
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium"
              >
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
  );
};
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
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight text-balance lg:text-6xl"
          >
            {projectsPageData.hero.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty"
          >
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
                <h2 className="text-2xl font-bold tracking-tight">
                  {projectsPageData.cta.title}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {projectsPageData.cta.description}
                </p>
                <div className="mt-6">
                  <ContactForm triggerText={projectsPageData.cta.buttonText} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
