"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AnimatedCounter } from "@/components/animated-counter";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const phases = [
    {
        number: "01",
        title: "Discover",
        subtitle: "Start with the person who owns the problem",
        description:
            "Most of my work has been direct with the person running the business. I start with what is eating their week and what is actually broken, before any tool is chosen.",
        details: [
            "Sit with the people doing the work, not just the process doc",
            "Write the problem down in plain terms before any solution language",
            "Eleven years auditing merchants' card-processing statements taught me to turn technical detail into a decision someone can act on",
        ],
    },
    {
        number: "02",
        title: "Scope",
        subtitle: "Decide what must be true",
        description:
            "Before building, I write the data contract: which events and attributes exist, which system owns each field, and what is deliberately left out.",
        details: [
            "One system owns each field, so two writers never race",
            "Decisions are recorded when they are made, with the reason",
            "Every gap gets logged with its evidence and an owner",
        ],
    },
    {
        number: "03",
        title: "Build",
        subtitle: "Agents draft, tests decide",
        description:
            "I build with Claude Code and my own agent infrastructure, and nothing merges on the model's say-so. In most of my projects the model was one piece; most of the work was around it.",
        details: [
            "184 Liquid tests and 146 Rails tests on the first-reward journey work sample",
            "A storefront taken from no test suite to 195 tests",
            "A person approves or edits every AI-drafted customer reply before it sends",
        ],
    },
    {
        number: "04",
        title: "Stay",
        subtitle: "Keep it working after launch",
        description:
            "I stay on what I build. That is where the failures that never show up in a demo get found and fixed.",
        details: [
            "Audited seven repos for things that looked like they worked but didn't: 284 items, each closed with a fix or a written decision",
            "Rebuilt an order pipeline after an incident shipped about $381 of product to people who never paid",
            "Recovered 580 orders that had silently missed their lifecycle messages",
        ],
    },
];

const laneA = [
    "Forward-deployed and applied AI engineering: discovery through production, working with the customer",
    "RAG, tool calling, document extraction, and agents with human approval gates",
    "Agent infrastructure: Claude Code, MCP, skills, hooks, and sandboxed autonomous loops",
    "Full-stack TypeScript and Python: React, Next.js, Node.js, FastAPI, PostgreSQL",
];

const laneB = [
    "Marketing automation engineering: the events, attributes, and data contract behind a journey",
    "Built a customer engagement platform from scratch at RipeMetrics: journeys, segments, campaigns, deliverability, and compliance",
    "Lifecycle programs running on GoHighLevel for a healthcare practice and a D2C brand",
    "Braze Certified Practitioner and Marketing Specialist, plus two Snowflake certificates (2026)",
    "On Braze itself: certified, with a public end-to-end work sample. I have not yet run it in a production role",
];

const proofStats = [
    { value: 15, suffix: "+", label: "Years building for the web" },
    { value: 8, suffix: "", label: "Years building RipeMetrics" },
    { value: 4, suffix: "", label: "Braze & Snowflake certifications, 2026" },
    { value: 5, suffix: "", label: "AI integrations on one healthcare platform" },
];

const proofProjects = [
    {
        tag: "Lifecycle Marketing · Work Sample · 2026",
        title: "First-Reward Journey",
        description:
            "A Braze journey built end to end from one missed dinner: a Snowflake data contract, Liquid that aborts when the data is wrong, and a Rails outbox. Fictional data, not affiliated with inKind.",
        href: "/blog/inkind-first-reward-journey",
    },
    {
        tag: "AI Agent Infrastructure · Open Source",
        title: "ctrl+shft",
        description:
            "The agent infrastructure I run my own client work on: 50+ skills, 19 guardrail hooks, a compliance HUD, and a sandboxed autonomous loop.",
        href: "/projects/ctrlshft",
    },
    {
        tag: "E-Commerce · Lifecycle · 2026",
        title: "MCRDSE",
        description:
            "A stalled, half-built system for a functional-mushroom brand, taken over and rebuilt around one rule: nothing ships until the database confirms payment.",
        href: "/projects/mcrdse-commerce",
    },
];

export default function WorkWithMeContent() {
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
                    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
                >
                    <span
                        className="font-display text-foreground/[0.02] text-[15vw] font-black tracking-tighter whitespace-nowrap"
                        style={{
                            transform: isVisible ? "translateY(0)" : "translateY(100px)",
                            opacity: isVisible ? 1 : 0,
                            transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                    >
                        WORK WITH ME
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
                                Open to full-time and contract roles
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
                            <span className="text-gradient">Open to work.</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            I build AI systems and lifecycle marketing infrastructure, and I&apos;m
                            looking for a team to do it with. Full-time or contract. San Diego or
                            remote.
                        </p>

                        <div
                            className="mt-10 flex flex-wrap items-center gap-4"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
                            }}
                        >
                            <ContactForm triggerSize="lg" showIcon />
                            <Button asChild variant="outline" size="lg" className="group">
                                <Link href="/projects">
                                    See my work
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fit */}
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
                            What I&apos;m looking for
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Two kinds of roles, one way of working
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                            My background runs along two lines that keep meeting: AI systems built
                            with the people who use them, and the marketing automation that brings
                            customers back.
                        </p>
                    </motion.div>

                    <div className="mt-16 grid gap-12 md:grid-cols-2">
                        <motion.div variants={itemVariants}>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <span className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                                    <Check className="text-primary h-3 w-3" />
                                </span>
                                Applied AI and forward-deployed
                            </h3>
                            <ul className="mt-6 space-y-4">
                                {laneA.map((item) => (
                                    <li
                                        key={item}
                                        className="text-muted-foreground flex items-start gap-3"
                                    >
                                        <Check className="text-primary mt-1 h-4 w-4 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <span className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                                    <Check className="text-primary h-3 w-3" />
                                </span>
                                Lifecycle and marketing automation
                            </h3>
                            <ul className="mt-6 space-y-4">
                                {laneB.map((item) => (
                                    <li
                                        key={item}
                                        className="text-muted-foreground flex items-start gap-3"
                                    >
                                        <Check className="text-primary mt-1 h-4 w-4 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Phases */}
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
                            How I work
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Discover, scope, build, stay.
                        </h2>
                    </motion.div>

                    <div className="mt-16 space-y-px">
                        {phases.map((phase) => (
                            <motion.div
                                key={phase.number}
                                variants={itemVariants}
                                className="border-border border-b py-12 first:pt-0 last:border-0"
                            >
                                <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
                                    <div>
                                        <span className="text-muted-foreground font-mono text-sm">
                                            {phase.number}
                                        </span>
                                        <h3 className="font-display mt-2 text-2xl font-bold lg:text-3xl">
                                            {phase.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-1">
                                            {phase.subtitle}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {phase.description}
                                        </p>
                                        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                            {phase.details.map((detail) => (
                                                <li
                                                    key={detail}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <ArrowRight className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Value Prop */}
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
                                What you get
                            </span>
                            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                                Someone who has owned the outcome.
                            </h2>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="text-muted-foreground space-y-6 leading-relaxed"
                        >
                            <p>
                                I co-founded a company and built its product for eight years, so I
                                have been the person who answers when it breaks. That changes how
                                you build: you plan for the CRM being down, the webhook arriving
                                twice, and the model being wrong.
                            </p>
                            <p>
                                At a San Diego clinic, insurance verification used to be days of
                                phone calls. Now a patient uploads their card, a vision model reads
                                it, the CRM gets a contact, and staff get an alert. If the CRM is
                                down, the patient still gets their confirmation.
                            </p>
                            <p className="text-foreground font-medium">
                                I also try to know when not to build. The agent pipeline that runs
                                one client&apos;s backlog is an open-source project I vendored and
                                customized, because writing my own would have been slower and no
                                better.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Proof */}
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
                            Proof of work
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Built, shipped, running in production
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
                    >
                        {proofStats.map((stat) => (
                            <div key={stat.label}>
                                <div className="font-display text-primary text-4xl font-black lg:text-5xl">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-muted-foreground mt-2 text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <div className="bg-border mt-16 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3">
                        {proofProjects.map((project) => (
                            <motion.div key={project.title} variants={itemVariants}>
                                <Link
                                    href={project.href}
                                    className="bg-card hover:bg-card/80 group block p-8 transition-colors lg:p-12"
                                >
                                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                        {project.tag}
                                    </span>
                                    <h3 className="font-display group-hover:text-primary mt-4 text-2xl font-bold transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-3 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="text-muted-foreground group-hover:text-primary mt-6 flex items-center gap-2 text-sm font-medium transition-colors">
                                        View the work
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-12 xl:px-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="font-display text-4xl font-bold tracking-tight lg:text-5xl">
                            Tell me what you&apos;re trying to{" "}
                            <span className="text-gradient">do</span>.
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            Describe the role you&apos;re hiring for or the problem you need solved.
                            I&apos;ll tell you plainly whether I&apos;m a fit.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <ContactForm triggerSize="lg" showIcon triggerText="aaron@arndvs.com" />
                            <Button asChild variant="outline" size="lg" className="group">
                                <a
                                    href="https://linkedin.com/in/arndvs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    LinkedIn
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </Button>
                        </div>
                        <p className="text-muted-foreground mt-8 text-sm">
                            Based in San Diego. Open to remote, hybrid, or on-site in San Diego.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
