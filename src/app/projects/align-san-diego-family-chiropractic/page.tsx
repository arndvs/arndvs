"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, cardVariants, staggerContainerVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const pageData = {
  header: {
    backLink: "/projects",
    backText: "Back to Projects",
    badge: {
      color: "cyan",
      label: "Healthcare / Web",
    },
    title: "Align San Diego Family Chiropractic",   
    description:
      "A comprehensive wellness center website featuring advanced content management, patient review systems, AI content generation, and sophisticated SEO optimization for a San Diego chiropractic practice.",
    cta: {
      text: "Visit Website",
      href: "https://alignsd.com",
      icon: ExternalLink,
    },
  },
  overview: {
    title: "Project Overview",
    description:
      "Align San Diego Family Chiropractic is a full-featured healthcare website built for a San Diego chiropractic practice specializing in prenatal, postpartum, and family care. The project showcases advanced web development techniques including headless CMS integration, custom review systems, AI-powered content enhancement, and intricate SEO strategies with hub-and-spoke content architecture.",
  },
  features: {
    title: "Key Features",
    items: [
      {
        id: "sanity-cms",
        title: "Sanity CMS Integration",
        description:
          "Comprehensive headless CMS implementation with custom schemas for blog posts, events, team members, services, and patient reviews. Features live preview, draft mode, and visual editing capabilities.",
      },
      {
        id: "blog-events",
        title: "Advanced Blog & Event System",
        description:
          "Dynamic blog with category filtering, tag-based navigation, featured posts, author profiles, and event management system with registration capabilities and calendar integration.",
      },
      {
        id: "reviews",
        title: "Unique Review Platform",
        description:
          "Custom-built patient review system with 130+ testimonials, service-specific tagging, rating aggregation, filtering by treatment type, and integration with Google Maps and Yelp reviews.",
      },
      {
        id: "ai-content",
        title: "AI Content Generation",
        description:
          "OpenAI integration for content enhancement, blog post optimization, meta description generation, and automated content suggestions to improve SEO and readability.",
      },
      {
        id: "booking",
        title: "Appointment Booking",
        description:
          "Custom appointment booking components with form validation, phone number formatting, email notifications via Resend, and integration with practice management systems.",
      },
      {
        id: "automation",
        title: "Automation & CRM Integration",
        description:
          "n8n workflow automation for patient communication, GoHighLevel CRM integration for lead management, automated follow-ups, and patient engagement tracking.",
      },
      {
        id: "seo",
        title: "SEO Optimization",
        description:
          "Intricate hub-and-spoke content architecture with service pages, condition-specific landing pages, location-based SEO, schema markup, and comprehensive internal linking strategy.",
      },
      {
        id: "payments",
        title: "Payment Processing",
        description:
          "Stripe integration for online payments, package purchases, gift certificates, and subscription management for wellness programs and membership plans.",
      },
    ],
  },
  technicalImplementation: {
    title: "Technical Implementation",
    sections: [
      {
        id: "content-mgmt",
        heading: "Content Management",
        description:
          "Built a comprehensive Sanity CMS implementation with custom schemas for all content types. Implemented Portable Text for rich content editing, custom input components for specialized fields, and live preview functionality. Created custom validation rules and reference management for complex content relationships.",
      },
      {
        id: "review-system",
        heading: "Review System Architecture",
        description:
          "Designed and implemented a unique review system that aggregates patient testimonials from multiple sources (Google, Yelp, direct submissions). Built filtering and sorting capabilities by service type, condition treated, and rating. Implemented schema markup for rich snippets in search results.",
      },
      {
        id: "ai-enhancement",
        heading: "AI-Powered Content Enhancement",
        description:
          "Integrated OpenAI API for automated content optimization, including meta description generation, blog post enhancement, and SEO keyword suggestions. Built custom prompts and workflows to maintain brand voice while improving content quality and search visibility.",
      },
      {
        id: "seo-strategy",
        heading: "SEO Strategy",
        description:
          "Implemented a hub-and-spoke content architecture with pillar pages for main services and supporting content for specific conditions and treatments. Built dynamic sitemap generation, structured data implementation, and comprehensive internal linking system to improve search rankings and user navigation.",
      },
      {
        id: "automation-workflows",
        heading: "Automation Workflows",
        description:
          "Created n8n workflows for automated patient communication, appointment reminders, review requests, and lead nurturing. Integrated with GoHighLevel CRM for comprehensive patient relationship management and marketing automation.",
      },
    ],
  },
  techStack: {
    title: "Technology Stack",
    categories: [
      {
        id: "frontend",
        name: "Frontend",
        technologies: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Radix UI"],
      },
      {
        id: "cms-content",
        name: "CMS & Content",
        technologies: [
          "Sanity CMS",
          "Portable Text",
          "Lexical Editor",
          "Sanity Vision",
          "Sanity Presentation",
          "Sanity Media Plugin",
        ],
      },
      {
        id: "ai-automation",
        name: "AI & Automation",
        technologies: ["OpenAI API", "n8n Workflows", "GoHighLevel CRM", "Automated Content Generation"],
      },
      {
        id: "forms-validation",
        name: "Forms & Validation",
        technologies: ["React Hook Form", "Zod Validation", "libphonenumber-js", "Custom Input Components"],
      },
      {
        id: "email-payments",
        name: "Email & Payments",
        technologies: ["React Email", "Resend", "Stripe", "Payment Processing"],
      },
      {
        id: "testing-quality",
        name: "Testing & Quality",
        technologies: ["Vitest", "React Testing Library", "TypeScript ESLint", "Prettier"],
      },
    ],
  },
  results: {
    title: "Results & Impact",
    metrics: [
      { value: "130+", label: "Five-Star Patient Reviews" },
      { value: "5,000+", label: "Patients Served" },
      { value: "15+", label: "Years in Practice" },
    ],
    paragraphs: [
      "The website successfully serves as the primary digital presence for Align San Diego Family Chiropractic</a>, driving patient acquisition through organic search, showcasing the practice's expertise through comprehensive content, and streamlining patient communication through automated workflows.",
      "The advanced review system and SEO optimization have significantly improved the practice's online visibility, while the AI-powered content generation has enabled consistent, high-quality content production without overwhelming the practice's administrative resources.",
        ],
  },
  learnings: {
    title: "Key Learnings",
    items: [
      "Headless CMS architecture provides flexibility for complex content structures while maintaining editorial control and preview capabilities",
      "Custom review aggregation systems can provide more value than third-party solutions when tailored to specific business needs",
      "AI-powered content generation requires careful prompt engineering and brand voice guidelines to maintain quality and consistency",
      "Hub-and-spoke SEO architecture with comprehensive internal linking significantly improves search visibility for healthcare practices",
      "Automation workflows for patient communication can dramatically reduce administrative burden while improving patient engagement",
    ],
  },
}

// ===== TypeScript Interfaces =====
interface FeatureCardProps {
  title: string
  description: string
}

interface TechImplementationSectionProps {
  heading: string
  description: string
}

interface TechStackCategoryProps {
  name: string
  technologies: string[]
}

interface MetricCardProps {
  value: string
  label: string
}

interface LearningItemProps {
  text: string
}

// ===== Helper Components =====

/**
 * Feature card component displaying key feature information
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <motion.div variants={cardVariants}>
    <Card className="h-full">
                <CardHeader>
        <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
                </CardContent>
              </Card>
  </motion.div>
)

/**
 * Technical implementation section component
 */
const TechImplementationSection: React.FC<TechImplementationSectionProps> = ({ heading, description }) => (
  <motion.div variants={itemVariants}>
    <h3 className="mb-3 text-xl font-semibold">{heading}</h3>
    <p className="leading-relaxed text-muted-foreground">{description}</p>
  </motion.div>
)

/**
 * Technology stack category component
 */
const TechStackCategory: React.FC<TechStackCategoryProps> = ({ name, technologies }) => (
  <motion.div variants={cardVariants} className="rounded-lg border bg-card p-4">
    <h3 className="mb-2 font-semibold">{name}</h3>
    <ul className="space-y-1 text-sm text-muted-foreground">
      {technologies.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  </motion.div>
)

/**
 * Metric display card component
 */
const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
  <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
        <CardTitle className="text-4xl font-bold text-cyan-500">{value}</CardTitle>
        <CardDescription>{label}</CardDescription>
                </CardHeader>
              </Card>
  </motion.div>
)

/**
 * Learning item component with bullet point
 */
const LearningItem: React.FC<LearningItemProps> = ({ text }) => (
  <motion.li variants={itemVariants} className="flex gap-3">
    <span className="text-cyan-500">•</span>
    <span>{text}</span>
  </motion.li>
)

// ===== Main Component =====

/**
 * AlignSD Wellness Center case study page showcasing a comprehensive
 * healthcare website with CMS, AI integration, and advanced SEO.
 * 
 * Features scroll-triggered animations and full content structure
 * ready for headless CMS integration.
 * 
 * @example
 * <AlignSDWellnessPage />
 */
export default function AlignSDWellnessPage() {
  return (
    <main className="min-h-screen pt-16">
      <article className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Button asChild variant="ghost" className="mb-8">
            <Link href={pageData.header.backLink}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {pageData.header.backText}
            </Link>
          </Button>
        </motion.div>

        {/* Header */}
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-12"
        >
          <motion.div variants={itemVariants} className="mb-4 flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full bg-${pageData.header.badge.color}-500`} />
            <span className="text-sm font-medium text-muted-foreground">{pageData.header.badge.label}</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-balance">
            {pageData.header.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">
            {pageData.header.description}
          </motion.p>
          <motion.div variants={itemVariants} className="mt-6 flex gap-4">
            <Button asChild>
              <a href={pageData.header.cta.href} target="_blank" rel="noopener noreferrer">
                {pageData.header.cta.text} <pageData.header.cta.icon className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </motion.header>

        <div className="space-y-12">
          {/* Overview */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold">
              {pageData.overview.title}
            </motion.h2>
            <motion.p variants={itemVariants} className="leading-relaxed text-muted-foreground">
              {pageData.overview.description}
            </motion.p>
          </motion.section>

          {/* Key Features */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold">
              {pageData.features.title}
            </motion.h2>
            <motion.div variants={staggerContainerVariants} className="grid gap-6 md:grid-cols-2">
              {pageData.features.items.map((feature) => (
                <FeatureCard key={feature.id} title={feature.title} description={feature.description} />
              ))}
            </motion.div>
          </motion.section>

          {/* Technical Implementation */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold">
              {pageData.technicalImplementation.title}
            </motion.h2>
            <motion.div variants={containerVariants} className="space-y-6">
              {pageData.technicalImplementation.sections.map((section) => (
                <TechImplementationSection key={section.id} heading={section.heading} description={section.description} />
              ))}
            </motion.div>
          </motion.section>

          {/* Technology Stack */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold">
              {pageData.techStack.title}
            </motion.h2>
            <motion.div variants={staggerContainerVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageData.techStack.categories.map((category) => (
                <TechStackCategory key={category.id} name={category.name} technologies={category.technologies} />
              ))}
            </motion.div>
          </motion.section>

          {/* Results & Impact */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold">
              {pageData.results.title}
            </motion.h2>
            <motion.div variants={staggerContainerVariants} className="grid gap-6 md:grid-cols-3">
              {pageData.results.metrics.map((metric, index) => (
                <MetricCard key={index} value={metric.value} label={metric.label} />
              ))}
            </motion.div>

            <motion.div variants={containerVariants} className="mt-6 space-y-4">
              {pageData.results.paragraphs.map((paragraph, index) => (
                <motion.p key={index} variants={itemVariants} className="leading-relaxed text-muted-foreground">
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.section>

          {/* Key Learnings */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold">
              {pageData.learnings.title}
            </motion.h2>
            <motion.ul variants={containerVariants} className="space-y-3 leading-relaxed text-muted-foreground">
              {pageData.learnings.items.map((item, index) => (
                <LearningItem key={index} text={item} />
              ))}
            </motion.ul>
          </motion.section>
        </div>
      </article>
    </main>
  )
}
