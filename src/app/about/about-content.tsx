"use client";

import { motion } from "framer-motion";
import {
    Award,
    BookOpen,
    Briefcase,
    Code2,
    GraduationCap,
    type LucideIcon,
    Mic2,
    Rocket,
    Sparkles,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { technologiesData } from "@/lib/data/technologies";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const aboutPageData = {
    hero: {
        title: "About Me",
        subtitle:
            "Full-stack engineer based in San Diego. I've been doing freelance web development since 2010. In 2017 I founded RipeMetrics and scaled it to 50+ enterprise clients. Now I build production software and agentic AI systems for clients who need things that actually work.",
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
                    "Spent seven years in B2B sales and cause marketing, learning how businesses actually buy software and what makes customers stick around.",
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
                    "Built the product from scratch while leading product development, managing teams, and shaping company vision.",
                ],
            },
            {
                id: "fullstack",
                icon: Code2,
                title: "Full-Stack Developer",
                period: "2020-2025",
                color: "green",
                description: [
                    "At RipeMetrics, led complete technical refactor from Laravel Livewire to React/Next.js, reducing network response times by 6 seconds and improving overall system performance.",
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
                    "Completed AI Engineering Bootcamp (Maven) and LLM Engineering course (AI Makerspace), going deep on transformer architectures, fine-tuning, and RAG systems.",
                    "Now building client projects: a Next.js 16 wellness platform for AlignSD with Sanity CMS and structured data, and Scorpion Percussion's e-commerce stack with Turborepo, tRPC, and React Native.",
                    "Focused on agentic engineering — wiring LLMs, tool-use, and structured outputs into systems that run autonomously.",
                ],
            },
        ],
    },
    education: {
        title: "Education & Continuous Learning",
        accelerator: {
            id: "csd16",
            program: "CSD16 Startup Accelerator (formerly Canopy San Diego)",
            company: "RipeMetrics",
            period: "Mar 2017 - Jul 2017",
            location: "San Diego, CA",
            description:
                "Pitched and secured a spot for RipeMetrics in the competitive CSD16 Spring 2017 cohort, a VC-backed program for early-stage software companies in regulated markets. Completed an intensive 5-month program refining business model, go-to-market strategy, and key partnerships with industry experts and mentors. Graduated with a polished pitch deck, investor network, and clear roadmap for scaling operations.",
        },
        formal: [
            {
                id: "ucsd",
                institution: "UC San Diego Extended Studies",
                period: "Sep 2018 - Jan 2019",
                description:
                    "Customer Experience Leadership Course — Explored strategic importance of CX, evaluation methods, and best practices from industry leaders like Apple, Amazon, and Tesla.",
            },
            {
                id: "stanford-tech",
                institution: "Stanford University Online",
                period: "Oct 2016 - Jan 2017",
                description:
                    "Technology Entrepreneurship — Studied entrepreneurship process for high-impact enterprises, team formation, and Silicon Valley startup ecosystem.",
            },
            {
                id: "stanford-adv",
                institution: "Stanford University Online",
                period: "Aug 2016 - Oct 2016",
                description:
                    "Advanced Entrepreneurship — Transforming ideas into viable business concepts using Stanford GSB's Startup Canvas methodology for customer identification and go-to-market strategy.",
            },
            {
                id: "csueb",
                institution: "California State University, East Bay",
                period: "2000 - 2003",
                description:
                    "Mass Communications — Content creation and storytelling across media types including documentaries, press releases, films, and marketing campaigns.",
            },
        ],
        certifications: [
            {
                id: "claude-code",
                title: "Claude Code for Real Engineers",
                issuer: "AI Hero",
                date: "Apr 2026",
                description:
                    "Cohort-based course on production-grade AI-assisted engineering with Claude Code. Agent steering, TDD feedback loops, autonomous agents with Docker sandboxing, and human-in-the-loop patterns.",
            },
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
                id: "sanity-ai",
                title: "AI-Powered Sanity Development",
                issuer: "Sanity",
                date: "Mar 2025",
                description:
                    "Official Sanity certification covering CMS architecture, GROQ queries, schema design, and AI-powered content workflows.",
            },
            {
                id: "landing-page",
                title: "Landing Page Academy",
                issuer: "Learn UI Design",
                date: "Feb 2025",
                description:
                    "Design-focused course on high-converting landing page patterns, visual hierarchy, and conversion optimization.",
            },
            {
                id: "cursor-ai",
                title: "Cursor AI Bootcamp",
                issuer: "Maven",
                date: "Jan 2025",
                description:
                    "Intensive bootcamp on AI-assisted development workflows, prompt engineering for code generation, and IDE-integrated AI tooling.",
            },
            {
                id: "communication",
                title: "Effective Communication For Engineers",
                issuer: "Taro (YC S22)",
                date: "Sep 2024",
                description:
                    "YC-backed program on technical communication, stakeholder management, and career growth strategies for engineers.",
            },
            {
                id: "redux-rtk",
                title: "Modern Redux with RTK & TypeScript",
                issuer: "egghead.io",
                date: "Oct 2022",
                description:
                    "Advanced Redux patterns using Redux Toolkit with TypeScript for type-safe state management in React applications.",
            },
            {
                id: "nextjs-intro",
                title: "Introduction to Next.js",
                issuer: "Frontend Masters",
                date: "Jul 2022",
                description:
                    "Foundational course on the Next.js framework covering SSR, SSG, API routes, and the pages router architecture.",
            },
        ],
    },
    speakingAndPublications: {
        title: "Speaking & Publications",
        items: [
            {
                id: "birth-workers-2025",
                type: "speaking" as const,
                title: "Building an AI Content System That Captures Your Voice",
                venue: "Inspired Birth Workers Alliance Quarterly Social",
                location: "San Diego, CA",
                date: "Q4 2025",
                description:
                    "Walked attendees through building a reusable AI system that captures unique voice and generates authentic marketing content  from gathering existing content to creating a writing profile to deploying with Claude Projects.",
            },
            {
                id: "cto-coffee-2023",
                type: "speaking" as const,
                title: "Building an AI Assistant to Supercharge Developer Velocity",
                venue: "Rlentless Software Solutions CTO Coffee",
                location: "San Diego, CA",
                date: "Aug 2023",
                description:
                    "Demonstrated how I built an internal AI assistant at RipeMetrics using LangChain and Flowise to boost developer productivity.",
            },
            {
                id: "going-up-2014",
                type: "publication" as const,
                title: "How To Use Cause Marketing To Grow Your Business",
                venue: "Going Up: Proven Strategies for Reaching Higher Levels in Business (Business Excellence Press)",
                date: "Apr 2014",
                description:
                    "Published book chapter on leveraging cause marketing partnerships between for-profit businesses and nonprofits to boost revenue, increase lifetime customer value, and reduce customer acquisition costs.",
            },
        ],
    },
    differentiators: {
        title: "How I Work",
        paragraphs: [
            "My path from sales to engineering means I build software with the end user in mind, not just the spec. Seven years of selling enterprise software taught me how businesses actually buy and what makes them stick around  that instinct doesn't go away when you switch to the terminal. I ship fast, communicate clearly, and treat every project like it's my own product.",
            "I also bring genuine customer experience expertise. I completed UC San Diego's CX Leadership program, then built RipeMetrics into a Customer Experience Management platform that used NPS scores, retention analytics, and behavioral data to help 50+ businesses improve how they treat their customers. Most engineers optimize for the system. I optimize for the person using it.",
        ],
    },
    techStack: {
        title: "Technologies I Work With",
        categories: [
            {
                id: "frontend",
                title: "Frontend",
                technologies: technologiesData,
            },
            {
                id: "backend",
                title: "Backend & Database",
                technologies: ["Node.js", "Python", "FastAPI", "PostgreSQL", "MySQL", "Redis"],
            },
            {
                id: "ai",
                title: "AI & ML",
                technologies: [
                    "OpenAI API",
                    "Claude API",
                    "LangChain",
                    "RAG",
                    "Pinecone",
                    "Chroma",
                    "Vector DBs",
                ],
            },
            {
                id: "cms",
                title: "CMS & Tools",
                technologies: ["Sanity CMS", "Stripe", "Twilio"],
            },
            {
                id: "devops",
                title: "DevOps & Testing",
                technologies: ["Git", "Docker", "Vitest", "React Testing Library", "CI/CD"],
            },
            {
                id: "mobile",
                title: "Mobile & Monorepo",
                technologies: ["Expo", "React Native", "Turborepo", "tRPC"],
            },
            {
                id: "emerging",
                title: "Emerging Tech",
                technologies: ["Model Context Protocol", "MCP UI", "Claude Code", "AI Agents"],
            },
        ],
    },
    personal: {
        title: "Beyond Code",
        content:
            "When I'm not building you'll find me rock climbing around San Diego or hunting for rare vinyl records.",
    },
};

interface JourneyPhaseProps {
    icon: LucideIcon;
    title: string;
    period: string;
    color: string;
    description: string[];
}
interface EducationItemProps {
    institution: string;
    period: string;
    description: string;
}
interface CertificationItemProps {
    title: string;
    issuer: string;
    date: string;
    description: string;
}
interface SpeakingItemProps {
    type: "speaking" | "publication";
    title: string;
    venue: string;
    location?: string;
    date: string;
    description: string;
}
interface TechCategoryProps {
    title: string;
    technologies: string[];
}

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
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.orange;
};

const JourneyPhaseCard: React.FC<JourneyPhaseProps> = ({
    icon: Icon,
    title,
    period,
    color,
    description,
}) => {
    const { itemVariants } = useAnimationVariants();
    const colors = getColorClasses(color);

    return (
        <motion.div variants={itemVariants}>
            <Card className={`border-l-4 ${colors.border} h-full`}>
                <CardHeader>
                    <Icon className={`h-8 w-8 ${colors.icon} mb-2`} />
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription className="text-sm">{period}</CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2 text-sm">
                    {description.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    );
};
const EducationItem: React.FC<EducationItemProps> = ({ institution, period, description }) => (
    <div>
        <p className="text-foreground font-semibold">{institution}</p>
        <p className="text-muted-foreground mb-1 text-xs">{period}</p>
        <p>{description}</p>
    </div>
);
const CertificationItem: React.FC<CertificationItemProps> = ({
    title,
    issuer,
    date,
    description,
}) => (
    <div>
        <p className="text-foreground font-semibold">{title}</p>
        <p className="text-muted-foreground mb-1 text-xs">
            {issuer} - {date}
        </p>
        <p>{description}</p>
    </div>
);
const SpeakingItem: React.FC<SpeakingItemProps> = ({
    type,
    title,
    venue,
    location,
    date,
    description,
}) => {
    const { itemVariants } = useAnimationVariants();
    const Icon = type === "speaking" ? Mic2 : BookOpen;

    return (
        <motion.div variants={itemVariants}>
            <Card className="h-full">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Icon className="text-primary h-6 w-6 shrink-0" />
                        <div>
                            <CardTitle className="text-base">{title}</CardTitle>
                            <CardDescription className="text-xs">
                                {venue}
                                {location ? `  ${location}` : ""} {date}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                    <p>{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};
const TechCategory: React.FC<TechCategoryProps> = ({ title, technologies }) => {
    const { itemVariants } = useAnimationVariants();

    return (
        <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-lg font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        className="bg-secondary rounded-md px-3 py-1 text-sm font-medium"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </motion.div>
    );
};

export default function AboutContent() {
    const { containerVariants, itemVariants } = useAnimationVariants();

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
                    <h1 className="text-5xl font-bold tracking-tight text-balance">
                        {aboutPageData.hero.title}
                    </h1>
                    <p className="text-muted-foreground mt-6 text-xl leading-relaxed text-pretty">
                        {aboutPageData.hero.subtitle}
                    </p>
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
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
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
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
                        {aboutPageData.education.title}
                    </motion.h2>

                    <div className="grid gap-6 md:grid-cols-2" role="list">
                        {/* Left column: Accelerator + Formal Education */}
                        <div className="flex flex-col gap-6">
                            <motion.div variants={itemVariants}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="text-primary h-8 w-8 shrink-0" />
                                            <div>
                                                <CardTitle className="text-base">
                                                    {aboutPageData.education.accelerator.program}
                                                </CardTitle>
                                                <CardDescription>
                                                    {aboutPageData.education.accelerator.company}{" "}
                                                    &middot;{" "}
                                                    {aboutPageData.education.accelerator.period}{" "}
                                                    &middot;{" "}
                                                    {aboutPageData.education.accelerator.location}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground text-sm">
                                        <p>
                                            {aboutPageData.education.accelerator.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <GraduationCap className="text-primary mb-2 h-8 w-8" />
                                        <CardTitle>Formal Education</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-muted-foreground space-y-4 text-sm">
                                        {aboutPageData.education.formal.map((item) => (
                                            <EducationItem key={item.id} {...item} />
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Right column: Certifications */}
                        <motion.div variants={itemVariants}>
                            <Card className="h-full">
                                <CardHeader>
                                    <Award className="text-primary mb-2 h-8 w-8" />
                                    <CardTitle>Certifications</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground space-y-4 text-sm">
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
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
                        {aboutPageData.differentiators.title}
                    </motion.h2>
                    <div className="max-w-3xl space-y-4">
                        {aboutPageData.differentiators.paragraphs.map((paragraph, index) => (
                            <motion.p
                                key={index}
                                variants={itemVariants}
                                className="text-muted-foreground text-lg leading-relaxed"
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>

                {/* Speaking & Publications */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="mt-24"
                    aria-label="Speaking engagements and publications"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
                        {aboutPageData.speakingAndPublications.title}
                    </motion.h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
                        {aboutPageData.speakingAndPublications.items.map((item) => (
                            <SpeakingItem key={item.id} {...item} />
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
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
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
                    <motion.h2
                        variants={itemVariants}
                        className="mb-8 text-3xl font-bold tracking-tight"
                    >
                        {aboutPageData.personal.title}
                    </motion.h2>
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {aboutPageData.personal.content}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.section>
        </main>
    );
}
