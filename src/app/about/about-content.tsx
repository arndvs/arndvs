"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const journey = [
    {
        period: "2010-2017",
        title: "Freelance Web Development & Sales",
        description:
            "Full-stack web development and B2B sales. Seven years learning how businesses actually buy software and what makes customers stick around — while building custom applications, client portals, and marketing automation.",
    },
    {
        period: "2017-2020",
        title: "Founder & CEO — RipeMetrics",
        description:
            "Founded RipeMetrics and graduated from the CSD16 (Canopy San Diego) accelerator. Built a Customer Experience Management platform from scratch while leading teams across marketing, business development, and engineering.",
    },
    {
        period: "2020-2025",
        title: "Full-Stack Developer — RipeMetrics",
        description:
            "Led complete technical refactor from Laravel Livewire to React/Next.js, reducing network response times by 6 seconds. Integrated language models into customer service automation, engagement systems, and data pipelines. Scaled to 50+ enterprise clients.",
    },
    {
        period: "2025-Present",
        title: "AI Engineer & Open Source",
        description:
            "Building ctrl+shft — open source infrastructure for AI coding agents. Deep into agentic engineering, custom Claude Code skills, and deliberate human-in-the-loop patterns. Also shipping freelance projects with AI integrations.",
    },
];

const techStack = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis"],
    ai: ["OpenAI API", "Claude API", "LangChain", "RAG", "Pinecone", "Vector DBs"],
    tools: ["Sanity CMS", "Stripe", "Twilio", "Docker", "Git"],
    emerging: ["Model Context Protocol", "MCP UI", "Claude Code", "AI Agents"],
};

const certifications = [
    {
        title: "Claude Code for Real Engineers",
        issuer: "AI Hero",
        date: "Apr 2026",
    },
    {
        title: "Master the Model Context Protocol (MCP)",
        issuer: "Kent C. Dodds",
        date: "Sept 2025",
    },
    {
        title: "AI Engineering Bootcamp",
        issuer: "Maven",
        date: "Mar 2025",
    },
    {
        title: "AI-Powered Sanity Development",
        issuer: "Sanity",
        date: "Mar 2025",
    },
    {
        title: "LLM Engineering - Foundations to SLMs",
        issuer: "AI Makerspace",
        date: "Nov 2024",
    },
    {
        title: "Cursor AI Bootcamp",
        issuer: "Maven",
        date: "Jan 2025",
    },
    {
        title: "Landing Page Academy",
        issuer: "Learn UI Design",
        date: "Feb 2025",
    },
    {
        title: "Effective Communication For Engineers",
        issuer: "Taro (YC S22)",
        date: "Sep 2024",
    },
    {
        title: "Modern Redux with RTK & TypeScript",
        issuer: "egghead.io",
        date: "Oct 2022",
    },
    {
        title: "Introduction to Next.js",
        issuer: "Frontend Masters",
        date: "Jul 2022",
    },
];

const education = [
    {
        institution: "UC San Diego Extended Studies",
        period: "Sep 2018 - Jan 2019",
        program: "Customer Experience Leadership",
    },
    {
        institution: "Stanford University Online",
        period: "Oct 2016 - Jan 2017",
        program: "Technology Entrepreneurship",
    },
    {
        institution: "Stanford University Online",
        period: "Aug 2016 - Oct 2016",
        program: "Advanced Entrepreneurship",
    },
    {
        institution: "California State University, East Bay",
        period: "2000 - 2003",
        program: "Mass Communications",
    },
];

const speakingItems = [
    {
        type: "speaking" as const,
        title: "Building an AI Content System That Captures Your Voice",
        venue: "Inspired Birth Workers Alliance",
        date: "Q4 2025",
    },
    {
        type: "speaking" as const,
        title: "Building an AI Assistant to Supercharge Developer Velocity",
        venue: "Relentless Software Solutions CTO Coffee",
        date: "Aug 2023",
    },
    {
        type: "publication" as const,
        title: "How To Use Cause Marketing To Grow Your Business",
        venue: "Going Up: Business Excellence Press",
        date: "Apr 2014",
    },
];

export default function AboutContent() {
    const { containerVariants, itemVariants } = useAnimationVariants();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="min-h-screen">
            {/* Hero */}
            <section className="relative flex min-h-[70vh] items-end overflow-hidden pb-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
                >
                    <span
                        className="font-display text-foreground/[0.02] text-[20vw] font-black tracking-tighter"
                        style={{
                            transform: isVisible ? "translateY(0)" : "translateY(100px)",
                            opacity: isVisible ? 1 : 0,
                            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        ABOUT
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
                                About Me
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
                            Full-stack engineer.{" "}
                            <span className="text-gradient">AI systems builder.</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            Based in San Diego. I&apos;ve been doing freelance web development since
                            2010. In 2017 I founded RipeMetrics — an AI-powered marketing automation
                            and customer experience platform — and scaled it to 50+ enterprise
                            clients over 8 years. Now I build production software and agentic AI
                            systems, with strong instincts for where conversational interfaces
                            belong and where a button is still the right answer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Journey Timeline */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div variants={itemVariants}>
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            The Journey
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            From sales to engineering
                        </h2>
                    </motion.div>

                    <div className="bg-border mt-16 grid gap-px overflow-hidden rounded-2xl">
                        {journey.map((phase, index) => (
                            <motion.div
                                key={phase.period}
                                variants={itemVariants}
                                className="bg-card hover:bg-card/80 p-8 transition-colors lg:p-12"
                            >
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
                                    <div className="shrink-0 lg:w-48">
                                        <span className="text-muted-foreground font-mono text-sm">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div className="font-display text-primary mt-2 text-2xl font-bold">
                                            {phase.period}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold lg:text-2xl">
                                            {phase.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-3 leading-relaxed">
                                            {phase.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How I Work */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="grid gap-16 lg:grid-cols-2">
                        <motion.div variants={itemVariants}>
                            <span className="text-primary text-sm font-medium tracking-widest uppercase">
                                How I Work
                            </span>
                            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                                Sales instinct meets engineering rigor
                            </h2>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="text-muted-foreground space-y-6 leading-relaxed"
                        >
                            <p>
                                Eight years building RipeMetrics taught me how to build things that
                                actually work for real businesses over the long haul. I integrated
                                language models into customer service automation, engagement
                                systems, and data pipelines in ways that moved business metrics —
                                that hands-on experience gave me good instincts for where AI
                                genuinely adds value versus where it&apos;s just noise.
                            </p>
                            <p>
                                I&apos;m also going deep on agentic engineering — custom Claude Code
                                skills, cross-machine dotfile management for AI agents, and getting
                                deliberate about where human-in-the-loop patterns matter versus
                                where you can let agents run. I have strong instincts for where
                                conversational interfaces belong and where a button is still the
                                right answer.
                            </p>
                            <p className="text-foreground font-medium">
                                Most engineers optimize for the system. I optimize for the person
                                using it.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Tech Stack */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div variants={itemVariants}>
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            Technologies
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            The stack I work with
                        </h2>
                    </motion.div>

                    <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
                        {Object.entries(techStack).map(([category, techs]) => (
                            <motion.div key={category} variants={itemVariants}>
                                <h3 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
                                    {category}
                                </h3>
                                <ul className="space-y-2">
                                    {techs.map((tech) => (
                                        <li key={tech} className="text-foreground">
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Certifications */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div variants={itemVariants}>
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            Continuous Learning
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Recent certifications
                        </h2>
                    </motion.div>

                    <div className="bg-border mt-16 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2">
                        {certifications.map((cert) => (
                            <motion.div
                                key={cert.title}
                                variants={itemVariants}
                                className="bg-card hover:bg-card/80 p-8 transition-colors"
                            >
                                <div className="text-muted-foreground mb-2 text-xs">
                                    {cert.issuer} &middot; {cert.date}
                                </div>
                                <h3 className="text-lg font-semibold">{cert.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Education */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div variants={itemVariants}>
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            Education
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Formal education
                        </h2>
                    </motion.div>

                    <div className="mt-16 space-y-8">
                        {education.map((item) => (
                            <motion.div
                                key={item.institution + item.period}
                                variants={itemVariants}
                                className="border-border flex flex-col gap-4 border-b py-8 last:border-0 sm:flex-row sm:items-start sm:gap-8"
                            >
                                <div className="shrink-0 sm:w-48">
                                    <span className="text-muted-foreground text-sm">
                                        {item.period}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{item.institution}</h3>
                                    <p className="text-muted-foreground mt-1">{item.program}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Speaking & Publications */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="border-border border-t py-24 lg:py-32"
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <motion.div variants={itemVariants}>
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            Sharing Knowledge
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Speaking & publications
                        </h2>
                    </motion.div>

                    <div className="mt-16 space-y-8">
                        {speakingItems.map((item) => (
                            <motion.div
                                key={item.title}
                                variants={itemVariants}
                                className="border-border flex flex-col gap-4 border-b py-8 last:border-0 sm:flex-row sm:items-start sm:gap-8"
                            >
                                <div className="shrink-0 sm:w-32">
                                    <span className="bg-card border-border rounded border px-2 py-1 text-xs font-medium tracking-wide uppercase">
                                        {item.type}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        {item.venue} &middot; {item.date}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Personal */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="max-w-2xl">
                        <span className="text-primary text-sm font-medium tracking-widest uppercase">
                            Beyond Code
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            When I&apos;m not building
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            You&apos;ll find me rock climbing around San Diego or hunting for rare
                            vinyl records.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="max-w-3xl">
                        <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
                            Let&apos;s work <span className="text-gradient">together</span>
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            If you&apos;re looking for someone to build production-grade software or
                            implement AI systems that actually work, I&apos;d love to hear from you.
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
