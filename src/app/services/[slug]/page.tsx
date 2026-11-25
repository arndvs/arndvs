import { ArrowRight, Check } from "lucide-react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RESULTS_PAGE } from "@/app/results/data";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { EXPERIMENTS } from "@/lib/data/experiments";
import { PROCESS, SERVICES, findService } from "@/lib/data/services";
import { breadcrumbList, faqPage, graph, service as serviceNode, webPage } from "@/lib/json-ld";
import { CASE_STUDIES } from "@/lib/llms/sources";
import { generateSiteMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
    return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const s = findService((await params).slug);
    if (!s) return {};
    return generateSiteMetadata({
        title: s.title,
        description: s.description,
        path: `/services/${s.slug}`,
    });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const s = findService((await params).slug);
    if (!s) notFound();
    const path = `/services/${s.slug}`;
    const results = s.resultIds.flatMap((id) => RESULTS_PAGE.results.filter((r) => r.id === id));
    const experiments = (s.experiments ?? []).flatMap((slug) =>
        EXPERIMENTS.filter((e) => e.slug === slug),
    );

    return (
        <main className="min-h-screen pt-16">
            <JsonLd
                data={graph(
                    webPage({ path, name: s.title, description: s.description }),
                    breadcrumbList(path, [
                        { name: "Services", path: "/services" },
                        { name: s.name, path },
                    ]),
                    serviceNode({
                        path,
                        name: s.name,
                        description: s.description,
                        serviceType: s.serviceType,
                    }),
                    faqPage(path, s.faqs),
                )}
            />

            <section className="pt-24 pb-16 lg:pt-32">
                <div className="site-container">
                    <Link
                        href="/services"
                        className="text-muted-foreground hover:text-foreground text-sm"
                    >
                        ← All services
                    </Link>
                    <p className="text-signal mt-6 text-sm font-medium tracking-widest uppercase">
                        {s.name}
                    </p>
                    <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
                        {s.h1}
                    </h1>
                    <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
                        {s.intro}
                    </p>
                    <div className="mt-10 flex flex-wrap gap-4">
                        <ContactForm triggerSize="lg" showIcon />
                        <a
                            href="#proof"
                            className="text-signal inline-flex items-center font-medium"
                        >
                            See the proof <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container grid gap-12 md:grid-cols-2">
                    <div>
                        <h2 className="font-display text-3xl font-bold tracking-tight">
                            Who it&apos;s for
                        </h2>
                        <ul className="mt-6 space-y-4">
                            {s.forWho.map((item) => (
                                <li
                                    key={item}
                                    className="text-muted-foreground flex items-start gap-3"
                                >
                                    <Check className="text-signal mt-1 h-4 w-4 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-display text-3xl font-bold tracking-tight">
                            What you get
                        </h2>
                        <ul className="mt-6 space-y-4">
                            {s.deliverables.map((item) => (
                                <li
                                    key={item}
                                    className="text-muted-foreground flex items-start gap-3"
                                >
                                    <Check className="text-signal mt-1 h-4 w-4 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section id="proof" className="border-border scroll-mt-24 border-t py-16 lg:py-24">
                <div className="site-container">
                    <h2 className="font-display text-3xl font-bold tracking-tight">Proof</h2>
                    {results.length > 0 && (
                        <ul className="mt-8 grid gap-6 md:grid-cols-2">
                            {results.map((r) => (
                                <li key={r.id} className="border-border rounded-xl border p-6">
                                    <h3 className="text-lg font-semibold">{r.title}</h3>
                                    <p className="text-muted-foreground mt-2 text-sm">
                                        <span className="line-through opacity-70">{r.before}</span>{" "}
                                        → <span className="text-foreground">{r.after}</span>
                                    </p>
                                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                                        {r.change}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    <ul className="mt-8 space-y-4">
                        {s.caseStudies.map((c) => (
                            <li key={c.slug}>
                                <Link
                                    href={`/projects/${c.slug}`}
                                    className="border-border hover:border-signal/50 group block rounded-xl border p-6 transition-colors"
                                >
                                    <span className="group-hover:text-signal font-semibold transition-colors">
                                        {CASE_STUDIES[c.slug]?.title ?? c.slug}
                                    </span>
                                    <span className="text-muted-foreground mt-1 block text-sm">
                                        {c.why}
                                    </span>
                                </Link>
                            </li>
                        ))}
                        {experiments.map((e) => (
                            <li key={e.slug}>
                                <Link
                                    href={`/experiments/${e.slug}`}
                                    className="border-border hover:border-signal/50 group block rounded-xl border p-6 transition-colors"
                                >
                                    <span className="group-hover:text-signal font-semibold transition-colors">
                                        Try it: {e.title}
                                    </span>
                                    <span className="text-muted-foreground mt-1 block text-sm">
                                        {e.description}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container">
                    <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
                    <ol className="mt-8 grid gap-6 md:grid-cols-2">
                        {PROCESS.map((step, i) => (
                            <li key={step.title} className="border-border rounded-xl border p-6">
                                <span className="text-signal font-mono text-sm">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <h3 className="mt-2 font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                    {step.detail}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container">
                    <h2 className="font-display text-3xl font-bold tracking-tight">Questions</h2>
                    <dl className="mt-8 max-w-3xl space-y-8">
                        {s.faqs.map((f) => (
                            <div key={f.question}>
                                <dt className="font-semibold">{f.question}</dt>
                                <dd className="text-muted-foreground mt-2 leading-relaxed">
                                    {f.answer}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold tracking-tight">
                            Tell me what you&apos;re trying to fix
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            You&apos;ll get a written scope and an estimate.
                        </p>
                    </div>
                    <ContactForm triggerSize="lg" showIcon />
                </div>
            </section>
        </main>
    );
}
