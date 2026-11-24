import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ClientHeader, ResultCard, TestimonialQuote } from "./components";
import { PUBLISHED_TESTIMONIALS, RESULTS_PAGE, resultsForClient } from "./data";

export default function ResultsContent() {
    const { intro, clients, sourcingNote } = RESULTS_PAGE;

    return (
        <main className="min-h-screen">
            {/* Intro */}
            <header className="pt-32 pb-16 lg:pt-40 lg:pb-24">
                <div className="site-container">
                    <span className="text-signal text-sm font-medium tracking-widest uppercase">
                        {intro.eyebrow}
                    </span>
                    <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                        {intro.title}
                    </h1>
                    <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl">
                        {intro.description}
                    </p>
                    <nav aria-label="On this page" className="mt-10 flex flex-wrap gap-3 text-sm">
                        {clients.map((client) => (
                            <a
                                key={client.id}
                                href={`#${client.id}`}
                                className="border-border text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 transition-colors"
                            >
                                {client.name}
                            </a>
                        ))}
                        {PUBLISHED_TESTIMONIALS.length > 0 && (
                            <a
                                href="#testimonials"
                                className="border-border text-muted-foreground hover:text-foreground rounded-full border px-4 py-2 transition-colors"
                            >
                                Testimonials
                            </a>
                        )}
                    </nav>
                </div>
            </header>

            {/* Results, grouped by client */}
            {clients.map((client) => (
                <section
                    key={client.id}
                    id={client.id}
                    aria-labelledby={`${client.id}-heading`}
                    className="border-border scroll-mt-20 border-t py-16 lg:py-24"
                >
                    <div className="site-container grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <ClientHeader client={client} headingId={`${client.id}-heading`} />
                        <div className="bg-border grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2">
                            {resultsForClient(client.id).map((result) => (
                                <ResultCard
                                    key={result.id}
                                    result={result}
                                    accent={client.accent}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Testimonials */}
            {PUBLISHED_TESTIMONIALS.length > 0 && (
                <section
                    id="testimonials"
                    aria-labelledby="testimonials-heading"
                    className="border-border scroll-mt-20 border-t py-24 lg:py-32"
                >
                    <div className="site-container">
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            Testimonials
                        </span>
                        <h2
                            id="testimonials-heading"
                            className="font-display mt-4 text-4xl tracking-tight lg:text-5xl"
                        >
                            From people who worked with me
                        </h2>
                        <div
                            className={`mt-12 grid gap-6 md:grid-cols-2 ${
                                PUBLISHED_TESTIMONIALS.length % 2 === 1 ? "xl:grid-cols-3" : ""
                            }`}
                        >
                            {PUBLISHED_TESTIMONIALS.map((testimonial) => (
                                <TestimonialQuote key={testimonial.id} testimonial={testimonial} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="border-border border-t py-24 lg:py-32">
                <div className="site-container">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
                            Have a problem like <span className="text-gradient">these</span>?
                        </h2>
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            Tell me what is eating your week. I&apos;ll tell you plainly whether I
                            can help.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                            <Button asChild size="lg" className="group">
                                <Link href="/work-with-me">
                                    Work with me
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/projects">See all projects</Link>
                            </Button>
                        </div>
                        <p className="text-muted-foreground mt-12 text-sm">{sourcingNote}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
