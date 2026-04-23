"use client";

import { motion } from "framer-motion";
import { ArrowRight, Beer, Github, Linkedin, MapPin } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import aaronPint from "@/../public/images/aaron-pint.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { technologiesData } from "@/lib/data/technologies";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const pageData = {
    hero: {
        title: "Full-Stack Engineer & AI Systems Consultant",
        description:
            "8+ years building production software. I founded RipeMetrics — an AI-native customer growth platform — and now design and implement agentic AI systems for businesses that need more than a demo. I also build full-stack applications for clients who need software that actually works.",
        cta: {
            primary: { text: "View Projects", href: "/projects", icon: ArrowRight },
            secondary: { text: "Work with me", href: "/work-with-me", variant: "outline" as const },
        },
        image: {
            src: aaronPint,
            alt: "Aaron Davis enjoying a birthday pint at Europe\u2019s longest bar in Ireland",
            caption: "Birthday pint in Dublin, Ireland",
            location: "Hole in the Wall, Europe\u2019s Longest Pub",
            icon: Beer,
            locationIcon: MapPin,
        },
    },
    about: {
        title: "About",
        paragraphs: [
            "I founded RipeMetrics in 2017 and along with the team helped scale it from a prototype to an AI-native customer growth platform. That meant building everything \u2014 React frontends, Node/Python backends, OpenAI integrations, RAG pipelines with Pinecone, and real-time messaging systems processing thousands of interactions daily.",
            "Right now I\u2019m building agent systems for businesses alongside full-stack client work \u2014 the infrastructure layer that makes AI reliable in production rather than just impressive in a demo.",
            "I\u2019m most interested in agentic engineering: specialist agent architectures, progressive context loading, and the operational patterns that let AI systems run autonomously at the quality level a real business needs. When the agents handle the repetitive cognitive work, I focus on the architecture and the judgment calls that actually need a human.",
        ],
        techStack: {
            title: "Technologies I work with",
            technologies: technologiesData,
        },
    },
    featuredProjects: {
        title: "Featured Projects",
        viewAllText: "View all",
        viewAllHref: "/projects",
        projects: [
            {
                id: "ctrlshft",
                title: "ctrl+shft",
                description:
                    "The infrastructure behind my consulting practice. 24 skills, lifecycle hooks, a real-time compliance HUD, and hardened secrets \u2014 all from a single dotfiles repo. The same system I implement for clients, open source and in production.",
                category: "AI Infrastructure / Developer Tools",
                statusColor: "orange" as const,
                technologies: [
                    "Bash",
                    "TypeScript",
                    "Node.js",
                    "Docker",
                    "Claude Code",
                    "VS Code Copilot",
                ],
                link: "/projects/ctrlshft",
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
                    "A 44,000-line healthcare platform serving 5,000+ families \u2014 5 AI integrations, 81 JSON-LD schemas, 158 programmatic pages, and 27 email templates. Built solo.",
                category: "Healthcare / Web",
                statusColor: "cyan" as const,
                technologies: ["Next.js 16", "Sanity v5", "TypeScript", "OpenAI", "React Email"],
                link: "/projects/align-san-diego-family-chiropractic",
                linkText: "View case study",
            },
            // TODO: Re-enable when Scorpion Percussion project is further along
            // {
            //     id: "scorpion-percussion",
            //     title: "Scorpion Percussion",
            //     description:
            //         "E-commerce platform for a percussion instrument brand. Monorepo architecture with shared type-safe API layer and native mobile storefront.",
            //     category: "E-commerce / Mobile",
            //     statusColor: "purple" as const,
            //     technologies: ["Turborepo", "tRPC", "Expo", "React Native", "TypeScript"],
            // },
        ],
    },
    contact: {
        title: "Work with me",
        description:
            "I design and implement AI agent systems for businesses, and build full-stack applications for clients who need production-grade software.",
        descriptionCta:
            "If you\u2019re a business looking to systematize how your team works with AI \u2014 or a developer who needs a technical partner \u2014 let\u2019s talk.",
        ctaText: "Work with me",
        ctaHref: "/work-with-me",
        socialLinks: [
            { type: "github", text: "GitHub", href: "https://github.com/arndvs", icon: Github },
            {
                type: "linkedin",
                text: "LinkedIn",
                href: "https://linkedin.com/in/arndvs",
                icon: Linkedin,
            },
        ],
    },
};

interface ProjectCardProps {
    title: string;
    description: string;
    category: string;
    statusColor: "green" | "blue" | "purple" | "cyan" | "orange";
    technologies: string[];
    link?: string;
    linkText?: string;
}

interface SocialLinkProps {
    type: string;
    text: string;
    href: string;
    icon: React.ElementType;
}

interface TechStackProps {
    technologies: string[];
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
    const { cardVariants } = useAnimationVariants();
    const statusColorMap = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        purple: "bg-purple-500",
        cyan: "bg-cyan-500",
        orange: "bg-orange-500",
    };

    return (
        <motion.div variants={cardVariants}>
            <Card className="group hover:border-primary/50 overflow-hidden transition-all">
                <CardHeader>
                    <div className="mb-2 flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${statusColorMap[statusColor]}`} />
                        <span className="text-muted-foreground text-xs font-medium">
                            {category}
                        </span>
                    </div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                            <span
                                key={tech}
                                className="bg-secondary rounded-md px-2 py-1 text-xs font-medium"
                            >
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
    );
};

const SocialLink: React.FC<SocialLinkProps> = ({ text, href, icon: Icon }) => {
    return (
        <Button asChild size="lg" variant="outline">
            <a href={href} target="_blank" rel="noopener noreferrer">
                <Icon className="mr-2 h-4 w-4" />
                {text}
            </a>
        </Button>
    );
};

const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
    const { itemVariants } = useAnimationVariants();

    return (
        <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
                <motion.span
                    key={tech}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="bg-secondary rounded-md px-3 py-1 text-sm font-medium"
                >
                    {tech}
                </motion.span>
            ))}
        </div>
    );
};

export default function HomeContent() {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <main className="min-h-screen pt-16">
            {/* Hero -- instant render, no Framer Motion (above-the-fold) */}
            <section
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Hero section"
            >
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Content Column */}
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-7xl">
                            {pageData.hero.title}
                        </h1>
                        <p className="text-muted-foreground mt-6 text-2xl leading-relaxed text-pretty">
                            {pageData.hero.description}
                        </p>
                        <div className="mt-10 flex items-center gap-4">
                            <Button asChild size="lg">
                                <Link href={pageData.hero.cta.primary.href}>
                                    {pageData.hero.cta.primary.text}{" "}
                                    <pageData.hero.cta.primary.icon className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant={pageData.hero.cta.secondary.variant}>
                                <Link href={pageData.hero.cta.secondary.href}>
                                    {pageData.hero.cta.secondary.text}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div>
                        <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-xl">
                            <Image
                                alt={pageData.hero.image.alt}
                                src={pageData.hero.image.src}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            <div className="absolute right-4 bottom-4 left-4 z-20 rounded-xl border border-white/20 bg-black/60 p-4 backdrop-blur-md md:right-6 md:bottom-6 md:left-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                                        <pageData.hero.image.icon className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {pageData.hero.image.caption}
                                        </p>
                                        <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
                                            <pageData.hero.image.locationIcon className="h-3 w-3" />
                                            <span>{pageData.hero.image.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="About Aaron Davis"
            >
                <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
                    {pageData.about.title}
                </motion.h2>
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                    <motion.div
                        variants={itemVariants}
                        className="text-muted-foreground space-y-4 text-lg leading-relaxed"
                    >
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
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Featured projects"
            >
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">
                        {pageData.featuredProjects.title}
                    </h2>
                    <Button asChild variant="ghost">
                        <Link href={pageData.featuredProjects.viewAllHref}>
                            {pageData.featuredProjects.viewAllText}{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
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
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Contact information"
            >
                <motion.div
                    variants={itemVariants}
                    className="border-border bg-card rounded-lg border p-8 lg:p-12"
                >
                    <h2 className="text-3xl font-bold tracking-tight">{pageData.contact.title}</h2>
                    <p className="text-muted-foreground mt-4 text-lg">
                        {pageData.contact.description}
                    </p>
                    <p className="text-muted-foreground mt-2 text-lg">
                        {pageData.contact.descriptionCta}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button asChild size="lg">
                            <Link href={pageData.contact.ctaHref}>
                                {pageData.contact.ctaText} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        {pageData.contact.socialLinks.map((link) => (
                            <SocialLink key={link.type} {...link} />
                        ))}
                    </div>
                </motion.div>
            </motion.section>
        </main>
    );
}
