"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { AnimatedCounter } from "@/components/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

import type {
    DesignHeroData,
    DesignPhase,
    FigmaEmbed as FigmaEmbedData,
    PhaseStat,
} from "./design-data";

function buildFigmaEmbedUrl(embed: FigmaEmbedData): string {
    return `https://www.figma.com/embed?embed_host=portfolio&url=https://www.figma.com/design/${embed.fileKey}/${embed.fileName}?node-id=${embed.nodeId}`;
}

function buildFigmaUrl(embed: FigmaEmbedData): string {
    return `https://www.figma.com/design/${embed.fileKey}/${embed.fileName}?node-id=${embed.nodeId}`;
}

export function PhaseNav({
    phases,
    activePhaseId,
}: {
    phases: DesignPhase[];
    activePhaseId: string;
}) {
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!navRef.current) return;

        const activeButton = navRef.current.querySelector(`[data-phase-id="${activePhaseId}"]`);

        if (activeButton) {
            activeButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [activePhaseId]);

    return (
        <nav
            className="bg-background/95 sticky top-16 z-40 border-b backdrop-blur-sm"
            aria-label="Design phases"
        >
            <div ref={navRef} className="scrollbar-none mx-auto max-w-7xl overflow-x-auto px-6">
                <div className="flex gap-1 py-2">
                    {phases.map((phase) => (
                        <a
                            key={phase.id}
                            href={`#${phase.id}`}
                            data-phase-id={phase.id}
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(phase.id);

                                if (!el) return;

                                const y = window.scrollY + el.getBoundingClientRect().top - 128;

                                window.scrollTo({ top: y, behavior: "smooth" });
                            }}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                                activePhaseId === phase.id
                                    ? "bg-orange-500 text-white"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            {phase.number}. {phase.shortLabel}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export function useScrollSpy(phaseIds: string[]): string {
    const [activeId, setActiveId] = useState(phaseIds[0] ?? "");

    const handleScroll = useCallback(() => {
        for (let i = phaseIds.length - 1; i >= 0; i--) {
            const id = phaseIds[i];

            if (!id) continue;

            const el = document.getElementById(id);

            if (el && el.getBoundingClientRect().top <= 180) {
                setActiveId(id);
                return;
            }
        }

        if (phaseIds[0]) setActiveId(phaseIds[0]);
    }, [phaseIds]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        // Schedule initial check outside effect body to avoid lint warning
        const raf = requestAnimationFrame(handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(raf);
        };
    }, [handleScroll]);

    return activeId;
}

export function HeroSection({ data }: { data: DesignHeroData }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

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
                    <Button asChild variant="ghost" size="sm" className="mb-8">
                        <Link href="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to projects
                        </Link>
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground text-sm font-medium">
                        Design Case Study
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl font-bold tracking-tight text-balance"
                >
                    {data.title} — <span className="text-orange-500">{data.subtitle}</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-6 max-w-3xl text-xl leading-relaxed text-pretty"
                >
                    {data.description}
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4"
                >
                    {data.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-4xl font-bold text-orange-500">
                                <AnimatedCounter
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                />
                            </div>
                            <div className="text-muted-foreground mt-1 text-sm font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center gap-4"
                >
                    <div className="text-muted-foreground text-sm">
                        <span className="text-foreground font-medium">{data.role}</span> ·{" "}
                        {data.timeline}
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={data.engineeringLink}>
                            See Engineering Deep-Dive
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </motion.section>
    );
}

export function StatBar({ stats }: { stats: PhaseStat[] }) {
    return (
        <div className="flex flex-wrap gap-6">
            {stats.map((stat) => (
                <div key={stat.label}>
                    <span className="text-2xl font-bold text-orange-500">
                        <AnimatedCounter
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                        />
                    </span>
                    <span className="text-muted-foreground ml-1.5 text-sm">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}

export function FigmaEmbedFrame({ embed }: { embed: FigmaEmbedData }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className="border-border overflow-hidden rounded-lg border">
                <div className="bg-muted flex aspect-video items-center justify-center p-6">
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                            Figma embed requires file sharing permissions
                        </p>
                        <Button asChild variant="outline" size="sm" className="mt-3">
                            <a
                                href={buildFigmaUrl(embed)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open in Figma
                                <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-border overflow-hidden rounded-lg border">
            <div className="relative aspect-video">
                {!loaded && (
                    <div className="bg-muted absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                    </div>
                )}
                <iframe
                    src={buildFigmaEmbedUrl(embed)}
                    className="h-full w-full border-0"
                    title={embed.label}
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            </div>
            <div className="bg-muted/50 flex items-center justify-between border-t px-4 py-2">
                <span className="text-muted-foreground text-xs font-medium">{embed.label}</span>
                <a
                    href={buildFigmaUrl(embed)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-500"
                >
                    Open in Figma
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    );
}

export function PhaseSection({ phase }: { phase: DesignPhase }) {
    const { containerVariants, itemVariants } = useAnimationVariants();

    return (
        <motion.section
            id={phase.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="border-border scroll-mt-32 border-b py-16"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div variants={itemVariants} className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                        {phase.number}
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight">{phase.title}</h2>
                </motion.div>

                <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-2">
                    {phase.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mb-8 max-w-3xl text-lg leading-relaxed"
                >
                    {phase.summary}
                </motion.p>

                <motion.div variants={itemVariants} className="mb-8">
                    <StatBar stats={phase.stats} />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="text-muted-foreground mb-8 max-w-3xl text-base leading-relaxed"
                >
                    {phase.description}
                </motion.div>

                <motion.div variants={itemVariants} className="mb-8">
                    <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
                        Key Artifacts
                    </h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                        {phase.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2 text-sm">
                                <span
                                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                                    aria-hidden="true"
                                />
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {phase.figmaEmbeds.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className={`grid gap-6 ${phase.figmaEmbeds.length > 1 ? "lg:grid-cols-2" : ""}`}
                    >
                        {phase.figmaEmbeds.map((embed) => (
                            <FigmaEmbedFrame
                                key={`${embed.fileKey}-${embed.nodeId}`}
                                embed={embed}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}
