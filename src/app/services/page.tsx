import { ArrowRight } from "lucide-react";

import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/data/services";
import { breadcrumbList, graph, itemList, webPage } from "@/lib/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";

const DESCRIPTION =
    "Services for businesses from a San Diego applied AI engineer: AI features and agents, Braze and lifecycle engineering, Sanity and Next.js sites, and healthcare practice websites.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Services: AI, Lifecycle and Web Development in San Diego",
    description: DESCRIPTION,
    path: "/services",
});

export default function ServicesPage() {
    return (
        <main className="min-h-screen pt-16">
            <JsonLd
                data={graph(
                    webPage({
                        type: "CollectionPage",
                        path: "/services",
                        name: "Services",
                        description: DESCRIPTION,
                        extra: {
                            mainEntity: itemList(
                                SERVICES.map((s) => ({
                                    name: s.name,
                                    path: `/services/${s.slug}`,
                                    description: s.description,
                                })),
                            ),
                        },
                    }),
                    breadcrumbList("/services", [{ name: "Services", path: "/services" }]),
                )}
            />
            <section className="pt-24 pb-16 lg:pt-32">
                <div className="site-container">
                    <span className="text-signal text-sm font-medium tracking-widest uppercase">
                        For businesses
                    </span>
                    <h1 className="font-display mt-4 max-w-4xl text-4xl font-bold tracking-tight lg:text-6xl">
                        What I build for <span className="text-gradient">your business</span>
                    </h1>
                    <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed">
                        I&apos;m an applied AI full-stack engineer in San Diego. I take on contract
                        projects in four areas, each backed by work you can read in full. Looking to
                        hire for a role instead?{" "}
                        <Link
                            href="/work-with-me"
                            className="text-signal underline-offset-4 hover:underline"
                        >
                            Work with me
                        </Link>{" "}
                        covers that.
                    </p>
                </div>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <ul className="site-container grid gap-6 md:grid-cols-2">
                    {SERVICES.map((s) => (
                        <li key={s.slug}>
                            <Link
                                href={`/services/${s.slug}`}
                                className="border-border hover:border-signal/50 group block h-full rounded-xl border p-8 transition-colors"
                            >
                                <h2 className="font-display group-hover:text-signal text-2xl font-bold transition-colors">
                                    {s.name}
                                </h2>
                                <p className="text-muted-foreground mt-3 leading-relaxed">{s.h1}</p>
                                <span className="text-signal mt-6 inline-flex items-center text-sm font-medium">
                                    How it works and the proof
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="border-border border-t py-16 lg:py-24">
                <div className="site-container flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold tracking-tight">
                            Have a project in mind?
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Tell me what you&apos;re trying to fix. You&apos;ll get a scope and an
                            estimate.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <ContactForm triggerSize="lg" showIcon />
                        <Button asChild variant="outline" size="lg">
                            <Link href="/results">See results</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
