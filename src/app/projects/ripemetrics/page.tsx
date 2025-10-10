"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, cardVariants, staggerContainerVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const pageData = {
  header: {
    backLink: "/projects",
    backText: "Back to projects",
    badge: {
      color: "green",
      label: "AI / SaaS Platform",
    },
    title: "RipeMetrics",
    description:
      "AI-native customer growth platform that helps businesses automate customer service, reduce costs by 40%, and scale support operations through intelligent chatbots, predictive analytics, and omni-channel communication.",
  },
  overview: {
    role: {
      label: "Role",
      value: "Founder, President & Full Stack Developer",
    },
    timeline: {
      label: "Timeline",
      value: "April 2017 - July 2025",
    },
    technologies: {
      label: "Technologies",
      items: [
                "React",
                "Next.js",
                "TypeScript",
                "Redux RTK",
                "Material UI",
                "Tailwind",
                "FastAPI",
                "PostgreSQL",
                "MySQL",
                "OpenAI",
                "Pinecone",
                "Chroma",
      ],
    },
  },
  challenge: {
    title: "The Challenge",
    description:
      "Businesses struggle to scale customer service operations efficiently. Traditional support systems are costly, slow to respond, and can't handle the volume of customer interactions modern businesses face. Companies need intelligent automation that maintains service quality while reducing operational costs.",
  },
  solution: {
    title: "The Solution",
    description:
      "RipeMetrics is an AI-native customer growth platform that processes thousands of customer interactions daily across 50+ enterprise clients. The platform combines context-aware chatbots, vector database search, and real-time analytics to deliver intelligent, automated customer service at scale.",
    features: [
      {
        id: "chatbots",
        title: "AI-Powered Chatbots",
        description:
          "Context-aware chatbots built with OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service with intelligent response generation.",
      },
      {
        id: "analytics",
        title: "Real-Time Analytics Dashboard",
        description:
          "Comprehensive analytics with 40+ custom charts using Highcharts for large dataset visualization, providing actionable insights into customer interactions and service performance.",
      },
      {
        id: "extraction",
        title: "Automated Content Extraction",
        description:
          "Modular website content extraction system using TypeScript and Apify SDK, reducing client onboarding time from 20 minutes to just 2 minutes.",
      },
      {
        id: "call-center",
        title: "Real-Time Call Center",
        description:
          "Web-based call center with ElevenLabs voice synthesis and Twilio integration for IVR system, enabling voice-based customer interactions with AI assistance.",
      },
    ],
  },
  impact: {
    title: "Impact",
    metrics: [
      { value: "50+", label: "Enterprise clients served" },
      { value: "40%", label: "Reduction in customer service costs" },
      { value: "95%+", label: "System uptime achieved" },
    ],
  },
  technicalImplementation: {
    title: "Technical Implementation",
    sections: [
      {
        heading: "Frontend Architecture",
        content:
          "Led complete refactor from Laravel Livewire to React/Next.js using RTK Query, TypeScript, TailwindCSS, and Material UI, reducing network request response times by 6 seconds on average. Built the main SaaS application and marketing website with headless CMS integration using Sanity. Created lightweight Preact islands architecture for embeddable widgets and WordPress plugin integration.",
      },
      {
        heading: "AI & Machine Learning",
        content:
          "Designed context-aware chatbot using OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service. Implemented Next.js/FastAPI system for AI interactions with streaming response capabilities. Architected vector databases for document embeddings with multi-tenant architecture.",
      },
      {
        heading: "Backend & Infrastructure",
        content:
          "Built real-time communication systems using PusherJS and WebSockets. Monitored and maintained CI/CD pipelines through Forge, Vercel, Bitbucket, and DigitalOcean. Implemented PostHog analytics to monitor onboarding processes and optimize user flow conversion rates. Configured SendGrid SDK for marketing email server supporting 10,000+ daily emails with TCR/10DLC compliance.",
      },
    ],
  },
  achievements: {
    title: "Key Technical Achievements",
    items: [
            {
              title: "Performance Optimization",
              description:
                "Reduced network request response times by 6 seconds on average through complete React/Next.js refactor with RTK Query and TypeScript.",
            },
            {
              title: "Rapid Client Onboarding",
              description:
                "Built automated content extraction system that reduced client onboarding time from 20 minutes to 2 minutes using TypeScript and Apify SDK.",
            },
            {
              title: "Comprehensive Analytics",
              description:
                "Developed analytics dashboard with 40+ custom charts using Highcharts for large dataset visualization and real-time insights.",
            },
            {
              title: "High Availability",
              description:
                "Achieved 95%+ system uptime through robust architecture, comprehensive monitoring with Sentry and PostHog, and efficient CI/CD pipelines.",
            },
            {
              title: "Scalable Email Infrastructure",
              description:
                "Configured SendGrid SDK to support 10,000+ daily marketing emails with TCR/10DLC compliance for enterprise-scale communication.",
            },
            {
              title: "Multi-Tenant Vector Database",
              description:
                "Architected vector databases for document embeddings with multi-tenant architecture using Pinecone and Chroma for intelligent search.",
            },
    ],
  },
  conclusion: {
    title: "Results",
    description:
      "RipeMetrics successfully scaled from concept to serving 50+ enterprise clients, processing thousands of customer interactions daily. The platform reduced customer service costs by 40% through AI automation while maintaining 95%+ system uptime. Led technical team through multiple successful product pivots based on market feedback, demonstrating the platform's adaptability and robust architecture.",
    cta: {
      primary: { text: "View Live Site", icon: ExternalLink },
      secondary: { text: "View More Projects", href: "/projects" },
    },
  },
}

// ===== TypeScript Interfaces =====
interface MetricCardProps {
  value: string
  label: string
}

interface FeatureCardProps {
  title: string
  description: string
}

interface AchievementCardProps {
  title: string
  description: string
}

interface TechBadgeProps {
  tech: string
}

// ===== Helper Components =====

/**
 * Metric display card component
 */
const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
  <motion.div variants={cardVariants} className="rounded-lg border border-border bg-card p-6">
    <div className="text-4xl font-bold text-primary">{value}</div>
    <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
  </motion.div>
)

/**
 * Feature card component with hover effect
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <motion.div variants={cardVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

/**
 * Achievement card component
 */
const AchievementCard: React.FC<AchievementCardProps> = ({ title, description }) => (
  <motion.div variants={cardVariants} className="rounded-lg border border-border bg-card p-6">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
  </motion.div>
)

/**
 * Technology badge component
 */
const TechBadge: React.FC<TechBadgeProps> = ({ tech }) => (
  <motion.span
    variants={itemVariants}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    className="rounded-md bg-secondary px-2 py-1 text-sm font-medium"
  >
    {tech}
  </motion.span>
)

// ===== Main Component =====

/**
 * RipeMetrics case study page showcasing project details, technical implementation,
 * and business impact.
 * 
 * Uses Framer Motion for scroll-triggered animations throughout the page.
 * All content is sourced from the pageData object for easy CMS integration.
 * 
 * @example
 * <RipeMetricsPage />
 */
export default function RipeMetricsPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="border-b border-border"
      >
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <motion.div variants={itemVariants}>
            <Button asChild variant="ghost" size="sm" className="mb-8">
              <Link href={pageData.header.backLink}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {pageData.header.backText}
              </Link>
            </Button>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
            <div className={`h-2 w-2 rounded-full bg-${pageData.header.badge.color}-500`} />
            <span className="text-sm font-medium text-muted-foreground">{pageData.header.badge.label}</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-balance">
            {pageData.header.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">
            {pageData.header.description}
          </motion.p>
        </div>
      </motion.section>

      {/* Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <div className="grid gap-12 lg:grid-cols-3">
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pageData.overview.role.label}
            </h3>
            <p className="mt-2 text-lg">{pageData.overview.role.value}</p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pageData.overview.timeline.label}
            </h3>
            <p className="mt-2 text-lg">{pageData.overview.timeline.value}</p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {pageData.overview.technologies.label}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {pageData.overview.technologies.items.map((tech) => (
                <TechBadge key={tech} tech={tech} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Challenge */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.challenge.title}
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {pageData.challenge.description}
        </motion.p>
      </motion.section>

      {/* Solution */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.solution.title}
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {pageData.solution.description}
        </motion.p>

        <motion.div variants={staggerContainerVariants} className="mt-12 grid gap-6 md:grid-cols-2">
          {pageData.solution.features.map((feature) => (
            <FeatureCard key={feature.id} title={feature.title} description={feature.description} />
          ))}
        </motion.div>
      </motion.section>

      {/* Impact */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.impact.title}
        </motion.h2>
        <motion.div variants={staggerContainerVariants} className="mt-12 grid gap-8 md:grid-cols-3">
          {pageData.impact.metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </motion.div>
      </motion.section>

      {/* Technical Implementation */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.technicalImplementation.title}
        </motion.h2>
        <motion.div variants={itemVariants} className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
          {pageData.technicalImplementation.sections.map((section, index) => (
            <p key={index}>
              <strong>{section.heading}:</strong> {section.content}
            </p>
          ))}
        </motion.div>
      </motion.section>

      {/* Achievements */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
          {pageData.achievements.title}
        </motion.h2>
        <motion.div variants={staggerContainerVariants} className="mt-8 space-y-4">
          {pageData.achievements.items.map((achievement, index) => (
            <AchievementCard key={index} title={achievement.title} description={achievement.description} />
          ))}
        </motion.div>
      </motion.section>

      {/* Conclusion */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
      >
        <motion.div variants={itemVariants} className="rounded-lg border border-border bg-card p-8 lg:p-12">
          <h2 className="text-3xl font-bold tracking-tight">{pageData.conclusion.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{pageData.conclusion.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg">
              <pageData.conclusion.cta.primary.icon className="mr-2 h-4 w-4" />
              {pageData.conclusion.cta.primary.text}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={pageData.conclusion.cta.secondary.href}>{pageData.conclusion.cta.secondary.text}</Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>
    </main>
  )
}
