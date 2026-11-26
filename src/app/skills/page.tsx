import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SKILLS, indexedSkills, isIndexed, projectsFor } from "@/lib/data/skills";
import { breadcrumbList, graph, itemList, webPage } from "@/lib/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";

const DESCRIPTION =
    "The tools Aaron Davis ships with, from Next.js and Sanity to Cloudflare Workers and the OpenAI and Anthropic APIs, each linked to the case studies that use it.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Skills, With the Case Studies Behind Them",
    description: DESCRIPTION,
    path: "/skills",
});

export default function SkillsPage() {
    const featured = indexedSkills();
    const more = SKILLS.filter((s) => !isIndexed(s));

    return (
        <main className="min-h-screen pt-16">
            <JsonLd
                data={graph(
                    webPage({
                        type: "CollectionPage",
                        path: "/skills",
                        name: "Skills",
                        description: DESCRIPTION,
                        extra: {
                            mainEntity: itemList(
                                featured.map((s) => ({ name: s.name, path: `/skills/${s.slug}` })),
                            ),
                        },
                    }),
                    breadcrumbList("/skills", [{ name: "Skills", path: "/skills" }]),
                )}
            />
            <section className="pt-24 pb-16 lg:pt-32">
                <div className="site-container">
                    <h1 className="font-display max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
                        Skills, with <span className="text-gradient">the work behind them</span>
                    </h1>
                    <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
                        Every skill here links to the case studies that use it, so you can read how
                        I used it instead of taking a list on trust.
                    </p>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <ul className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((s) => (
                        <li key={s.slug}>
                            <Link
                                href={`/skills/${s.slug}`}
                                className="border-border hover:border-signal/50 group block h-full rounded-xl border p-6 transition-colors"
                            >
                                <h2 className="font-display group-hover:text-signal text-xl font-bold transition-colors">
                                    {s.name}
                                </h2>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    {projectsFor(s).length} case studies
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
                {more.length > 0 && (
                    <div className="site-container mt-12">
                        <h2 className="font-display text-xl font-bold">Also in the toolkit</h2>
                        <ul className="mt-4 flex flex-wrap gap-3">
                            {more.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        href={`/skills/${s.slug}`}
                                        className="border-border hover:border-primary/50 hover:text-signal rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                                    >
                                        {s.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </main>
    );
}
