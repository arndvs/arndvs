"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, cardVariants } from "@/lib/utils/animations"
import { ContactForm } from "@/components/contact-form"

// ===== Page Data =====
const pageData = {
  hero: {
    title: "Full Stack Software Engineer",
    description:
      "Self-taught software engineer with 8+ years of experience building and scaling AI-powered SaaS platforms from concept to production. Specializing in React, TypeScript, Next.js, and modern AI integration including LLM engineering, RAG systems, and automated data processing pipelines.",
    cta: {
      primary: { text: "View Projects", href: "/projects", icon: ArrowRight },
    },
  },
  about: {
    title: "About",
    paragraphs: [
      "I'm a self-taught software engineer who founded and scaled RipeMetrics, an AI-native customer growth platform, from concept to serving 50+ enterprise clients. My journey combines technical leadership with hands-on development, specializing in building production-ready AI applications that solve real business problems.",
      "My expertise spans the full stack, with a particular focus on frontend architecture, AI integration, and building scalable SaaS platforms. I've led complete technical refactors, implemented RAG systems with vector databases, and created real-time communication systems that process thousands of customer interactions daily.",
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
      ],
    },
  },
  featuredProjects: {
    title: "Featured Projects",
    viewAllText: "View all",
    viewAllHref: "/projects",
    projects: [
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
        title: "Align San Diego Family Chiropractic",
        description:
          "Comprehensive wellness center website with Sanity CMS, advanced blog system, unique review platform, AI content generation, and intricate SEO optimization.",
        category: "Healthcare / Web",
        statusColor: "blue" as const,
        technologies: ["Next.js 15", "Sanity CMS", "TypeScript", "OpenAI", "Stripe"],
        link: "/projects/align-san-diego-family-chiropractic",
        linkText: "View case study",
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

// ===== TypeScript Interfaces =====

/**
 * Props for the ProjectCard component
 * @property {string} title - Project name/title
 * @property {string} description - Brief project description
 * @property {string} category - Project category (e.g., "AI / SaaS")
 * @property {"green" | "blue" | "purple"} statusColor - Status indicator color
 * @property {string[]} technologies - Array of technology names used
 * @property {string} [link] - Optional link to project details
 * @property {string} [linkText] - Optional custom link text
 */
interface ProjectCardProps {
  title: string
  description: string
  category: string
  statusColor: "green" | "blue" | "purple"
  technologies: string[]
  link?: string
  linkText?: string
}

/**
 * Props for the SocialLink component
 * @property {string} type - Social platform type identifier
 * @property {string} text - Display text for the link
 * @property {string} href - URL to social profile
 * @property {React.ElementType} icon - Lucide icon component
 */
interface SocialLinkProps {
  type: string
  text: string
  href: string
  icon: React.ElementType
}

/**
 * Props for the TechStack component
 * @property {string[]} technologies - Array of technology names to display
 */
interface TechStackProps {
  technologies: string[]
}

// ===== Helper Components =====

/**
 * Project card component displaying project information with hover animations
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  category,
  statusColor,
  technologies,
  link,
  linkText,
}) => {
  const statusColorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
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

/**
 * Social link button component
 */
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

/**
 * Technology stack grid component
 */
const TechStack: React.FC<TechStackProps> = ({ technologies }) => (
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

// ===== Main Component =====

/**
 * Home page component showcasing Aaron Davis's professional profile and portfolio.
 * Features scroll-triggered animations, featured projects, and contact information.
 * 
 * Structure:
 * - Hero section with title, description, and CTAs
 * - About section with background and tech stack
 * - Featured projects grid with case study links
 * - Contact section with social links and contact form
 * 
 * All sections use Framer Motion's whileInView for smooth scroll-triggered animations.
 * Responsive design with Tailwind CSS breakpoints for mobile, tablet, and desktop.
 * Implements shadcn/ui components for consistent styling across the application.
 * 
 * @example
 * // Automatically rendered at root route /
 * <HomePage />
 */
export default function HomePage() {
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
