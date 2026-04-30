"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const projects = [
    {
        id: "ctrlshft",
        title: "ctrl+shft",
        category: "AI Infrastructure / Developer Tools",
        year: "2025",
        role: "Solo Developer & Architect",
        description:
            "The infrastructure behind my consulting practice. 24 skills, lifecycle hooks, a real-time compliance HUD, and hardened secrets — all from a single dotfiles repo. The same system I implement for clients, open source and in production.",
        tags: [
            "Bash",
            "TypeScript",
            "Python",
            "Node.js",
            "Docker",
            "Claude Code",
            "VS Code Copilot",
            "GitHub CLI",
        ],
        stats: [
            { value: "24", label: "Agent Skills" },
            { value: "100%", label: "Open Source" },
            { value: "3", label: "AI Runtimes" },
        ],
        href: "/projects/ctrlshft",
        link: "https://github.com/arndvs/ctrlshft",
        thumbnail: "/projects/ctrlshft/ctrl-shft.jpg",
    },
    {
        id: "ripemetrics",
        title: "RipeMetrics",
        category: "AI / SaaS",
        year: "2017–2025",
        role: "Founder & Full-Stack Developer",
        description:
            "AI-powered customer growth platform serving 50+ enterprise clients with automated customer service, reducing costs by 40% and achieving 95%+ uptime.",
        tags: ["React", "Next.js", "TypeScript", "Redux RTK", "OpenAI", "Pinecone", "PostgreSQL"],
        stats: [
            { value: "50+", label: "Enterprise Clients" },
            { value: "40%", label: "Cost Reduction" },
            { value: "128K+", label: "Lines of Code" },
        ],
        href: "/projects/ripemetrics",
    },
    {
        id: "align-san-diego-family-chiropractic",
        title: "Align San Diego Family Chiropractic",
        category: "Healthcare / Web",
        year: "2024–2025",
        role: "Full-Stack Developer",
        description:
            "A 44,000-line healthcare platform serving 5,000+ families — 5 AI integrations, 81 JSON-LD schemas, 158 programmatic pages, and a 27-template transactional email system — built solo on Next.js 16, Sanity v5, and OpenAI.",
        tags: ["Next.js 16", "React 19", "Sanity v5", "TypeScript", "OpenAI", "Schema.org"],
        stats: [
            { value: "44K+", label: "Lines of Code" },
            { value: "5K+", label: "Families Served" },
            { value: "81", label: "JSON-LD Schemas" },
        ],
        href: "/projects/align-san-diego-family-chiropractic",
        link: "https://alignsd.com",
        thumbnail: "/projects/alignsd/hero-webgl-shader.png",
    },
    {
        id: "push",
        title: "PUSH",
        category: "AI Video / Creative Technology",
        year: "2025",
        role: "Writer, Director & Creative Technologist",
        description:
            "A comedy short produced entirely with AI generative video — 54-shot prompt library, character consistency pipeline, 6-document production package, and a transmedia universe at riseawake.com.",
        tags: ["Sora", "Runway", "Kling", "Pika", "Seedance 2.0", "Screenwriting"],
        stats: [
            { value: "54", label: "AI Shots" },
            { value: "6", label: "Production Docs" },
            { value: "v7", label: "Screenplay" },
        ],
        href: "/projects/push",
    },
    {
        id: "rise-awake",
        title: "RISE Awake",
        category: "Creative Technology / Full-Stack Web",
        year: "2025",
        role: "Full-Stack Developer & Creative Technologist",
        description:
            "A 41-route Next.js 16 application operating as the real corporate website of a fictional company — Sanity v5, Convex, Clerk, 22 internal documents, 6 legal documents, and a 12-stage activation configurator.",
        tags: ["Next.js 16", "React 19", "Sanity v5", "Convex", "Clerk", "Tailwind v4"],
        stats: [
            { value: "41+", label: "Routes" },
            { value: "22", label: "Internal Docs" },
            { value: "6", label: "Legal Docs" },
        ],
        href: "/projects/rise-awake",
        link: "https://riseawake.com",
    },
];

export default function ProjectsContent() {
    const { containerVariants, itemVariants } = useAnimationVariants();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="relative flex min-h-[60vh] items-end overflow-hidden pt-32 pb-20">
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
                    <span
                        className="font-display text-foreground/[0.02] text-[20vw] font-black tracking-tighter"
                        aria-hidden="true"
                        style={{
                            transform: isVisible ? "translateY(0)" : "translateY(100px)",
                            opacity: isVisible ? 1 : 0,
                            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        WORK
                    </span>
                </div>

                <div className="relative z-10 w-full px-6 lg:px-12 xl:px-20">
                    <div className="mx-auto max-w-7xl">
                        <div
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                            }}
                        >
                            <span className="text-primary text-sm font-medium tracking-widest uppercase">
                                Portfolio
                            </span>
                        </div>

                        <h1
                            className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] font-black tracking-tight sm:text-6xl lg:text-7xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(50px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                            }}
                        >
                            Selected <span className="text-gradient">Work</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            A curated collection of engineering, AI systems, and creative technology
                            projects spanning 17+ years of building products at scale.
                        </p>
                    </div>
                </div>
            </section>

            {/* Projects */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
                aria-label="All projects"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="space-y-8">
                        {projects.map((project, index) => (
                            <motion.div key={project.id} variants={itemVariants}>
                                <Link href={project.href} className="group block">
                                    <article className="border-border bg-card hover:border-primary/30 overflow-hidden rounded-2xl border transition-all duration-300">
                                        {project.thumbnail && (
                                            <div className="border-border overflow-hidden border-b">
                                                <Image
                                                    src={project.thumbnail}
                                                    alt={`${project.title} screenshot`}
                                                    width={1200}
                                                    height={600}
                                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                />
                                            </div>
                                        )}
                                        <div className="p-8 lg:p-12">
                                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex-1">
                                                    <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                                                        <span className="font-mono">
                                                            {String(index + 1).padStart(2, "0")}
                                                        </span>
                                                        <span>{project.category}</span>
                                                        <span className="text-border">|</span>
                                                        <span>{project.year}</span>
                                                        <span className="text-border">|</span>
                                                        <span>{project.role}</span>
                                                    </div>
                                                    <h2 className="font-display group-hover:text-primary mt-4 text-3xl font-bold tracking-tight transition-colors lg:text-4xl">
                                                        {project.title}
                                                    </h2>
                                                    <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                                                        {project.description}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {project.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="border-border rounded-full border px-3 py-1 text-xs font-medium"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 lg:pt-8">
                                                    <span className="text-muted-foreground group-hover:text-primary text-sm font-medium transition-colors">
                                                        View project
                                                    </span>
                                                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-all group-hover:translate-x-1" />
                                                </div>
                                            </div>

                                            {/* Stats */}
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

                                            {/* External link */}
                                            {project.link && (
                                                <div className="mt-6">
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        {project.link.replace(/^https?:\/\//, "")}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="max-w-3xl">
                        <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
                            Interested in working <span className="text-gradient">together</span>?
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            I work with a small number of clients on AI systems consulting and
                            full-stack development. If you have something worth building, let&apos;s
                            talk.
                        </p>
                        <div className="mt-10">
                            <Button asChild size="lg" className="group">
                                <Link href="/work-with-me">
                                    Work with me
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
