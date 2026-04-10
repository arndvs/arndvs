"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MermaidDiagram } from "@/components/mermaid-diagram"
import { AnimatedCounter } from "@/components/animated-counter"
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants"
import type {
    HeroData,
    SituationData,
    ArchitectureData,
    DeepDive,
    Decision,
    Learning,
    Metric,
    CTAData,
    GalleryImage,
} from "@/lib/types/case-study"
import { ExternalLink, ArrowLeft, RefreshCcw, Layers, Wrench } from "lucide-react"

export type AccentColor = "orange" | "cyan" | "green"

interface AccentClasses {
    dot: string
    text: string
    textSubtle: string
    borderL: string
    link: string
}

const accentMap: Record<AccentColor, AccentClasses> = {
    orange: {
        dot: "bg-orange-500",
        text: "text-orange-500",
        textSubtle: "text-orange-500/80",
        borderL: "border-l-orange-500",
        link: "text-orange-600",
    },
    cyan: {
        dot: "bg-cyan-500",
        text: "text-cyan-500",
        textSubtle: "text-cyan-500/80",
        borderL: "border-l-cyan-500",
        link: "text-cyan-600",
    },
    green: {
        dot: "bg-green-500",
        text: "text-green-500",
        textSubtle: "text-green-500/80",
        borderL: "border-l-green-500",
        link: "text-green-600",
    },
}

const defaultLearningIcons = [RefreshCcw, Layers, Wrench]

export interface CaseStudyConfig {
    accentColor: AccentColor
    diagrams: Record<string, string>
    subsystemIcons: Record<string, React.ElementType>
    fallbackIcon: React.ElementType
    learningIcons?: React.ElementType[]
}

export function createCaseStudySections(config: CaseStudyConfig) {
    const accent = accentMap[config.accentColor]
    const { diagrams, subsystemIcons, fallbackIcon } = config
    const learningIcons = config.learningIcons ?? defaultLearningIcons

    function BackButton() {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Button asChild variant="ghost" className="mb-8">
                    <Link href="/projects">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Link>
                </Button>
            </motion.div>
        )
    }

    function HeroSection({ data }: { data: HeroData }) {
        const { containerVariants, itemVariants } = useAnimationVariants()

        return (
            <motion.header
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.div variants={itemVariants} className="mb-4 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${accent.dot}`} />
                    <span className="text-sm font-medium text-muted-foreground">{data.badge}</span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl font-bold tracking-tight text-balance"
                >
                    {data.title}
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mt-6 text-xl leading-relaxed text-muted-foreground text-pretty"
                >
                    {data.tagline}
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
                >
                    {data.stats.map((stat) => (
                        <span key={stat.label} className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{stat.value}</span>
                            {stat.label}
                        </span>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} className="mt-8">
                    <Button asChild>
                        <a href={data.cta.href} target="_blank" rel="noopener noreferrer">
                            {data.cta.text}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </motion.div>

                {data.screenshotSrc && (
                    <motion.div variants={itemVariants} className="mt-12 overflow-hidden rounded-lg border border-border">
                        <Image
                            src={data.screenshotSrc}
                            alt={data.screenshotAlt ?? ""}
                            width={1440}
                            height={900}
                            className="w-full"
                            priority
                        />
                    </motion.div>
                )}
            </motion.header>
        )
    }

    function SituationSection({ data }: { data: SituationData }) {
        const { containerVariants, itemVariants, cardVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold">
                    The Situation
                </motion.h2>

                <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
                    <motion.div variants={containerVariants} className="space-y-4">
                        {data.narrative.map((paragraph, i) => (
                            <motion.p
                                key={i}
                                variants={itemVariants}
                                className="leading-relaxed text-muted-foreground"
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </motion.div>

                    <motion.div variants={cardVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Project Context</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <span className="font-medium">Role</span>
                                    <p className="text-muted-foreground">{data.context.role}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Timeline</span>
                                    <p className="text-muted-foreground">{data.context.timeline}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Client</span>
                                    <p className="text-muted-foreground">{data.context.client}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Live</span>
                                    <p>
                                        <a
                                            href={`https://${data.context.live}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${accent.link} underline underline-offset-2`}
                                        >
                                            {data.context.live}
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Stack</span>
                                    <div className="mt-1 flex flex-wrap gap-1.5">
                                        {data.context.stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.section>
        )
    }

    function ArchitectureSection({ data }: { data: ArchitectureData }) {
        const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold">
                    System Architecture
                </motion.h2>

                <motion.p variants={itemVariants} className="mb-8 leading-relaxed text-muted-foreground">
                    {data.intro}
                </motion.p>

                <motion.div variants={itemVariants} className="mb-10">
                    <MermaidDiagram chart={diagrams[data.diagramKey] ?? ""} />
                </motion.div>

                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {data.subsystems.map((sub) => {
                        const Icon = subsystemIcons[sub.title] ?? fallbackIcon

                        return (
                            <motion.div key={sub.title} variants={cardVariants}>
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${accent.text}`} />
                                            <CardTitle className="text-sm">{sub.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{sub.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </motion.section>
        )
    }

    function DeepDiveSection({ data }: { data: DeepDive }) {
        const { containerVariants, itemVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.div variants={itemVariants} className="mb-6">
                    <h3 className="text-2xl font-bold">{data.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{data.subtitle}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6">
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        The Problem
                    </h4>
                    <p className="leading-relaxed text-muted-foreground">{data.problem}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-8">
                    <MermaidDiagram chart={diagrams[data.diagramKey] ?? ""} />
                </motion.div>

                <motion.div variants={containerVariants} className="mb-8 space-y-4">
                    {data.walkthrough.map((paragraph, i) => (
                        <motion.p
                            key={i}
                            variants={itemVariants}
                            className="leading-relaxed text-muted-foreground"
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className={`rounded-lg border-l-4 ${accent.borderL} bg-muted/50 p-6`}
                >
                    <p className="mb-2 text-sm font-semibold">{data.insight.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">{data.insight.body}</p>
                </motion.div>

                {data.screenshotSrc && (
                    <motion.div variants={itemVariants} className="mt-8 overflow-hidden rounded-lg border">
                        <Image
                            src={data.screenshotSrc}
                            alt={data.screenshotAlt ?? `${data.title} screenshot`}
                            width={1200}
                            height={800}
                            className="w-full"
                        />
                    </motion.div>
                )}
            </motion.section>
        )
    }

    function DecisionLog({ decisions }: { decisions: Decision[] }) {
        const { containerVariants, itemVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold">
                    Engineering Decisions
                </motion.h2>

                <motion.div variants={containerVariants} className="space-y-4">
                    {decisions.map((d, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className={`rounded-lg p-5 ${i % 2 === 0 ? "bg-muted/30" : "bg-muted/60"}`}
                        >
                            <p className="mb-1 font-semibold">{d.decision}</p>
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-medium text-foreground/70">Considered:</span> {d.alternatives}
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{d.reasoning}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        )
    }

    function LearningsGrid({ learnings }: { learnings: Learning[] }) {
        const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold">
                    What I Learned
                </motion.h2>

                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 md:grid-cols-3"
                >
                    {learnings.map((learning, i) => {
                        const Icon = learningIcons[i] ?? Wrench

                        return (
                            <motion.div key={i} variants={cardVariants}>
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`h-4 w-4 ${accent.text}`} />
                                            <CardTitle className="text-sm">{learning.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{learning.body}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </motion.section>
        )
    }

    function MetricsSection({ metrics }: { metrics: { hero: Metric[]; supporting: Metric[] } }) {
        const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold">
                    By the Numbers
                </motion.h2>

                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {metrics.hero.map((m) => (
                        <motion.div key={m.label} variants={cardVariants}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className={`text-4xl font-bold ${accent.text}`}>
                                        <AnimatedCounter
                                            value={m.value}
                                            prefix={m.prefix}
                                            suffix={m.suffix}
                                        />
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{m.label}</p>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {metrics.supporting.map((m) => (
                        <motion.div key={m.label} variants={cardVariants}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className={`text-2xl font-bold ${accent.textSubtle}`}>
                                        <AnimatedCounter
                                            value={m.value}
                                            prefix={m.prefix}
                                            suffix={m.suffix}
                                        />
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground">{m.label}</p>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        )
    }

    function GallerySection({ gallery }: { gallery: GalleryImage[] }) {
        const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } = useAnimationVariants()

        if (gallery.length === 0)
            return null

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mb-16"
            >
                <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold">
                    Gallery
                </motion.h2>

                <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {gallery.map((img) => (
                        <motion.figure key={img.src} variants={cardVariants} className="overflow-hidden rounded-lg border">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                width={800}
                                height={600}
                                className="w-full"
                            />
                            {img.caption && (
                                <figcaption className="bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                                    {img.caption}
                                </figcaption>
                            )}
                        </motion.figure>
                    ))}
                </motion.div>
            </motion.section>
        )
    }

    function CTASection({ data }: { data: CTAData }) {
        const { containerVariants, itemVariants } = useAnimationVariants()

        return (
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <motion.div variants={itemVariants}>
                    <Card className="bg-muted/50">
                        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
                            <p className="max-w-lg leading-relaxed text-muted-foreground">{data.text}</p>
                            <div className="flex gap-4">
                                {data.buttons.map((btn) => (
                                    <Button key={btn.text} asChild variant={btn.variant}>
                                        <Link href={btn.href}>{btn.text}</Link>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.section>
        )
    }

    return {
        BackButton,
        HeroSection,
        SituationSection,
        ArchitectureSection,
        DeepDiveSection,
        DecisionLog,
        LearningsGrid,
        MetricsSection,
        GallerySection,
        CTASection,
    }
}
