"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants, cardVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const projectData = {
  meta: {
    category: "Digital Transformation • Web Development • Marketing Automation",
    title: "MainStream Merchant Services",
    subtitle: "Regional Sales Manager & Web Technology Lead • 2013-2017",
    statusColor: "orange",
  },
  overview: {
    title: "Overview",
    content:
      "Led a comprehensive digital transformation for MainStream Merchant Services, a credit card processing company based in Alpharetta, GA (acquired by Global Payments Inc). Spearheaded a complete corporate rebranding initiative that included creating a new brand identity from scratch, tearing down and rebuilding the entire website, and implementing sophisticated marketing automation systems that transformed lead generation and sales operations.",
  },
  responsibilities: {
    title: "Role & Responsibilities",
    items: [
      "Led complete corporate rebranding project, creating new brand identity including logo, color palette, typography, and brand guidelines",
      "Designed and built new corporate website from scratch, including complete tear down of existing site and ground-up rebuild",
      "Developed and implemented marketing automation systems using Infusionsoft",
      "Designed and built online lead generation funnels with automated follow-up campaigns",
      "Created automated round-robin lead distribution system for Account Executives",
      "Managed remote sales team across multiple states while maintaining consultative sales approach",
    ],
  },
  sections: [
    {
      id: "website",
      title: "Website Redesign & Development",
      content:
        "Executed a complete website overhaul, tearing down the existing site and rebuilding from the ground up. The new website aligned with the refreshed brand identity and served as the foundation for integrated marketing automation and lead generation systems. This project marked my entry into web development, teaching myself HTML, CSS, JavaScript, and CMS platforms while delivering a production-ready corporate website.",
    },
    {
      id: "branding",
      title: "Corporate Rebranding & Brand Identity",
      content:
        "Created a comprehensive new brand identity for MainStream Merchant Services, including logo design, color palette selection, typography system, and brand guidelines. The rebranding effort modernized the company's visual presence and positioned it competitively in the merchant services industry. This work required balancing creative design with business strategy, ensuring the new brand resonated with target customers while differentiating from competitors.",
    },
    {
      id: "automation",
      title: "Marketing Automation Implementation",
      content:
        "Built sophisticated Infusionsoft campaign sequences featuring multi-branch email funnels with conditional logic. The system intelligently paused main email sequences when prospects engaged with promotional content, ensuring relevant messaging without overwhelming leads.",
    },
  ],
  campaignArchitecture: {
    title: "Campaign Architecture",
    images: [
      {
        id: "main-sequence",
        title: "Main Sequence with Promo Branches",
        description:
          "Hand-drawn concept showing how the main email sequence pauses when a prospect clicks into a promotional sequence, then resumes after the promo completes.",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MainSequencewithPromos_zps5488f480-LkIDNK8OTIAdYYDpQwDhupmAbH52yn.webp",
        alt: "Hand-drawn sketch of main sequence with promo branches",
        width: 1200,
        height: 600,
      },
      {
        id: "simple-flow",
        title: "Simple Sequence Flow",
        description: "Basic structure showing main sequence emails with promotional branches.",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/xTQLQO1%20%281%29-UTb04CJMZaRyQm4qYZgQzCnyZEoRr2.png",
        alt: "Simple sequence flow diagram",
        width: 1200,
        height: 400,
      },
      {
        id: "campaign-builder",
        title: "Detailed Campaign Builder Implementation",
        description:
          "Infusionsoft campaign showing the complete flow with click tracking, delay timers, tag management, and sequence control logic.",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kd2jmdN%20%281%29-1mT6yZXU92pKEqf7hZ3ijfxMDOoecX.jpg",
        alt: "Detailed Infusionsoft campaign builder showing main sequence with promo logic",
        width: 1600,
        height: 600,
      },
      {
        id: "promo-detail",
        title: "Single Promo Sequence Detail",
        description: "Close-up of a single promotional sequence showing goal tracking, tag application, and sequence restart logic.",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rvKyPoE%20%281%29-ywM9zEjMABjsuNc7r4mglnPRzQlPsj.png",
        alt: "Single promo sequence with goal tracking and tag management",
        width: 1200,
        height: 600,
      },
      {
        id: "multi-promo",
        title: "Complete Multi-Promo Campaign",
        description:
          "Full campaign architecture with 4 promotional sequences, success/fail tracking, CTA completion goals, and sophisticated tag-based flow control.",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/OjCoTlA%20%281%29-CMspuErna9P176VpVCQK6PrJzTzPAR.png",
        alt: "Complete multi-promo campaign with 4 sequences and advanced logic",
        width: 1600,
        height: 800,
      },
    ],
  },
  features: {
    title: "Key Features",
    items: [
      {
        id: "website-rebuild",
        title: "Complete Website Rebuild",
        description:
          "Ground-up website redesign and development, replacing legacy site with modern, responsive design aligned with new brand identity.",
      },
      {
        id: "brand-identity",
        title: "Brand Identity Creation",
        description:
          "Comprehensive rebranding including logo design, color palette, typography system, and brand guidelines for consistent visual identity.",
      },
      {
        id: "conditional-logic",
        title: "Conditional Sequence Logic",
        description:
          "Tag-based system to pause main sequences when prospects engaged with promotional content, ensuring relevant messaging without overwhelming leads.",
      },
      {
        id: "click-tracking",
        title: "Click Tracking & Goals",
        description:
          "Monitored link clicks and CTA completion to trigger appropriate follow-up sequences and measure campaign effectiveness.",
      },
      {
        id: "lead-distribution",
        title: "Automated Lead Distribution",
        description:
          "Round-robin system to distribute qualified leads to Account Executives, optimizing response times and sales team efficiency.",
      },
      {
        id: "multi-branch",
        title: "Multi-Branch Campaigns",
        description:
          "Complex campaign architecture with multiple promotional branches, success/fail tracking, and automatic sequence resumption.",
      },
    ],
  },
  impact: {
    title: "Business Impact",
    metrics: [
      {
        id: "modernized",
        value: "Modernized",
        label: "Brand Presence",
        description: "Complete digital transformation with new brand identity and website positioned company competitively",
      },
      {
        id: "improved",
        value: "Improved",
        label: "Lead Nurturing",
        description: "Significantly enhanced lead conversion rates through automated, personalized follow-up sequences",
      },
      {
        id: "streamlined",
        value: "Streamlined",
        label: "Operations",
        description: "Integrated sales and marketing technologies to optimize team efficiency and customer acquisition",
      },
    ],
  },
  technologies: [
    "HTML/CSS/JavaScript",
    "Web Development",
    "CMS Platforms",
    "Graphic Design",
    "Brand Identity",
    "Infusionsoft (Keap)",
    "Marketing Automation",
    "Campaign Builder",
    "Tag Management",
    "Lead Generation Funnels",
    "CRM Integration",
    "Email Marketing",
  ],
  reflection: {
    title: "Early Technical Foundation",
    content:
      "This role marked my transition from sales into technology. While managing West Coast sales operations, I taught myself web development and marketing automation, building the technical foundation that would later enable me to found RipeMetrics. The experience of combining business strategy with technical implementation became a defining characteristic of my career.",
  },
  ctas: [
    { text: "View all projects", href: "/projects", variant: "default" as const },
    { text: "Learn more about my journey", href: "/about", variant: "outline" as const },
  ],
}

// ===== TypeScript Interfaces =====

/**
 * Props for ContentSection component
 * @property {string} title - Section title
 * @property {string} content - Section content text
 */
interface ContentSectionProps {
  title: string
  content: string
}

/**
 * Props for CampaignImage component
 * @property {string} title - Image title
 * @property {string} description - Image description
 * @property {string} src - Image source URL
 * @property {string} alt - Image alt text
 * @property {number} width - Image width
 * @property {number} height - Image height
 */
interface CampaignImageProps {
  title: string
  description: string
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Props for FeatureCard component
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 */
interface FeatureCardProps {
  title: string
  description: string
}

/**
 * Props for ImpactMetric component
 * @property {string} value - Metric value (e.g., "Modernized")
 * @property {string} label - Metric label
 * @property {string} description - Metric description
 */
interface ImpactMetricProps {
  value: string
  label: string
  description: string
}

// ===== Subcomponents =====

/**
 * Content section with title and paragraph
 */
const ContentSection: React.FC<ContentSectionProps> = ({ title, content }) => (
  <motion.div variants={itemVariants}>
    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{content}</p>
  </motion.div>
)

/**
 * Campaign architecture image with title and description
 */
const CampaignImage: React.FC<CampaignImageProps> = ({ title, description, src, alt, width, height }) => (
  <motion.div variants={itemVariants} className="space-y-4">
    <h4 className="font-medium">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="rounded-lg border border-border overflow-hidden bg-white">
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
    </div>
  </motion.div>
)

/**
 * Feature card component
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <motion.div variants={cardVariants}>
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

/**
 * Business impact metric card
 */
const ImpactMetric: React.FC<ImpactMetricProps> = ({ value, label, description }) => (
  <motion.div variants={cardVariants}>
    <Card className="h-full hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="text-3xl font-bold text-primary">{value}</div>
        <div className="mt-2 text-sm font-medium">{label}</div>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

// ===== Main Component =====

/**
 * MainStream Merchant Services project case study page.
 * Showcases digital transformation work including website redesign, corporate rebranding,
 * and marketing automation implementation from 2013-2017.
 * 
 * Features:
 * - Hero section with project metadata
 * - Role and responsibilities overview
 * - Detailed content sections for website, branding, and automation work
 * - Campaign architecture visualization with multiple diagrams
 * - Key features grid
 * - Business impact metrics
 * - Technology stack tags
 * - Career reflection section
 * - Navigation CTAs
 * 
 * All sections use Framer Motion's whileInView for smooth scroll-triggered animations.
 * 
 * @example
 * // Automatically rendered at /projects/mainstream-merchant-services route
 * <MainStreamMerchantPage />
 */
export default function MainStreamMerchantPage() {
  return (
    <main className="min-h-screen pt-16">
      <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm" className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to projects
          </Link>
        </Button>

        {/* Hero */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="space-y-4"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full bg-${projectData.meta.statusColor}-500`} />
            <span className="text-sm font-medium text-muted-foreground">{projectData.meta.category}</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight text-balance">
            {projectData.meta.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-muted-foreground">
            {projectData.meta.subtitle}
          </motion.p>
        </motion.div>

        <div className="mt-12 space-y-8">
          {/* Overview */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Project overview"
          >
            <ContentSection {...projectData.overview} />
          </motion.section>

          {/* Responsibilities */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Roles and responsibilities"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>{projectData.responsibilities.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    {projectData.responsibilities.items.map((item, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* Content Sections */}
          {projectData.sections.map((section) => (
            <motion.section
              key={section.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              aria-label={section.title}
            >
              <ContentSection title={section.title} content={section.content} />
            </motion.section>
          ))}

          {/* Campaign Architecture */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-6"
            aria-label="Campaign architecture"
          >
            <motion.h3 variants={itemVariants} className="text-xl font-semibold">
              {projectData.campaignArchitecture.title}
            </motion.h3>
            <div className="space-y-4">
              {projectData.campaignArchitecture.images.map((image) => (
                <CampaignImage key={image.id} {...image} />
              ))}
            </div>
          </motion.section>

          {/* Key Features */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Key features"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold tracking-tight">
              {projectData.features.title}
            </motion.h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {projectData.features.items.map((feature) => (
                <FeatureCard key={feature.id} title={feature.title} description={feature.description} />
              ))}
            </div>
          </motion.section>

          {/* Business Impact */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Business impact"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold tracking-tight">
              {projectData.impact.title}
            </motion.h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {projectData.impact.metrics.map((metric) => (
                <ImpactMetric key={metric.id} value={metric.value} label={metric.label} description={metric.description} />
              ))}
            </div>
          </motion.section>

          {/* Technologies */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Technologies used"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold tracking-tight">
              Technologies Used
            </motion.h2>
            <motion.div variants={itemVariants} className="mt-6 flex flex-wrap gap-3">
              {projectData.technologies.map((tech) => (
                <span key={tech} className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium">
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.section>

          {/* Reflection */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            aria-label="Career reflection"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold">{projectData.reflection.title}</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">{projectData.reflection.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* CTAs */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex gap-4"
          >
            {projectData.ctas.map((cta, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Button asChild variant={cta.variant}>
                  <Link href={cta.href}>{cta.text}</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
