"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants"
import { ContactForm } from "@/components/contact-form"
const pageData = {
  hero: {
    title: "Full-Stack Engineer & AI Builder",
    description:
      "8+ years shipping production software. I founded RipeMetrics, an AI-native customer growth platform serving 50+ enterprise clients. Now I build full-stack applications and agentic AI systems for clients who need software that actually works.",
    cta: {
      primary: { text: "View Projects", href: "/projects", icon: ArrowRight },
    },
  },
  about: {
    title: "About",
    paragraphs: [
      "I founded RipeMetrics in 2017 and scaled it from a prototype to an AI-native customer growth platform serving 50+ enterprise clients. That meant building everything — React frontends, Node/Python backends, OpenAI integrations, RAG pipelines with Pinecone, and real-time messaging systems processing thousands of interactions daily.",
      "Right now I'm building a Next.js 15 wellness platform for AlignSD with Sanity CMS, structured data, and AI-assisted content, and architecting Scorpion Percussion's e-commerce stack with Turborepo, tRPC, and React Native.",
      "I'm most interested in agentic engineering — wiring LLMs, tool-use, and structured outputs into systems that run autonomously. When AI handles the repetitive work, I focus on architecture and the problems that actually need a human.",
    ],
    techStack: {
      title: "Technologies I work with",
      technologies: [
        "React",
        "TypeScript",
        "Next.js",
        "Redux RTK",
        "Tailwind CSS",
        "Material UI",
        "Node.js",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "OpenAI/Claude API",
        "LangChain",
        "Pinecone",
        "Chroma",
        "Expo",
        "React Native",
        "Turborepo",
        "tRPC",
      ],
    },
  },
  featuredProjects: {
    title: "Featured Projects",
    viewAllText: "View all",
    viewAllHref: "/projects",
    projects: [
      {
        id: "ctrl",
        title: "ctrl",
        description:
          "Autonomous AI agent infrastructure — synced instructions, skills, and secrets from a single dotfiles repo. 12 self-learning skills, 3-tier security model, and a Docker-sandboxed autonomous loop.",
        category: "AI Infrastructure / Developer Tools",
        statusColor: "orange" as const,
        technologies: ["Bash", "TypeScript", "Docker", "Claude Code", "VS Code Copilot"],
        link: "/projects/ctrl",
        linkText: "View case study",
      },
      {
        id: "ripemetrics",
        title: "RipeMetrics",
        description:
          "AI-native customer growth platform serving 50+ enterprise clients. Reduced customer service costs by 40% through AI automation while maintaining 95%+ system uptime.",
        category: "AI / SaaS",
        statusColor: "green" as const,
        technologies: ["React", "Next.js", "TypeScript", "Redux RTK", "OpenAI", "Pinecone"],
        link: "/projects/ripemetrics",
        linkText: "View case study",
      },
      {
        id: "alignsd-wellness",
        title: "AlignSD Wellness Center",
        description:
          "A 44,000-line healthcare platform serving 5,000+ families — 5 AI integrations, 81 JSON-LD schemas, 158 programmatic pages, and 27 email templates. Built solo.",
        category: "Healthcare / Web",
        statusColor: "cyan" as const,
        technologies: ["Next.js 16", "Sanity v5", "TypeScript", "OpenAI", "React Email"],
        link: "/projects/align-san-diego-family-chiropractic",
        linkText: "View case study",
      },
      {
        id: "scorpion-percussion",
        title: "Scorpion Percussion",
        description:
          "E-commerce platform for a percussion instrument brand. Monorepo architecture with shared type-safe API layer and native mobile storefront.",
        category: "E-commerce / Mobile",
        statusColor: "purple" as const,
        technologies: ["Turborepo", "tRPC", "Expo", "React Native", "TypeScript"],
      },
    ],
  },
  contact: {
    title: "Let's work together",
    description: "I'm always interested in hearing about new projects and opportunities.",
    socialLinks: [
      { type: "github", text: "GitHub", href: "https://github.com/arndvs", icon: Github },
      { type: "linkedin", text: "LinkedIn", href: "https://linkedin.com/in/arndvs", icon: Linkedin },
    ],
  },
}
interface ProjectCardProps {
  title: string
  description: string
  category: string
  statusColor: "green" | "blue" | "purple" | "cyan" | "orange"
  technologies: string[]
  link?: string
  linkText?: string
}
interface SocialLinkProps {
  type: string
  text: string
  href: string
  icon: React.ElementType
}
interface TechStackProps {
  technologies: string[]
}
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  category,
  statusColor,
  technologies,
  link,
  linkText,
}) => {
  const { cardVariants } = useAnimationVariants()
  const statusColorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    orange: "bg-orange-500",
  }

  return (
    <motion.div variants={cardVariants}>
      <Card className="group overflow-hidden transition-all hover:border-primary/50">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusColorMap[statusColor]}`} />
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
          {link && (
            <Button asChild variant="link" className="mt-4 p-0">
              <Link href={link}>
                {linkText} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
const SocialLink: React.FC<SocialLinkProps> = ({ text, href, icon: Icon }) => {
  return (
    <Button asChild size="lg" variant="outline">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon className="mr-2 h-4 w-4" />
        {text}
      </a>
    </Button>
  )
}
const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  const { itemVariants } = useAnimationVariants()

  return (
    <div className="flex flex-wrap gap-2">
    {technologies.map((tech) => (
      <motion.span
        key={tech}
        variants={itemVariants}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        className="rounded-md bg-secondary px-3 py-1 text-sm font-medium"
      >
        {tech}
      </motion.span>
    ))}
  </div>
  )
}
export default function HomeContent() {
  const { containerVariants, itemVariants } = useAnimationVariants()

  return (
    <main className="min-h-screen pt-16" role="main">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
        aria-label="Hero section"
      >
        <motion.div variants={itemVariants} className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-6xl">{pageData.hero.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">{pageData.hero.description}</p>
          <div className="mt-10 flex items-center gap-4">
            <Button asChild size="lg">
              <Link href={pageData.hero.cta.primary.href}>
                {pageData.hero.cta.primary.text} <pageData.hero.cta.primary.icon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <ContactForm triggerText="Contact" triggerVariant="outline" />
          </div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        aria-label="About Aaron Davis"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.about.title}
        </motion.h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <motion.div variants={itemVariants} className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            {pageData.about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold">{pageData.about.techStack.title}</h3>
            <TechStack technologies={pageData.about.techStack.technologies} />
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        aria-label="Featured projects"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{pageData.featuredProjects.title}</h2>
          <Button asChild variant="ghost">
            <Link href={pageData.featuredProjects.viewAllHref}>
              {pageData.featuredProjects.viewAllText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div variants={containerVariants} className="mt-8 grid gap-6 md:grid-cols-2">
          {pageData.featuredProjects.projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        aria-label="Contact information"
      >
        <motion.div variants={itemVariants} className="rounded-lg border border-border bg-card p-8 lg:p-12">
          <h2 className="text-3xl font-bold tracking-tight">{pageData.contact.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{pageData.contact.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ContactForm />
            {pageData.contact.socialLinks.map((link) => (
              <SocialLink key={link.type} {...link} />
            ))}
          </div>
        </motion.div>
      </motion.section>
    </main>
  )
}
