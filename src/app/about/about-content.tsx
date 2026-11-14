"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const journey = [
    {
        period: "2006-2017",
        title: "Payments, Loyalty & Marketing Automation",
        description:
            "Consultative sales to restaurants and retailers, auditing card-processing statements line by line. From 2010, implemented loyalty and rewards programs with lifecycle segmentation (VIPs, guests lapsed 30/60/90+ days, win-backs for each group) and took on paying web clients. At MainStream Merchant Services, built journey automation on Infusionsoft and round-robin lead routing for a sales team.",
    },
    {
        period: "2017-2020",
        title: "Founder & CEO — RipeMetrics",
        description:
            "Founded RipeMetrics, took it through the CSD16 (Canopy San Diego) accelerator, and recruited a CTO and co-founders to build the MVP. Ran the company through its pivots from review management to customer analytics, CRM, and multi-channel messaging.",
    },
    {
        period: "2020-2025",
        title: "President, Product & Engineering — RipeMetrics",
        description:
            "Hired a CEO and moved to product and engineering across 8 codebases. Co-designed and built the marketing automation module (a journey engine with 21 behavior triggers and 38 segmentation scopes), per-tenant SMS compliance, and tenant-isolated RAG across chat, SMS, email, and voice. Led the Laravel Livewire to React/Next.js migration behind feature flags.",
    },
    {
        period: "2025-Present",
        title: "Applied AI Full-Stack Engineer",
        description:
            "Freelance engineering for a healthcare practice and a D2C brand: AI document extraction, human-approved AI replies, lifecycle journeys on GoHighLevel, and an order pipeline where the database is the record of truth. I maintain ctrl+shft, open-source infrastructure for AI coding agents. Braze and Snowflake certified in 2026.",
    },
];

const techStack = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis"],
    ai: ["OpenAI API", "Claude API", "LangChain", "RAG", "Pinecone", "Vector DBs"],
    lifecycle: ["Braze", "GoHighLevel", "Liquid", "Snowflake", "Twilio", "SendGrid"],
    emerging: ["Model Context Protocol", "MCP UI", "Claude Code", "AI Agents"],
};

const certifications = [
    {
        title: "Braze Certified Marketing Specialist",
        issuer: "Braze",
        date: "Oct 2026",
    },
    {
        title: "Braze Certified Practitioner",
        issuer: "Braze",
        date: "Oct 2026",
    },
    {
        title: "Snowflake Data Engineering Professional Certificate",
        issuer: "Snowflake",
        date: "Oct 2026",
    },
    {
        title: "Snowflake Generative AI Professional Certificate",
        issuer: "Snowflake",
        date: "Oct 2026",
    },
    {
        title: "Claude Code for Real Engineers",
        issuer: "AI Hero",
        date: "May 2026",
    },
    {
        title: "Master the Model Context Protocol (MCP)",
        issuer: "EpicAI",
        date: "Oct 2025",
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
        title: "Content-Driven Web Application Foundations",
        issuer: "Sanity",
        date: "Mar 2025",
    },
    {
        title: "Landing Page Academy",
        issuer: "Learn UI Design",
        date: "Feb 2025",
    },
    {
        title: "Cursor AI Bootcamp",
        issuer: "Maven",
        date: "Jan 2025",
    },
    {
        title: "LLM Engineering - Foundations to SLMs",
        issuer: "AI Makerspace",
        date: "Dec 2024",
    },
    {
        title: "Effective Communication For Engineers",
        issuer: "Taro (YC S22)",
        date: "Sep 2024",
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
                            Applied AI full-stack engineer.{" "}
                            <span className="text-gradient">Marketing automation roots.</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            Based in San Diego. I spent a decade in payments and restaurant loyalty
                            programs, and have had paying web clients since 2010. In 2017 I founded
                            RipeMetrics, a marketing automation, CRM, and AI customer service
                            platform, and built on it for 8 years. Now I build AI systems and
                            lifecycle marketing infrastructure, usually working directly with the
                            person who owns the problem.
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
                            From payments and loyalty to AI systems
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
                            Certifications
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
