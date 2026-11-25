import { ArrowRight } from "lucide-react";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { SERVICES } from "@/lib/data/services";
import {
    SKILLS,
    findSkill,
    isIndexed,
    projectsFor,
    skillDescription,
    skillTitle,
} from "@/lib/data/skills";
import { breadcrumbList, graph, itemList, webPage } from "@/lib/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
    return SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const skill = findSkill((await params).slug);
    if (!skill) return {};
    return generateSiteMetadata({
        title: skillTitle(skill),
        description: skillDescription(skill),
        path: `/skills/${skill.slug}`,
        // Below the case-study threshold the page is for people following a link, not search.
        ...(isIndexed(skill) ? {} : { robots: { index: false, follow: true } }),
    });
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
    const skill = findSkill((await params).slug);
    if (!skill) notFound();
    const path = `/skills/${skill.slug}`;
    const projects = projectsFor(skill);
    const services = SERVICES.filter((s) => skill.services.includes(s.slug));

    return (
        <main className="min-h-screen pt-16">
            <JsonLd
                data={graph(
                    webPage({
                        type: "CollectionPage",
                        path,
                        name: skillTitle(skill),
                        description: skillDescription(skill),
                        extra: {
                            about: { "@type": "Thing", name: skill.name },
                            mainEntity: itemList(
                                projects.map((p) => ({
                                    name: p.title,
                                    path: `/projects/${p.slug}`,
                                    description: p.tagline,
                                })),
                            ),
                        },
                    }),
                    breadcrumbList(path, [
                        { name: "Skills", path: "/skills" },
                        { name: skill.name, path },
                    ]),
                )}
            />
            <section className="pt-24 pb-16 lg:pt-32">
                <div className="site-container">
                    <Link
                        href="/skills"
                        className="text-signal text-sm font-medium tracking-widest uppercase hover:underline"
                    >
                        Skills
                    </Link>
                    <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
                        {skill.name} <span className="text-gradient">in production</span>
                    </h1>
                    <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
                        {skill.summary}
                    </p>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container">
                    <h2 className="font-display text-3xl font-bold tracking-tight">
                        Case studies using {skill.name}
                    </h2>
                    <ul className="mt-8 grid gap-6 md:grid-cols-2">
                        {projects.map((p) => (
                            <li key={p.slug}>
                                <Link
                                    href={`/projects/${p.slug}`}
                                    className="border-border hover:border-signal/50 group block h-full rounded-xl border p-8 transition-colors"
                                >
                                    <h3 className="font-display group-hover:text-signal text-2xl font-bold transition-colors">
                                        {p.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-3 leading-relaxed">
                                        {p.tagline}
                                    </p>
                                    <p className="mt-4 text-sm">
                                        <span className="text-muted-foreground">Used: </span>
                                        {p.used.join(", ")}
                                    </p>
                                    <span className="text-signal mt-6 inline-flex items-center text-sm font-medium">
                                        Read the case study
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {services.length > 0 && (
                <section className="border-border border-t py-16 lg:py-24">
                    <div className="site-container">
                        <h2 className="font-display text-3xl font-bold tracking-tight">
                            Hire me for this
                        </h2>
                        <ul className="mt-8 space-y-4">
                            {services.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        href={`/services/${s.slug}`}
                                        className="text-signal inline-flex items-center font-medium underline-offset-4 hover:underline"
                                    >
                                        {s.name}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-10">
                            <ContactForm triggerSize="lg" showIcon />
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
