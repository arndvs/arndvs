"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin } from "lucide-react";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import aaronPortrait from "@/assets/images/aaron-portrait.webp";
import { AnimatedCounter } from "@/components/animated-counter";
import { Button } from "@/components/ui/button";
import { technologiesData } from "@/lib/data/technologies";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const heroStats = [
    { value: 15, suffix: "+", label: "Years building for the web" },
    { value: 8, suffix: "", label: "Years building RipeMetrics" },
    { value: 4, suffix: "", label: "Braze & Snowflake certifications, 2026" },
];

const featuredProjects = [
    {
        id: "inkind-first-reward-journey",
        title: "First-Reward Journey",
        category: "Lifecycle Marketing / Work Sample",
        year: "2026",
        description:
            "A restaurant rewards app was holding $25 for me and I still ended up on Google Maps. I built the message that should have reached me: a Snowflake data contract, Liquid that aborts when the data is wrong, a Braze trial, and a Rails outbox. Fictional data, not affiliated with inKind.",
        stats: [
            { value: "184", label: "Liquid Tests" },
            { value: "146", label: "Rails Tests" },
            { value: "11/11", label: "SQL Checks Passing" },
        ],
        href: "/blog/inkind-first-reward-journey",
        cta: "Read the walkthrough",
    },
    {
        id: "ctrlshft",
        title: "ctrl+shft",
        category: "AI Agent Infrastructure / Open Source",
        year: "2026",
        description:
            "Open-source tooling that keeps AI coding agents consistent, observable, and safe across projects and machines: skills that load only when a project calls for them, hooks that stop an agent before it pushes to a protected branch or exposes a secret, and a sandboxed autonomous loop.",
        stats: [
            { value: "50+", label: "Agent Skills" },
            { value: "19", label: "Guardrail Hooks" },
            { value: "3", label: "AI Runtimes" },
        ],
        href: "/projects/ctrlshft",
        cta: "View project",
    },
    {
        id: "mcrdse-commerce",
        title: "MCRDSE — E-Commerce & Loyalty Platform",
        category: "E-Commerce / Lifecycle / Edge Computing",
        year: "2026 – Present",
        description:
            "Took over a stalled, half-built system for a functional-mushroom brand. After an incident shipped about $381 of product to people who never paid, I rebuilt the order pipeline so nothing ships until the database confirms payment, and audited the repos for things that looked like they worked but didn't.",
        stats: [
            { value: "284", label: "Audit Items Closed" },
            { value: "195", label: "Tests, From None" },
            { value: "580", label: "Missed Orders Recovered" },
        ],
        href: "/projects/mcrdse-commerce",
        cta: "View project",
    },
    {
        id: "ripemetrics",
        title: "RipeMetrics",
        category: "Marketing Automation / AI Platform",
        year: "2017–2025",
        description:
            "The customer growth platform I co-founded and built on for 8 years: a journey engine and segment builder for marketing automation, and tenant-isolated RAG that answered customers across chat, SMS, email, and voice.",
        stats: [
            { value: "8", label: "Years in Production" },
            { value: "21", label: "Journey Triggers" },
            { value: "38", label: "Segmentation Scopes" },
        ],
        href: "/projects/ripemetrics",
        cta: "View project",
    },
];

export default function HomeContent() {
    const { containerVariants, itemVariants } = useAnimationVariants();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero — editorial full-viewport with watermark */}
            <section
                className="relative flex min-h-[100vh] items-center overflow-hidden"
                aria-label="Hero section"
            >
                {/* Background watermark */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                    <span
                        className="font-display text-foreground/[0.02] text-[25vw] font-black tracking-tighter whitespace-nowrap"
                        style={{
                            transform: isVisible ? "translateX(0)" : "translateX(-100px)",
                            opacity: isVisible ? 1 : 0,
                            transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        AARON DAVIS
                    </span>
                </div>

                <div className="relative z-10 w-full px-6 py-20 lg:px-12 xl:px-20">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
                        {/* Content */}
                        <div>
                            <div
                                style={{
                                    transform: isVisible ? "translateY(0)" : "translateY(40px)",
                                    opacity: isVisible ? 1 : 0,
                                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                                }}
                            >
                                <span className="text-primary text-sm font-medium tracking-widest uppercase">
                                    Applied AI Full-Stack Engineer
                                </span>
                            </div>

                            <h1
                                className="font-display mt-6 text-5xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
                                style={{
                                    transform: isVisible ? "translateY(0)" : "translateY(50px)",
                                    opacity: isVisible ? 1 : 0,
                                    transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                                }}
                            >
                                <span className="text-foreground">AI systems that</span>
                                <br />
                                <span className="text-gradient">hold up in production</span>
                            </h1>

                            <p
                                className="text-muted-foreground mt-8 max-w-xl text-lg leading-relaxed lg:text-xl"
                                style={{
                                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                    opacity: isVisible ? 1 : 0,
                                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                                }}
                            >
                                15+ years building for the web. I co-founded RipeMetrics and spent 8
                                years building its marketing automation and AI platform. Now I build
                                AI systems and lifecycle marketing infrastructure, usually directly
                                with the person who owns the problem: I run the discovery, scope the
                                system, build it, and stay on it after launch.
                            </p>

                            <div
                                className="mt-10 flex flex-wrap items-center gap-4"
                                style={{
                                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                    opacity: isVisible ? 1 : 0,
                                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                                }}
                            >
                                <Button asChild size="lg" className="group">
                                    <Link href="/projects">
                                        View Projects
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/work-with-me">Work with me</Link>
                                </Button>
                            </div>

                            {/* Stats */}
                            <div
                                className="mt-16 grid grid-cols-3 gap-8"
                                style={{
                                    transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                    opacity: isVisible ? 1 : 0,
                                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
                                }}
                            >
                                {heroStats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="font-display text-primary text-3xl font-black lg:text-4xl">
                                            <AnimatedCounter
                                                value={stat.value}
                                                suffix={stat.suffix}
                                                className="stat-number"
                                            />
                                        </div>
                                        <div className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image */}
                        <div
                            className="relative"
                            style={{
                                transform: isVisible
                                    ? "translateY(0) scale(1)"
                                    : "translateY(60px) scale(0.95)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                            }}
                        >
                            <div className="bg-card relative aspect-4/5 overflow-hidden rounded-2xl">
                                <Image
                                    alt="Aaron Davis"
                                    src={aaronPortrait}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>
                            <div className="bg-card border-border mt-4 rounded-xl border p-4">
                                <p className="text-sm font-medium">Based in San Diego, CA</p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Open to remote, hybrid, or on-site roles
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technologies — border-style pills */}
            <section className="border-border border-t py-20" aria-label="Technologies">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="flex flex-wrap gap-3">
                        {technologiesData.map((tech) => (
                            <span
                                key={tech}
                                className="border-border hover:border-primary/50 hover:text-primary rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-24 lg:py-32"
                aria-label="Featured projects"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div
                        variants={itemVariants}
                        className="mb-16 flex items-end justify-between"
                    >
                        <div>
                            <span className="text-primary text-sm font-medium tracking-widest uppercase">
                                Selected Work
                            </span>
                            <h2 className="font-display mt-4 text-4xl font-bold tracking-tight lg:text-5xl">
                                Featured Projects
                            </h2>
                        </div>
                        <Button asChild variant="ghost" className="group hidden md:flex">
                            <Link href="/projects">
                                View all
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </motion.div>

                    <div className="space-y-8">
                        {featuredProjects.map((project, index) => (
                            <motion.div key={project.id} variants={itemVariants}>
                                <Link href={project.href} className="group block">
                                    <article className="border-border bg-card hover:border-primary/30 rounded-2xl border p-8 transition-all duration-300 lg:p-12">
                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                            <div className="flex-1">
                                                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                                    <span className="font-mono">
                                                        {String(index + 1).padStart(2, "0")}
                                                    </span>
                                                    <span>{project.category}</span>
                                                    <span className="text-border">|</span>
                                                    <span>{project.year}</span>
                                                </div>
                                                <h3 className="font-display group-hover:text-primary mt-4 text-3xl font-bold tracking-tight transition-colors lg:text-4xl">
                                                    {project.title}
                                                </h3>
                                                <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>
                                            <div className="text-muted-foreground group-hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors lg:pt-8">
                                                {project.cta}
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>

                                        <div className="border-border mt-8 grid grid-cols-3 gap-8 border-t pt-8">
                                            {project.stats.map((stat) => (
                                                <div key={stat.label}>
                                                    <div className="font-display text-primary text-2xl font-bold lg:text-3xl">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 md:hidden">
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/projects">
                                View all projects
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <section
                className="border-border border-t py-24 lg:py-32"
                aria-label="Contact information"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="max-w-3xl">
                        <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
                            Let&apos;s build something{" "}
                            <span className="text-gradient">together</span>
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            I&apos;m looking for applied AI, forward-deployed, and marketing
                            automation engineering roles. Full-time or contract, San Diego or
                            remote.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <Button asChild size="lg" className="group">
                                <Link href="/work-with-me">
                                    Work with me
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a
                                    href="https://github.com/arndvs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    GitHub
                                </a>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a
                                    href="https://linkedin.com/in/arndvs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Linkedin className="mr-2 h-4 w-4" />
                                    LinkedIn
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
