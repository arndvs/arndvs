"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Rocket, Code2, Sparkles, Award, GraduationCap, type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { containerVariants, itemVariants } from "@/lib/utils/animations"

// ===== Page Data =====
const aboutPageData = {
  hero: {
    title: "About Me",
    subtitle:
      "A self-taught engineer with a non-traditional path from sales and marketing to building AI-powered platforms serving enterprise clients.",
  },
  journey: {
    title: "The Journey",
    phases: [
      {
        id: "sales",
        icon: BookOpen,
        title: "Sales & Marketing",
        period: "2010-2017",
        color: "orange",
        description: [
          "Started as a Cause Marketing & Customer Loyalty Solutions Specialist, learning the fundamentals of customer experience and business strategy.",
          'Authored a chapter in "Going Up: Proven Strategies for Reaching Higher Levels in Business" on cause marketing implementation.',
          "Worked as Regional Sales Manager at Mainstream Merchant Services, where I began exploring web development and marketing automation.",
        ],
      },
      {
        id: "founder",
        icon: Rocket,
        title: "Founder & CEO",
        period: "2017-2020",
        color: "blue",
        description: [
          "Founded RipeMetrics and graduated from the CSD16 accelerator program, a venture capital-backed program for early-stage software companies.",
          "Taught myself to code out of necessity while building the product from scratch. Started with basic web development and progressively learned React, TypeScript, and full-stack development.",
          "Led product development, managed diverse teams, and shaped company vision while learning software engineering in real-time.",
        ],
      },
      {
        id: "fullstack",
        icon: Code2,
        title: "Full-Stack Developer",
        period: "2020-2025",
        color: "green",
        description: [
          "Led complete technical refactor from Laravel Livewire to React/Next.js, reducing network response times by 6 seconds and improving overall system performance.",
          "Built AI-powered chatbot with OpenAI, MySQL, and vector databases (Pinecone/Chroma). Created website content extraction system reducing client onboarding from 20 minutes to 2 minutes.",
          "Scaled platform to 50+ enterprise clients processing thousands of customer interactions daily, while maintaining 95%+ system uptime.",
        ],
      },
      {
        id: "ai",
        icon: Sparkles,
        title: "AI Engineer",
        period: "2024-Present",
        color: "purple",
        description: [
          "Completed AI Engineering Bootcamp (Maven) and LLM Engineering course (AI Makerspace), diving deep into transformer architectures, fine-tuning, and RAG systems.",
          "Currently exploring Model Context Protocol (MCP) UI development through Kent C. Dodds' intensive course - building hybrid interfaces where conversation meets traditional UI.",
          "Excited about being early to this technology, similar to the early days of React or mobile-first design. Building at the intersection of AI and user experience.",
        ],
      },
    ],
  },
  education: {
    title: "Education & Continuous Learning",
    formal: [
      {
        id: "ucsd",
        institution: "UC San Diego Extended Studies",
        period: "Sep 2018 - Jan 2019",
        description:
          "Customer Experience Leadership Course - Explored strategic importance of CX, evaluation methods, and best practices from industry leaders like Apple, Amazon, and Tesla.",
      },
      {
        id: "stanford",
        institution: "Stanford University Online",
        period: "Oct 2016 - Jan 2017",
        description:
          "Technology Entrepreneurship - Studied entrepreneurship process for high-impact enterprises, team formation, and Silicon Valley startup ecosystem.",
      },
    ],
    certifications: [
      {
        id: "mcp",
        title: "Master the Model Context Protocol (MCP)",
        issuer: "Kent C. Dodds",
        date: "Sept 2025",
        description:
          "Intensive 2-week cohort on MCP fundamentals, advanced features, UI development, and OAuth 2.1 authorization for AI-native applications.",
      },
      {
        id: "ai-bootcamp",
        title: "AI Engineering Bootcamp",
        issuer: "Maven",
        date: "Mar 2025",
        description:
          "10-week intensive bootcamp on building production-ready AI agent applications, including RAG, fine-tuning, and multi-agent systems.",
      },
      {
        id: "llm",
        title: "LLM Engineering - Foundations to SLMs",
        issuer: "AI Makerspace",
        date: "Nov 2024",
        description:
          "6-week course on transformer architectures, fine-tuning techniques (LoRA, QLoRA), model alignment (DPO, RLHF), and SLM optimization.",
      },
      {
        id: "sanity",
        title: "AI-powered Sanity Development",
        issuer: "Sanity",
        date: "Mar 2025",
        description: "Advanced Sanity CMS development with AI integration for content management systems.",
      },
    ],
  },
  differentiators: {
    title: "What Makes Me Different",
    items: [
      {
        id: "business",
        title: "Business + Technical",
        description:
          "My background in sales, marketing, and customer experience gives me a unique perspective. I don't just build features - I build solutions that drive measurable business outcomes like 40% cost reduction and 95%+ uptime.",
      },
      {
        id: "self-taught",
        title: "Self-Taught & Resourceful",
        description:
          "I learned to code by building a real product for real customers. This taught me to be resourceful, pragmatic, and focused on shipping working software rather than perfect code. I'm comfortable learning new technologies quickly.",
      },
      {
        id: "early-adopter",
        title: "Early Adopter Mindset",
        description:
          "I'm excited about being early to emerging technologies like MCP UI development. Having built systems from scratch, I have good intuition for where new patterns add value versus where traditional approaches still make sense.",
      },
    ],
  },
  techStack: {
    title: "Technologies I Work With",
    categories: [
      {
        id: "frontend",
        title: "Frontend",
        technologies: ["React", "Next.js", "TypeScript", "Redux RTK", "Preact", "Tailwind CSS", "Material UI", "Framer Motion"],
      },
      {
        id: "backend",
        title: "Backend & Database",
        technologies: ["Node.js", "Python", "FastAPI", "PostgreSQL", "MySQL", "Redis"],
      },
      {
        id: "ai",
        title: "AI & ML",
        technologies: ["OpenAI API", "Claude API", "LangChain", "RAG", "Pinecone", "Chroma", "Vector DBs"],
      },
      {
        id: "cms",
        title: "CMS & Tools",
        technologies: ["Sanity CMS", "Stripe", "Twilio", "ElevenLabs", "n8n", "GoHighLevel"],
      },
      {
        id: "devops",
        title: "DevOps & Testing",
        technologies: ["Git", "Docker", "Vitest", "React Testing Library", "CI/CD"],
      },
      {
        id: "emerging",
        title: "Emerging Tech",
        technologies: ["Model Context Protocol", "MCP UI", "Remote DOM", "AI Agents"],
      },
    ],
  },
  personal: {
    title: "Beyond Code",
    content:
      "When I'm not building the future of AI interfaces, you'll find me rock climbing around San Diego or hunting for rare vinyl records. I believe the best engineers are well-rounded people who bring diverse perspectives to their work. My non-traditional path into tech has taught me that there's no single \"right way\" to become a great engineer - curiosity, persistence, and a willingness to learn are what matter most.",
  },
}

// ===== TypeScript Interfaces =====

/**
 * Props for JourneyPhaseCard component
 * @property {LucideIcon} icon - Icon component from lucide-react
 * @property {string} title - Phase title
 * @property {string} period - Time period
 * @property {string} color - Color theme (orange, blue, green, purple)
 * @property {string[]} description - Array of description paragraphs
 */
interface JourneyPhaseProps {
  icon: LucideIcon
  title: string
  period: string
  color: string
  description: string[]
}

/**
 * Props for EducationCard component
 * @property {string} institution - Institution name
 * @property {string} period - Time period
 * @property {string} description - Course description
 */
interface EducationItemProps {
  institution: string
  period: string
  description: string
}

/**
 * Props for CertificationCard component
 * @property {string} title - Certification title
 * @property {string} issuer - Issuing organization
 * @property {string} date - Completion date
 * @property {string} description - Certification description
 */
interface CertificationItemProps {
  title: string
  issuer: string
  date: string
  description: string
}

/**
 * Props for DifferentiatorCard component
 * @property {string} title - Differentiator title
 * @property {string} description - Differentiator description
 */
interface DifferentiatorProps {
  title: string
  description: string
}

/**
 * Props for TechCategory component
 * @property {string} title - Category title
 * @property {string[]} technologies - Array of technology names
 */
interface TechCategoryProps {
  title: string
  technologies: string[]
}

// ===== Helper Functions =====

/**
 * Get Tailwind color classes for journey phase cards
 */
const getColorClasses = (color: string) => {
  const colorMap = {
    orange: {
      border: "border-l-orange-500",
      icon: "text-orange-500",
    },
    blue: {
      border: "border-l-blue-500",
      icon: "text-blue-500",
    },
    green: {
      border: "border-l-green-500",
      icon: "text-green-500",
    },
    purple: {
      border: "border-l-purple-500",
      icon: "text-purple-500",
    },
  }
  return colorMap[color as keyof typeof colorMap] || colorMap.orange
}

// ===== Subcomponents =====

/**
 * Journey phase card displaying career stage information
 */
const JourneyPhaseCard: React.FC<JourneyPhaseProps> = ({ icon: Icon, title, period, color, description }) => {
  const colors = getColorClasses(color)

  return (
    <motion.div variants={itemVariants}>
      <Card className={`border-l-4 ${colors.border} h-full`}>
        <CardHeader>
          <Icon className={`h-8 w-8 ${colors.icon} mb-2`} />
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{period}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          {description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Education item card
 */
const EducationItem: React.FC<EducationItemProps> = ({ institution, period, description }) => (
  <div>
    <p className="font-semibold text-foreground">{institution}</p>
    <p className="text-xs text-muted-foreground mb-1">{period}</p>
    <p>{description}</p>
  </div>
)

/**
 * Certification item card
 */
const CertificationItem: React.FC<CertificationItemProps> = ({ title, issuer, date, description }) => (
  <div>
    <p className="font-semibold text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground mb-1">
      {issuer} - {date}
    </p>
    <p>{description}</p>
  </div>
)

/**
 * Differentiator card
 */
const DifferentiatorCard: React.FC<DifferentiatorProps> = ({ title, description }) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  </motion.div>
)

/**
 * Technology category section
 */
const TechCategory: React.FC<TechCategoryProps> = ({ title, technologies }) => (
  <motion.div variants={itemVariants}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span key={tech} className="rounded-md bg-secondary px-3 py-1 text-sm font-medium">
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
)

// ===== Main Component =====

/**
 * About page component showcasing Aaron Davis's professional journey, education, and expertise.
 * Features scroll-triggered animations, timeline cards, and comprehensive technology stack.
 * 
 * Sections include:
 * - Hero introduction
 * - Career journey timeline (4 phases: Sales → Founder → Full-Stack → AI Engineer)
 * - Education and certifications
 * - Differentiators and unique value proposition
 * - Technologies and tools organized by category
 * - Personal interests and philosophy
 * 
 * All content sections use Framer Motion's whileInView for smooth scroll-triggered animations.
 * Cards feature color-coded left borders to visually distinguish career phases.
 * 
 * @example
 * // Automatically rendered at /about route
 * <AboutPage />
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        aria-label="Introduction"
      >
        <motion.div variants={itemVariants} className="max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight text-balance">{aboutPageData.hero.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty">{aboutPageData.hero.subtitle}</p>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-16"
          aria-label="Career journey timeline"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8">
            {aboutPageData.journey.title}
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" role="list">
            {aboutPageData.journey.phases.map((phase) => (
              <JourneyPhaseCard key={phase.id} {...phase} />
            ))}
          </div>
        </motion.div>

        {/* Education & Certifications */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24"
          aria-label="Education and certifications"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8">
            {aboutPageData.education.title}
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2" role="list">
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Formal Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {aboutPageData.education.formal.map((item) => (
                    <EducationItem key={item.id} {...item} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Recent Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {aboutPageData.education.certifications.map((cert) => (
                    <CertificationItem key={cert.id} {...cert} />
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* What Makes Me Different */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24"
          aria-label="Unique differentiators"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8">
            {aboutPageData.differentiators.title}
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3" role="list">
            {aboutPageData.differentiators.items.map((item) => (
              <DifferentiatorCard key={item.id} {...item} />
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24"
          aria-label="Technology stack"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8">
            {aboutPageData.techStack.title}
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list">
            {aboutPageData.techStack.categories.map((category) => (
              <TechCategory key={category.id} {...category} />
            ))}
          </div>
        </motion.div>

        {/* Personal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24"
          aria-label="Personal interests"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-8">
            {aboutPageData.personal.title}
          </motion.h2>
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground leading-relaxed">{aboutPageData.personal.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  )
}

