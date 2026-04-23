"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const pageData = {
    hero: {
        eyebrow: "AI Systems Consulting",
        title: "Your business runs on decisions.",
        titleAccent: "Let agents handle the rest.",
        description:
            "I build bespoke AI agent systems for businesses that need more than a chatbot — specialist architectures tuned to how your team actually works, implemented and running reliably. I also build full-stack applications for clients who need production-grade software.",
        primaryCta: {
            text: "Start a conversation",
            href: "mailto:aaron@arndvs.com?subject=AI%20Systems%20Consulting",
        },
        secondaryCta: {
            text: "See how I build",
            href: "/projects/ctrlshft",
        },
    },
    fit: {
        label: "Who this is for",
        title: "The right fit matters on both sides",
        intro: "I work with a small number of clients at a time. Before we talk scope, it's worth being clear about where I can add real value and where I can't.",
        yes: {
            label: "Good fit",
            heading: "You're ready for this if...",
            items: [
                "Your team repeats the same cognitive tasks every week and you know it",
                "You've tried AI tools but results are inconsistent — good in a demo, unreliable in production",
                "You run a SaaS, ecommerce operation, or agency with real workflows to systematize",
                "You want something built for your business, not a template everyone else is using",
                "You understand this is infrastructure — it compounds over time and needs maintenance",
                "You have a developer on staff or the budget to maintain what gets built",
            ],
        },
        no: {
            label: "Not the right fit",
            heading: "This probably isn't for you if...",
            items: [
                "You want a quick ChatGPT wrapper or a no-code automation tool",
                "You're looking for someone to manage your existing AI subscriptions",
                "Your workflows aren't defined yet — agents amplify clarity, they don't create it",
                "You need something live in two weeks",
                "You want to own the system but have no technical capacity to maintain it",
            ],
        },
    },
    phases: [
        {
            id: "audit",
            number: "01",
            title: "Audit",
            subtitle: "Understand before building",
            color: "orange" as const,
            description:
                "Most businesses that want AI systems haven't clearly mapped what they need. The audit phase is about understanding your cognitive tasks, your team structure, your data, and where agents would create leverage versus noise. This is worth doing even if we don't work together further.",
            details: [
                "Current workflow review — what your team actually does, not what the process doc says",
                "Cognitive task mapping — separating analytical, creative, and procedural work",
                "Agent architecture recommendation — which tasks get specialist agents, which don't",
                "Written findings you keep regardless of next steps",
            ],
            callout:
                "The diagnostic eye is the product. Most businesses have accumulated AI technical debt — scattered instructions, inconsistent outputs, tools nobody trusts. Seeing it clearly is the first step to fixing it.",
        },
        {
            id: "architecture",
            number: "02",
            title: "Architecture",
            subtitle: "Design the specialist system",
            color: "blue" as const,
            description:
                "A single agent doing five different jobs produces mediocre output on all five. Architecture separates cognitive tasks into specialist roles — an analyst that thinks like an analyst, a copywriter that thinks like a copywriter, an orchestrator that coordinates without doing the work.",
            details: [
                "Specialist agent design — one role, one context window, one job",
                "Knowledge base structure — what each agent sees and what it doesn't",
                "Orchestration design — how agents hand off between phases",
                "Skills library — the procedures each agent follows, not just what it knows",
            ],
            callout: null,
        },
        {
            id: "build",
            number: "03",
            title: "Build & Tune",
            subtitle: "Implement until it's right",
            color: "purple" as const,
            description:
                "The first version is never the right version. Build phase includes implementation, real runs against your actual data and workflows, and iterative tuning based on what the system produces. An agent system that works in theory but not in production isn't done.",
            details: [
                "Full implementation tuned to your stack and tools",
                "Integration with existing platforms — CRM, ad accounts, content tools",
                "Iterative refinement based on real output quality",
                "Documentation tailored to your team, not generic",
                "Training — getting your team confident, not just informed",
            ],
            callout:
                "An agent system nobody uses is worthless. Training is part of the build, not a separate line item.",
        },
        {
            id: "retainer",
            number: "04",
            title: "Retainer",
            subtitle: "Where it compounds",
            color: "green" as const,
            description:
                "Agent infrastructure isn't set-and-forget. Your business evolves, new capabilities emerge, performance data reveals what to tune. A retainer keeps the system improving alongside your operation.",
            details: [
                "Monthly skills tuning based on what's working and what isn't",
                "New agent integration as your operation expands",
                "Performance review — real output analysis, not status calls",
                "Priority access as AI capabilities evolve",
            ],
            callout:
                "The retainer is where institutional knowledge compounds. Skills files improve through use. The system learns how your business works over time. That's the real asset — not the initial setup.",
        },
    ],
    judgment: {
        label: "Why this, why now",
        title: "You're not buying software. You're buying judgment.",
        intro: "The tools exist. Claude, GPT-4, agent frameworks — any competent developer can wire them together. What's scarce is the architectural judgment to know what to build, and the production experience to know why the first three versions won't work.",
        points: [
            {
                id: "problem",
                label: "The problem with most AI implementations",
                title: "One agent, five jobs, mediocre output on all five",
                body: "The instinct is to give one agent everything — research, write, analyze, manage. It's the same mistake as hiring one person to do a job that needs a team. The analyst and the copywriter think differently. Collapsing them degrades both.",
            },
            {
                id: "solution",
                label: "What changes with specialist architecture",
                title: "Each agent does one thing at full quality",
                body: "Specialist agents with scoped roles, their own context, their own skills files, and explicit handoffs produce consistent output because they're not context-switching between five different cognitive modes. The orchestrator coordinates. The specialists execute.",
            },
            {
                id: "need",
                label: "What businesses actually need",
                title: "Infrastructure that runs while you focus on what matters",
                body: "The point isn't automation for its own sake. It's reclaiming the hours your team spends on repeatable cognitive work — ad analysis, content production, support triage, data processing — so they can focus on the judgment calls that actually require humans.",
            },
            {
                id: "longterm",
                label: "The long game",
                title: "Institutional knowledge that accumulates",
                body: "Skills files improve through use. Every time an agent encounters something new, the procedure gets updated. Six months in, the system knows how your business works in ways that don't need to be re-explained. That accumulated context is the real competitive advantage.",
            },
        ],
    },
    proof: {
        label: "Proof of work",
        title: "Built, shipped, running in production",
        intro: "Eight years building and shipping real systems — not demos. The infrastructure behind this consulting offer is open source, documented, and in use.",
        stats: [
            { value: "8+", label: "Years shipping production software" },
            { value: "50+", label: "Enterprise clients on RipeMetrics" },
            { value: "40%", label: "Customer service cost reduction via AI" },
            { value: "5", label: "AI integrations on a single healthcare platform" },
        ],
        projects: [
            {
                id: "ctrlshft",
                tag: "AI Infrastructure · Open Source",
                title: "ctrl+shft",
                description:
                    "The agent infrastructure system behind this offer. 24 skills, lifecycle hooks, compliance HUD, 3-tier security, autonomous Docker loops. Open source and in production.",
                href: "/projects/ctrlshft",
            },
            {
                id: "ripemetrics",
                tag: "AI · SaaS · 2017–2025",
                title: "RipeMetrics",
                description:
                    "Founded and built an AI-native customer growth platform from prototype to 50+ enterprise clients. Reduced customer service costs 40% through AI automation.",
                href: "/projects/ripemetrics",
            },
            {
                id: "alignsd",
                tag: "Healthcare · AI · 2025",
                title: "AlignSD",
                description:
                    "44,000-line healthcare platform with 5 AI integrations, 158 programmatic pages, and a custom JSON-LD architecture. Built solo.",
                href: "/projects/align-san-diego-family-chiropractic",
            },
        ],
    },
    cta: {
        title: "Tell me what you're trying to do.",
        body: "Describe your operation and what you're trying to systematize. If it's a good fit I'll tell you what I think an engagement looks like. If it's not, I'll tell you that too — and point you toward what would work instead.",
        primaryHref: "mailto:aaron@arndvs.com?subject=AI%20Systems%20Consulting",
        secondaryHref: "https://linkedin.com/in/arndvs",
        footerNote: "Based in San Diego. Working with clients remotely worldwide.",
        devNote: "Also taking on full-stack development projects.",
    },
};

const phaseColorMap = {
    orange: "border-l-orange-500",
    blue: "border-l-blue-500",
    purple: "border-l-purple-500",
    green: "border-l-green-500",
} as const;

export default function WorkWithMeContent() {
    const { containerVariants, itemVariants, cardVariants } = useAnimationVariants();

    return (
        <main className="min-h-screen pt-16">
            {/* Hero — no Framer Motion, above-fold */}
            <section
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Work with me — hero"
            >
                <div className="max-w-3xl">
                    <p className="text-primary text-sm font-medium tracking-widest uppercase">
                        {pageData.hero.eyebrow}
                    </p>
                    <h1 className="mt-4 text-5xl font-bold tracking-tight text-balance lg:text-7xl">
                        {pageData.hero.title}{" "}
                        <span className="text-primary">{pageData.hero.titleAccent}</span>
                    </h1>
                    <p className="text-muted-foreground mt-6 text-xl leading-relaxed text-pretty">
                        {pageData.hero.description}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4">
                        <Button asChild size="lg">
                            <a href={pageData.hero.primaryCta.href}>
                                <Mail className="mr-2 h-4 w-4" />
                                {pageData.hero.primaryCta.text}
                            </a>
                        </Button>
                        <Button asChild variant="ghost" size="lg">
                            <Link href={pageData.hero.secondaryCta.href}>
                                {pageData.hero.secondaryCta.text}{" "}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Who it's for */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Who this is for"
            >
                <motion.p
                    variants={itemVariants}
                    className="text-primary text-sm font-medium tracking-widest uppercase"
                >
                    {pageData.fit.label}
                </motion.p>
                <motion.h2
                    variants={itemVariants}
                    className="mt-2 text-3xl font-bold tracking-tight"
                >
                    {pageData.fit.title}
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
                >
                    {pageData.fit.intro}
                </motion.p>
                <motion.div variants={containerVariants} className="mt-8 grid gap-6 md:grid-cols-2">
                    <motion.div variants={cardVariants}>
                        <Card className="h-full border-l-4 border-l-green-500">
                            <CardHeader>
                                <p className="text-xs font-medium tracking-widest text-green-500 uppercase">
                                    {pageData.fit.yes.label}
                                </p>
                                <CardTitle className="text-xl">
                                    {pageData.fit.yes.heading}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {pageData.fit.yes.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed"
                                        >
                                            <span className="mt-0.5 shrink-0 text-green-500">
                                                ✓
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div variants={cardVariants}>
                        <Card className="border-l-muted-foreground/30 h-full border-l-4">
                            <CardHeader>
                                <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                                    {pageData.fit.no.label}
                                </p>
                                <CardTitle className="text-xl">{pageData.fit.no.heading}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {pageData.fit.no.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed"
                                        >
                                            <span className="text-muted-foreground/50 mt-0.5 shrink-0">
                                                ×
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* How an engagement works */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="How an engagement works"
            >
                <motion.p
                    variants={itemVariants}
                    className="text-primary text-sm font-medium tracking-widest uppercase"
                >
                    How an engagement works
                </motion.p>
                <motion.h2
                    variants={itemVariants}
                    className="mt-2 text-3xl font-bold tracking-tight"
                >
                    Four phases. One compounding system.
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
                >
                    Every engagement follows the same progression — from understanding what your
                    operation actually needs to a system running reliably and a team that knows how
                    to use it.
                </motion.p>
                <motion.div variants={containerVariants} className="mt-8 grid gap-6 md:grid-cols-2">
                    {pageData.phases.map((phase) => (
                        <motion.div key={phase.id} variants={cardVariants}>
                            <Card className={`h-full border-l-4 ${phaseColorMap[phase.color]}`}>
                                <CardHeader>
                                    <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                                        {phase.number}
                                    </p>
                                    <CardTitle className="text-2xl">{phase.title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {phase.subtitle}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {phase.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {phase.details.map((detail, i) => (
                                            <li
                                                key={i}
                                                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
                                            >
                                                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 opacity-40" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                    {phase.callout && (
                                        <div className="bg-muted text-muted-foreground rounded-md p-4 text-sm leading-relaxed italic">
                                            {phase.callout}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Why this, why now */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Why this, why now"
            >
                <motion.p
                    variants={itemVariants}
                    className="text-primary text-sm font-medium tracking-widest uppercase"
                >
                    {pageData.judgment.label}
                </motion.p>
                <motion.h2
                    variants={itemVariants}
                    className="mt-2 text-3xl font-bold tracking-tight"
                >
                    {pageData.judgment.title}
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
                >
                    {pageData.judgment.intro}
                </motion.p>
                <motion.div variants={containerVariants} className="mt-8 grid gap-6 md:grid-cols-2">
                    {pageData.judgment.points.map((point) => (
                        <motion.div key={point.id} variants={cardVariants}>
                            <Card className="h-full">
                                <CardHeader>
                                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                                        {point.label}
                                    </p>
                                    <CardTitle className="text-xl">{point.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {point.body}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Proof of work */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Proof of work"
            >
                <motion.p
                    variants={itemVariants}
                    className="text-primary text-sm font-medium tracking-widest uppercase"
                >
                    {pageData.proof.label}
                </motion.p>
                <motion.h2
                    variants={itemVariants}
                    className="mt-2 text-3xl font-bold tracking-tight"
                >
                    {pageData.proof.title}
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
                >
                    {pageData.proof.intro}
                </motion.p>

                {/* Stats bar */}
                <motion.div
                    variants={itemVariants}
                    className="bg-border mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg md:grid-cols-4"
                >
                    {pageData.proof.stats.map((stat) => (
                        <div key={stat.label} className="bg-card p-6 text-center">
                            <p className="text-4xl font-bold tracking-tight">{stat.value}</p>
                            <p className="text-muted-foreground mt-2 text-sm leading-tight">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

                {/* Project cards */}
                <motion.div
                    variants={containerVariants}
                    className="bg-border mt-px grid gap-px overflow-hidden rounded-b-lg md:grid-cols-3"
                >
                    {pageData.proof.projects.map((project) => (
                        <motion.div key={project.id} variants={cardVariants}>
                            <Card className="hover:bg-muted/50 h-full rounded-none border-0 transition-colors">
                                <CardHeader>
                                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                                        {project.tag}
                                    </p>
                                    <CardTitle className="text-xl">{project.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="link" className="p-0">
                                        <Link href={project.href}>
                                            View case study <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Case studies placeholder */}
                <motion.div
                    variants={itemVariants}
                    className="border-border bg-muted mt-px rounded-b-lg border border-t-0 p-6"
                >
                    <p className="text-muted-foreground/60 font-mono text-xs tracking-widest uppercase">
                        Consulting case studies — coming soon
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Detailed walkthroughs of agent systems built for real business operations.
                        First cases publishing Q3 2026.
                    </p>
                </motion.div>
            </motion.section>

            {/* CTA */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
                aria-label="Get in touch"
            >
                <motion.div variants={itemVariants}>
                    <Card className="border-border bg-card text-center">
                        <CardContent className="p-8 lg:p-16">
                            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                                {pageData.cta.title}
                            </h2>
                            <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg leading-relaxed">
                                {pageData.cta.body}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Button asChild size="lg">
                                    <a href={pageData.cta.primaryHref}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        aaron@arndvs.com
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <a
                                        href={pageData.cta.secondaryHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        LinkedIn →
                                    </a>
                                </Button>
                            </div>
                            <p className="text-muted-foreground mt-6 text-sm">
                                {pageData.cta.footerNote}
                            </p>
                            <p className="text-muted-foreground/60 mt-1 text-sm">
                                {pageData.cta.devNote}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.section>
        </main>
    );
}
