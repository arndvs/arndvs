"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  cardVariants,
  staggerContainerVariants,
} from "@/lib/utils/animations";

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
      "Full-stack healthcare platform with 5 AI integrations, 25+ Schema.org types (including ICD-10 and SNOMED-CT medical codes), programmatic SEO across 60+ routes, a 26-template transactional email system, and 57+ automated tests — built on Next.js 16, Sanity v5, and OpenAI.",
    cta: {
      text: "Visit Website",
      href: "https://alignsd.com",
      icon: ExternalLink,
    },
  },
  overview: {
    title: "Project Overview",
    description:
      "AlignSD is a production healthcare platform for a San Diego chiropractic practice specializing in prenatal, postpartum, and family care. The codebase ships 60+ frontend routes, 27 API endpoints, 9 Sanity document types, and 4 GitHub Actions CI/CD pipelines. Five distinct OpenAI integrations handle everything from GPT-4o Vision insurance card processing to review sentiment analysis and spam detection. A programmatic SEO layer generates condition and service pages at build time, each with structured data drawn from 25+ Schema.org types with ICD-10 and SNOMED-CT medical coding. The email system uses React Email to render 26 templates across 30+ reusable components, delivered through Resend.",
  },
  features: {
    title: "Key Features",
    items: [
      {
        id: "ai-integrations",
        title: "5 AI Integrations",
        description:
          "GPT-4o Vision for insurance card OCR, content enhancement for blog posts, event description generation, review sentiment analysis, and spam detection — each with dedicated API routes, structured JSON output, and error boundaries.",
      },
      {
        id: "schema-org",
        title: "25+ Schema.org Types with Medical Coding",
        description:
          "Comprehensive structured data layer generating JSON-LD for LocalBusiness, MedicalBusiness, Chiropractor, FAQPage, BlogPosting, Event, Review, and 18+ more types. Includes ICD-10 and SNOMED-CT medical codes for conditions and treatments.",
      },
      {
        id: "sanity-cms",
        title: "Sanity v5 Content Platform",
        description:
          "9 document types and 3 object types with live preview, draft mode, and visual editing. 12 GROQ query files power the data layer. Custom Studio with embedded dashboards, media management, and presentation mode.",
      },
      {
        id: "programmatic-seo",
        title: "Programmatic SEO Across 60+ Routes",
        description:
          "Hub-and-spoke architecture generating condition pages, service pages, and location-specific landing pages at build time. Dynamic sitemap, canonical URLs, and comprehensive internal linking driven by Sanity content relationships.",
      },
      {
        id: "email-system",
        title: "26-Template Email System",
        description:
          "React Email renders 26 transactional templates (appointment confirmations, review requests, contact forms, insurance submissions) using 30+ reusable components, delivered through Resend with rate limiting and error handling.",
      },
      {
        id: "review-platform",
        title: "AI-Powered Review Platform",
        description:
          "155+ patient reviews with sentiment analysis, service-specific tagging, rating aggregation, and filtering by treatment type. Generates AggregateRating and individual Review schema for rich snippets in search results.",
      },
      {
        id: "testing",
        title: "57+ Automated Tests",
        description:
          "Vitest and React Testing Library covering unit, integration, SEO validation, and E2E scenarios. Dedicated test suites verify Schema.org output, meta tag generation, and API endpoint responses.",
      },
      {
        id: "aeo",
        title: "Answer Engine Optimization",
        description:
          "Machine-readable endpoints at /llms.txt and /llms-full.txt serve structured practice data to AI assistants. FAQ schema and medical condition markup provide direct answers for voice search and AI-powered discovery.",
      },
    ],
  },
  technicalImplementation: {
    title: "Technical Implementation",
    sections: [
      {
        id: "content-platform",
        heading: "Content Platform",
        description:
          "Sanity v5 powers 9 document types (blog posts, events, team members, services, reviews, conditions, FAQs, testimonials, settings) and 3 object types. 12 GROQ query files centralize data access. The Studio ships with embedded analytics dashboards, a media library plugin, and Presentation mode for visual editing. Draft mode and live preview let editors see changes before publishing.",
      },
      {
        id: "ai-pipeline",
        heading: "AI Integration Pipeline",
        description:
          "Five dedicated API routes handle AI tasks: GPT-4o Vision extracts structured data from insurance card photos, a content enhancement endpoint rewrites blog drafts for SEO, an event enhancer generates descriptions from minimal input, review sentiment analysis scores and categorizes patient feedback, and a spam detection layer filters form submissions. Each route returns structured JSON with Zod-validated schemas and includes rate limiting.",
      },
      {
        id: "json-ld",
        heading: "Structured Data & JSON-LD",
        description:
          "A centralized schema generation system produces JSON-LD for 25+ Schema.org types. Medical conditions include ICD-10 diagnostic codes and SNOMED-CT identifiers. The system generates LocalBusiness, Chiropractor, MedicalBusiness, FAQPage, BlogPosting, Event, Review, AggregateRating, BreadcrumbList, and condition-specific MedicalCondition types. Dedicated test suites validate every output against Schema.org specifications.",
      },
      {
        id: "programmatic-seo",
        heading: "Programmatic SEO Architecture",
        description:
          "A hub-and-spoke model generates 60+ routes at build time. Service pillar pages link to condition-specific child pages, each with unique content, FAQ schema, and internal links back to the hub. Dynamic sitemaps, canonical URLs, and Open Graph metadata are generated per-page. AEO endpoints at /llms.txt and /llms-full.txt serve machine-readable practice data for AI assistants.",
      },
      {
        id: "email-system",
        heading: "Transactional Email System",
        description:
          "React Email renders 26 templates from 30+ shared components covering appointment confirmations, review requests, contact form receipts, insurance submission acknowledgments, and internal notifications. Resend delivers all mail with automatic retries. Templates use consistent branding and are type-safe with TypeScript interfaces for every prop.",
      },
    ],
  },
  techStack: {
    title: "Technology Stack",
    categories: [
      {
        id: "frontend",
        name: "Frontend",
        technologies: [
          "Next.js 16 (App Router)",
          "React 19",
          "TypeScript 5.8",
          "Tailwind CSS v4",
          "Framer Motion",
          "Radix UI",
        ],
      },
      {
        id: "cms-content",
        name: "CMS & Content",
        technologies: [
          "Sanity v5",
          "GROQ",
          "Portable Text",
          "Sanity Presentation",
          "Sanity Media Plugin",
          "9 Document Types",
        ],
      },
      {
        id: "ai",
        name: "AI & Machine Learning",
        technologies: [
          "OpenAI GPT-4o Vision",
          "Content Enhancement",
          "Sentiment Analysis",
          "Spam Detection",
          "Event Generation",
        ],
      },
      {
        id: "email",
        name: "Email & Notifications",
        technologies: [
          "React Email",
          "Resend",
          "26 Templates",
          "30+ Shared Components",
        ],
      },
      {
        id: "seo-data",
        name: "SEO & Structured Data",
        technologies: [
          "25+ Schema.org Types",
          "ICD-10 / SNOMED-CT",
          "Dynamic Sitemaps",
          "AEO (/llms.txt)",
          "Open Graph",
        ],
      },
      {
        id: "testing-devops",
        name: "Testing & DevOps",
        technologies: [
          "Vitest",
          "React Testing Library",
          "57+ Test Files",
          "4 GitHub Actions Workflows",
          "TypeScript ESLint",
        ],
      },
    ],
  },
  results: {
    title: "Results & Impact",
    metrics: [
      {
        value: "5",
        label:
          "AI Integrations (GPT-4o Vision, Sentiment, Spam, Content, Events)",
      },
      { value: "25+", label: "Schema.org Types with Medical Coding" },
      { value: "60+", label: "Frontend Routes & Pages" },
      { value: "27", label: "API Endpoints" },
      { value: "57+", label: "Automated Tests" },
      { value: "26", label: "Email Templates" },
    ],
    paragraphs: [
      "The platform drives patient acquisition through programmatic SEO, with build-time generation of condition and service pages across 60+ routes. Each page carries its own JSON-LD structured data, Open Graph tags, and internal links back to the hub-and-spoke architecture.",
      "Answer Engine Optimization endpoints (/llms.txt and /llms-full.txt) serve machine-readable practice data to AI assistants, while 155+ patient reviews with sentiment analysis generate AggregateRating schema for rich search snippets.",
    ],
  },
  learnings: {
    title: "Architectural Decisions",
    items: [
      "Chose Sanity v5 over Contentful for its real-time collaboration, GROQ query language, and Presentation mode — critical for a non-technical client who edits content daily",
      "Isolated each AI integration behind its own API route with Zod-validated input/output schemas, making it possible to swap models or add rate limiting per-endpoint without touching other features",
      "Generated 25+ Schema.org types from a centralized utility rather than inline markup, so adding ICD-10 or SNOMED-CT codes to a new condition page requires zero frontend changes",
      "Built the email system with React Email components instead of HTML templates, gaining type safety, component reuse across 26 templates, and the ability to preview emails in the browser during development",
      "Invested in 57+ tests early — the SEO validation suite alone catches missing meta tags, broken structured data, and canonical URL regressions before they reach production",
    ],
  },
};

// ===== TypeScript Interfaces =====
interface FeatureCardProps {
  title: string;
  description: string;
}

interface TechImplementationSectionProps {
  heading: string;
  description: string;
}

interface TechStackCategoryProps {
  name: string;
  technologies: string[];
}

interface MetricCardProps {
  value: string;
  label: string;
}

interface LearningItemProps {
  text: string;
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
        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
);

/**
 * Technical implementation section component
 */
const TechImplementationSection: React.FC<TechImplementationSectionProps> = ({
  heading,
  description,
}) => (
  <motion.div variants={itemVariants}>
    <h3 className="mb-3 text-xl font-semibold">{heading}</h3>
    <p className="leading-relaxed text-muted-foreground">{description}</p>
  </motion.div>
);

/**
 * Technology stack category component
 */
const TechStackCategory: React.FC<TechStackCategoryProps> = ({
  name,
  technologies,
}) => (
  <motion.div variants={cardVariants} className="rounded-lg border bg-card p-4">
    <h3 className="mb-2 font-semibold">{name}</h3>
    <ul className="space-y-1 text-sm text-muted-foreground">
      {technologies.map((tech) => (
        <li key={tech}>{tech}</li>
      ))}
    </ul>
  </motion.div>
);

/**
 * Metric display card component
 */
const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
  <motion.div variants={cardVariants}>
    <Card>
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-cyan-500">
          {value}
        </CardTitle>
        <CardDescription>{label}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
);

/**
 * Learning item component with bullet point
 */
const LearningItem: React.FC<LearningItemProps> = ({ text }) => (
  <motion.li variants={itemVariants} className="flex gap-3">
    <span className="text-cyan-500">•</span>
    <span>{text}</span>
  </motion.li>
);

// ===== Main Component =====

/**
 * Align San Diego Family Chiropractic case study page showcasing a comprehensive
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
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
          <motion.div
            variants={itemVariants}
            className="mb-4 flex items-center gap-2"
          >
            <div
              className={`h-2 w-2 rounded-full ${{ cyan: "bg-cyan-500", green: "bg-green-500", blue: "bg-blue-500" }[pageData.header.badge.color]}`}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {pageData.header.badge.label}
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight text-balance"
          >
            {pageData.header.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty"
          >
            {pageData.header.description}
          </motion.p>
          <motion.div variants={itemVariants} className="mt-6 flex gap-4">
            <Button asChild>
              <a
                href={pageData.header.cta.href}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {pageData.header.cta.text}{" "}
                <pageData.header.cta.icon className="ml-2 h-4 w-4" />
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
            <motion.h2
              variants={itemVariants}
              className="mb-4 text-3xl font-bold"
            >
              {pageData.overview.title}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="leading-relaxed text-muted-foreground"
            >
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
            <motion.h2
              variants={itemVariants}
              className="mb-6 text-3xl font-bold"
            >
              {pageData.features.title}
            </motion.h2>
            <motion.div
              variants={staggerContainerVariants}
              className="grid gap-6 md:grid-cols-2"
            >
              {pageData.features.items.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  title={feature.title}
                  description={feature.description}
                />
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
            <motion.h2
              variants={itemVariants}
              className="mb-6 text-3xl font-bold"
            >
              {pageData.technicalImplementation.title}
            </motion.h2>
            <motion.div variants={containerVariants} className="space-y-6">
              {pageData.technicalImplementation.sections.map((section) => (
                <TechImplementationSection
                  key={section.id}
                  heading={section.heading}
                  description={section.description}
                />
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
            <motion.h2
              variants={itemVariants}
              className="mb-6 text-3xl font-bold"
            >
              {pageData.techStack.title}
            </motion.h2>
            <motion.div
              variants={staggerContainerVariants}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageData.techStack.categories.map((category) => (
                <TechStackCategory
                  key={category.id}
                  name={category.name}
                  technologies={category.technologies}
                />
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
            <motion.h2
              variants={itemVariants}
              className="mb-6 text-3xl font-bold"
            >
              {pageData.results.title}
            </motion.h2>
            <motion.div
              variants={staggerContainerVariants}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageData.results.metrics.map((metric, index) => (
                <MetricCard
                  key={index}
                  value={metric.value}
                  label={metric.label}
                />
              ))}
            </motion.div>

            <motion.div variants={containerVariants} className="mt-6 space-y-4">
              {pageData.results.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  className="leading-relaxed text-muted-foreground"
                >
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
            <motion.h2
              variants={itemVariants}
              className="mb-6 text-3xl font-bold"
            >
              {pageData.learnings.title}
            </motion.h2>
            <motion.ul
              variants={containerVariants}
              className="space-y-3 leading-relaxed text-muted-foreground"
            >
              {pageData.learnings.items.map((item, index) => (
                <LearningItem key={index} text={item} />
              ))}
            </motion.ul>
          </motion.section>
        </div>
      </article>
    </main>
  );
}
