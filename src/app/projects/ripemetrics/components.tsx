"use client";

import { motion } from "framer-motion";
import { ArrowLeft, GitBranch, Lightbulb, Wrench } from "lucide-react";

import Link from "next/link";

import { MermaidDiagram } from "@/components/mermaid-diagram";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

import type {
    Achievement,
    ConclusionData,
    Decision,
    DeepDive,
    Feature,
    HeaderData,
    ImpactMetric,
    Learning,
    OverviewData,
    TechSection,
} from "./data";
import { diagrams } from "./diagrams";
import type { DiagramKey } from "./diagrams";

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
            <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
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
                    className="text-5xl font-bold tracking-tight text-balance"
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
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
                                className="bg-secondary rounded-md px-2 py-1 text-sm font-medium"
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
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
            <motion.div
                variants={staggerContainerVariants}
                className="mt-12 grid gap-6 md:grid-cols-2"
            >
                {features.map((feature) => (
                    <motion.div key={feature.id} variants={cardVariants}>
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground mt-3 leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
                {title}
            </motion.h2>
            <motion.div
                variants={staggerContainerVariants}
                className="mt-12 grid gap-8 md:grid-cols-3"
            >
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        className="border-border bg-card rounded-lg border p-6"
                    >
                        <div className="text-primary text-4xl font-bold">{metric.value}</div>
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
                {title}
            </motion.h2>
            <motion.div variants={staggerContainerVariants} className="mt-8 space-y-4">
                {items.map((achievement, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        className="border-border bg-card rounded-lg border p-6"
                    >
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.div
                variants={itemVariants}
                className="border-border bg-card rounded-lg border p-8 lg:p-12"
            >
                <h2 className="text-3xl font-bold tracking-tight">{data.title}</h2>
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
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
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.div variants={itemVariants} className="mb-2">
                <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    Deep Dive
                </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tight">
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

const learningIcons = [Lightbulb, GitBranch, Wrench];

export function DecisionsSection({ decisions }: { decisions: Decision[] }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold tracking-tight">
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
                        <p className="text-muted-foreground mb-2 text-sm">
                            <span className="text-foreground/70 font-medium">Considered:</span>{" "}
                            {d.alternatives}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {d.reasoning}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
}

export function LearningsSection({ learnings }: { learnings: Learning[] }) {
    const { containerVariants, itemVariants, cardVariants, staggerContainerVariants } =
        useAnimationVariants();

    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="mx-auto max-w-5xl px-6 py-16 lg:px-8"
        >
            <motion.h2 variants={itemVariants} className="mb-8 text-3xl font-bold tracking-tight">
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
                    const Icon = learningIcons[i] ?? Wrench;
                    return (
                        <motion.div key={i} variants={cardVariants}>
                            <Card className="h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-green-500" />
                                        <CardTitle className="text-sm">{learning.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {learning.body}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.section>
    );
}
