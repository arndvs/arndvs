"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AnimatedCounter } from "@/components/animated-counter";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { useAnimationVariants } from "@/lib/hooks/use-animation-variants";

const phases = [
    {
        number: "01",
        title: "Audit",
        subtitle: "Understand before building",
        description:
            "Most businesses that want AI systems haven't clearly mapped what they need. The audit phase is about understanding your cognitive tasks, your team structure, your data, and where agents would create leverage versus noise. This is worth doing even if we don't work together further.",
        details: [
            "Current workflow review — what your team actually does, not what the process doc says",
            "Cognitive task mapping — separating analytical, creative, and procedural work",
            "Agent architecture recommendation — which tasks get specialist agents, which don't",
            "Written findings you keep regardless of next steps",
        ],
    },
    {
        number: "02",
        title: "Architecture",
        subtitle: "Design the specialist system",
        description:
            "A single agent doing five different jobs produces mediocre output on all five. Architecture separates cognitive tasks into specialist roles — an analyst that thinks like an analyst, a copywriter that thinks like a copywriter, an orchestrator that coordinates without doing the work.",
        details: [
            "Specialist agent design — one role, one context window, one job",
            "Knowledge base structure — what each agent sees and what it doesn't",
            "Orchestration design — how agents hand off between phases",
            "Skills library — the procedures each agent follows, not just what it knows",
        ],
    },
    {
        number: "03",
        title: "Build & Tune",
        subtitle: "Implement until it's right",
        description:
            "The first version is never the right version. Build phase includes implementation, real runs against your actual data and workflows, and iterative tuning based on what the system produces. An agent system that works in theory but not in production isn't done.",
        details: [
            "Full implementation tuned to your stack and tools",
            "Integration with existing platforms — CRM, ad accounts, content tools",
            "Iterative refinement based on real output quality",
            "Documentation and training for your team",
        ],
    },
    {
        number: "04",
        title: "Retainer",
        subtitle: "Where it compounds",
        description:
            "Agent infrastructure isn't set-and-forget. Your business evolves, new capabilities emerge, performance data reveals what to tune. A retainer keeps the system improving alongside your operation.",
        details: [
            "Monthly skills tuning based on what's working and what isn't",
            "New agent integration as your operation expands",
            "Performance review — real output analysis, not status calls",
            "Priority access as AI capabilities evolve",
        ],
    },
];

const goodFit = [
    "Your team repeats the same cognitive tasks every week and you know it",
    "You've tried AI tools but results are inconsistent — good in a demo, unreliable in production",
    "You run a SaaS, ecommerce operation, or agency with real workflows to systematize",
    "You want something built for your business, not a template everyone else is using",
    "You understand this is infrastructure — it compounds over time and needs maintenance",
    "You have a developer on staff or the budget to maintain what gets built",
];

const notFit = [
    "You want a quick ChatGPT wrapper or a no-code automation tool",
    "You're looking for someone to manage your existing AI subscriptions",
    "Your workflows aren't defined yet — agents amplify clarity, they don't create it",
    "You need something live in two weeks",
    "You want to own the system but have no technical capacity to maintain it",
];

const proofStats = [
    { value: 17, suffix: "+", label: "Years building for the web" },
    { value: 8, suffix: "", label: "Years leading RipeMetrics" },
    { value: 40, suffix: "%", label: "Customer service cost reduction" },
    { value: 5, suffix: "", label: "AI integrations on one healthcare platform" },
];

const proofProjects = [
    {
        tag: "AI Infrastructure · Open Source",
        title: "ctrl+shft",
        description:
            "The agent infrastructure system behind this offer. 43 skills, lifecycle hooks, compliance HUD, 3-tier security, autonomous Docker loops.",
        href: "/projects/ctrlshft",
    },
    {
        tag: "AI · SaaS · 2017–2025",
        title: "RipeMetrics",
        description:
            "Founded an AI-native customer growth platform and led product and AI engineering from prototype to production over 8 years. Reduced customer service costs 40%.",
        href: "/projects/ripemetrics",
    },
    {
        tag: "Healthcare · AI · 2026",
        title: "AlignSD",
        description:
            "277,000-line healthcare platform with 5 AI integrations, 203 programmatic pages, and custom JSON-LD architecture.",
        href: "/projects/align-san-diego-family-chiropractic",
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
                                Available for Contract & Full-Time
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
                            <span className="text-gradient">AI-powered results.</span>
                        </h1>

                        <p
                            className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl"
                            style={{
                                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                                opacity: isVisible ? 1 : 0,
                                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                            }}
                        >
                            I build production web applications, AI integrations, and full-stack
                            platforms for teams that need senior engineering. Available for contract
                            roles, full-time positions, and select freelance projects.
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
                            Who this is for
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            The right fit matters on both sides
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                            I work with a small number of clients at a time. Before we talk scope,
                            it&apos;s worth being clear about where I can add real value.
                        </p>
                    </motion.div>

                    <div className="mt-16 grid gap-12 md:grid-cols-2">
                        <motion.div variants={itemVariants}>
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <span className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                                    <Check className="text-primary h-3 w-3" />
                                </span>
                                Good fit
                            </h3>
                            <ul className="mt-6 space-y-4">
                                {goodFit.map((item) => (
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
                                <span className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                                    <X className="text-muted-foreground h-3 w-3" />
                                </span>
                                Not the right fit
                            </h3>
                            <ul className="mt-6 space-y-4">
                                {notFit.map((item) => (
                                    <li
                                        key={item}
                                        className="text-muted-foreground flex items-start gap-3"
                                    >
                                        <X className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
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
                            How an engagement works
                        </span>
                        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                            Four phases. One compounding system.
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
                                Why this, why now
                            </span>
                            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight lg:text-4xl">
                                You&apos;re not buying software. You&apos;re buying judgment.
                            </h2>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="text-muted-foreground space-y-6 leading-relaxed"
                        >
                            <p>
                                The tools exist. Claude, GPT-4, agent frameworks — any competent
                                developer can wire them together. What&apos;s scarce is the
                                architectural judgment to know what to build, and the production
                                experience to know why the first three versions won&apos;t work.
                            </p>
                            <p>
                                The instinct is to give one agent everything — research, write,
                                analyze, manage. It&apos;s the same mistake as hiring one person to
                                do a job that needs a team. Specialist agents with scoped roles
                                produce consistent output because they&apos;re not context-switching
                                between five different cognitive modes.
                            </p>
                            <p className="text-foreground font-medium">
                                The point isn&apos;t automation for its own sake. It&apos;s
                                reclaiming the hours your team spends on repeatable cognitive work
                                so they can focus on the judgment calls that actually require
                                humans.
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
                                        View case study
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="border-border bg-muted mt-px rounded-b-2xl border border-t-0 p-6"
                    >
                        <p className="text-muted-foreground/60 font-mono text-xs tracking-widest uppercase">
                            Project case studies — coming soon
                        </p>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Detailed walkthroughs of production systems built for real businesses.
                            First cases publishing Q3 2026.
                        </p>
                    </motion.div>
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
                            Describe what you&apos;re building or the role you&apos;re hiring for.
                            I&apos;ll tell you honestly whether I&apos;m the right fit — and if not,
                            I&apos;ll point you toward what would work instead.
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
                            Based in San Diego. Available for remote, hybrid, or on-site in SD.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
