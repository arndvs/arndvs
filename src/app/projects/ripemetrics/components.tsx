"use client";

import { motion } from "framer-motion";
import { ArrowLeft, GitBranch, Lightbulb, Wrench } from "lucide-react";

import Link from "next/link";

import { createCaseStudySections } from "@/components/case-study/sections";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

import type {
    Achievement,
    ConclusionData,
    DeepDive,
    Feature,
    HeaderData,
    ImpactMetric,
    OverviewData,
    TechSection,
} from "./data";
import { diagrams } from "./diagrams";
import type { DiagramKey } from "./diagrams";

const factorySections = createCaseStudySections({
    accentColor: "green",
    diagrams: diagrams as Record<string, string>,
    subsystemIcons: {},
    fallbackIcon: Wrench,
    learningIcons: [Lightbulb, GitBranch, Wrench],
});

export const { DecisionLog, LearningsGrid } = factorySections;

export function BackButton() {
    return (
        <Button asChild variant="ghost" size="sm" className="mb-8">
            <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to projects
            </Link>
        </Button>
    );
}

export function HeaderSection({ data }: { data: HeaderData }) {
    const { containerVariants, itemVariants } = useAnimationVariants();
    const badgeColor: Record<string, string> = {
        cyan: "bg-cyan-500",
        green: "bg-green-500",
        blue: "bg-blue-500",
    };

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="border-border border-b"
        >
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <motion.div variants={itemVariants}>
                    <BackButton />
                </motion.div>
                <motion.div variants={itemVariants} className="mb-4 flex items-center gap-2">
                    <div
                        className={`h-2 w-2 rounded-full ${badgeColor[data.badge.color] ?? "bg-green-500"}`}
                    />
                    <span className="text-muted-foreground text-sm font-medium">
                        {data.badge.label}
                    </span>
                </motion.div>
                <motion.h1
                    variants={itemVariants}
                    className="font-display text-5xl font-bold tracking-tight text-balance lg:text-6xl"
                >
                    {data.title}
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-6 text-xl leading-relaxed text-pretty"
                >
                    {data.description}
                </motion.p>
            </div>
        </motion.section>
    );
}

export function OverviewSection({ data }: { data: OverviewData }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <div className="grid gap-12 lg:grid-cols-3">
                <motion.div variants={itemVariants}>
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                        {data.role.label}
                    </h3>
                    <p className="mt-2 text-lg">{data.role.value}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                        {data.timeline.label}
                    </h3>
                    <p className="mt-2 text-lg">{data.timeline.value}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                        {data.technologies.label}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {data.technologies.items.map((tech) => (
                            <motion.span
                                key={tech}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                className="border-border rounded-full border px-2 py-1 text-sm font-medium"
                            >
                                {tech}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

export function ChallengeSection({ title, description }: { title: string; description: string }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
                {title}
            </motion.h2>
            <motion.p
                variants={itemVariants}
                className="text-muted-foreground mt-6 text-lg leading-relaxed"
            >
                {description}
            </motion.p>
        </motion.section>
    );
}

export function SolutionSection({
    title,
    description,
    features,
}: {
    title: string;
    description: string;
    features: Feature[];
}) {
    const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } =
        useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                {title}
            </motion.h2>
            <motion.p
                variants={itemVariants}
                className="text-muted-foreground mt-6 text-lg leading-relaxed"
            >
                {description}
            </motion.p>
            <motion.div
                variants={staggerContainerVariants}
                className="bg-border mt-12 grid gap-px overflow-hidden rounded-lg md:grid-cols-2"
            >
                {features.map((feature) => (
                    <motion.div key={feature.id} variants={cardVariants} className="bg-card p-6">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-muted-foreground mt-3 leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}

export function ImpactSection({ title, metrics }: { title: string; metrics: ImpactMetric[] }) {
    const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } =
        useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                {title}
            </motion.h2>
            <motion.div
                variants={staggerContainerVariants}
                className="bg-border mt-12 grid gap-px overflow-hidden rounded-lg md:grid-cols-3"
            >
                {metrics.map((metric, index) => (
                    <motion.div key={index} variants={cardVariants} className="bg-card p-6">
                        <div className="font-display text-primary text-4xl font-bold">
                            {metric.value}
                        </div>
                        <div className="text-muted-foreground mt-2 text-sm font-medium">
                            {metric.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}

export function TechImplementationSection({
    title,
    sections,
}: {
    title: string;
    sections: TechSection[];
}) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                {title}
            </motion.h2>
            <motion.div
                variants={itemVariants}
                className="text-muted-foreground mt-8 space-y-6 text-lg leading-relaxed"
            >
                {sections.map((section, index) => (
                    <p key={index}>
                        <strong>{section.heading}:</strong> {section.content}
                    </p>
                ))}
            </motion.div>
        </motion.section>
    );
}

export function AchievementsSection({ title, items }: { title: string; items: Achievement[] }) {
    const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } =
        useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                {title}
            </motion.h2>
            <motion.div
                variants={staggerContainerVariants}
                className="bg-border mt-8 grid gap-px overflow-hidden rounded-lg"
            >
                {items.map((achievement, index) => (
                    <motion.div key={index} variants={cardVariants} className="bg-card p-6">
                        <h3 className="text-xl font-semibold">{achievement.title}</h3>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                            {achievement.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}

export function ConclusionSection({ data }: { data: ConclusionData }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.div
                variants={itemVariants}
                className="border-border rounded-lg border p-8 lg:p-12"
            >
                <h2 className="font-display text-3xl font-bold tracking-tight">{data.title}</h2>
                <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                    {data.description}
                </p>
                <div className="mt-8">
                    <Button asChild variant="outline" size="lg">
                        <Link href={data.cta.secondary.href}>{data.cta.secondary.text}</Link>
                    </Button>
                </div>
            </motion.div>
        </motion.section>
    );
}

export function ArchitectureDiagram({ diagramKey }: { diagramKey: DiagramKey }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                System Architecture
            </motion.h2>
            <motion.div variants={itemVariants} className="mt-8">
                <MermaidDiagram chart={diagrams[diagramKey]} />
            </motion.div>
        </motion.section>
    );
}

export function DeepDiveSection({ data }: { data: DeepDive }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
        >
            <motion.div variants={itemVariants} className="mb-2">
                <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Deep Dive
                </span>
            </motion.div>
            <motion.h2
                variants={itemVariants}
                className="font-display text-3xl font-bold tracking-tight"
            >
                {data.title}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground mt-1 text-lg">
                {data.subtitle}
            </motion.p>
            <motion.p
                variants={itemVariants}
                className="text-muted-foreground mt-6 text-lg leading-relaxed"
            >
                {data.problem}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
                <MermaidDiagram chart={diagrams[data.diagramKey]} />
            </motion.div>

            <motion.div variants={containerVariants} className="mt-8 space-y-4">
                {data.walkthrough.map((step, i) => (
                    <motion.div key={i} variants={itemVariants} className="flex gap-4">
                        <span className="bg-primary text-primary-foreground mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            {i + 1}
                        </span>
                        <p className="text-muted-foreground text-lg leading-relaxed">{step}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="border-primary bg-muted/50 mt-8 rounded-lg border-l-4 p-6"
            >
                <h3 className="mb-2 text-sm font-semibold tracking-wide uppercase">
                    {data.insight.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{data.insight.body}</p>
            </motion.div>
        </motion.section>
    );
}
