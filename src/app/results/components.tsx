import { ArrowRight, ArrowUpRight } from "lucide-react";

import Link from "next/link";

import type { Attribution, Result, ResultsAccent, ResultsClient, Testimonial } from "./data";

interface AccentClasses {
    dot: string;
    text: string;
    link: string;
}

// Literal class names so Tailwind keeps them. 600 on light, 400 on dark, for contrast.
const ACCENTS: Record<ResultsAccent, AccentClasses> = {
    cyan: {
        dot: "bg-cyan-500",
        text: "text-cyan-700 dark:text-cyan-400",
        link: "hover:text-cyan-700 dark:hover:text-cyan-400",
    },
    purple: {
        dot: "bg-purple-500",
        text: "text-purple-700 dark:text-purple-400",
        link: "hover:text-purple-700 dark:hover:text-purple-400",
    },
    green: {
        dot: "bg-green-500",
        text: "text-green-700 dark:text-green-400",
        link: "hover:text-green-700 dark:hover:text-green-400",
    },
};

export const ATTRIBUTION_LABELS: Record<Attribution, string> = {
    solo: "Built solo",
    lead: "Lead engineer",
};

export function ClientHeader({ client, headingId }: { client: ResultsClient; headingId: string }) {
    const accent = ACCENTS[client.accent];
    return (
        <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-3">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${accent.dot}`} />
                <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                    {client.period}
                </span>
            </div>
            <h2 id={headingId} className="font-display mt-3 text-3xl lg:text-4xl">
                {client.name}
            </h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">{client.descriptor}</p>
            <p className="text-muted-foreground mt-1 text-sm">{client.role}</p>
            <Link
                href={client.caseStudyHref}
                className={`text-foreground group mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors ${accent.link}`}
            >
                Read the case study
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
}

export function ResultCard({ result, accent }: { result: Result; accent: ResultsAccent }) {
    const classes = ACCENTS[accent];
    return (
        <article className="bg-card flex flex-col p-6 lg:p-8">
            <h3 className="text-lg leading-snug font-semibold">{result.title}</h3>
            <dl className="mt-6 space-y-4">
                <div>
                    <dt className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                        Before
                    </dt>
                    <dd className="text-muted-foreground mt-1 leading-snug">{result.before}</dd>
                </div>
                <div>
                    <dt className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                        After
                    </dt>
                    <dd className={`font-display mt-1 text-3xl leading-none ${classes.text}`}>
                        {result.after}
                    </dd>
                </div>
            </dl>
            <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{result.change}</p>
            <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-xs">
                <span className="text-muted-foreground font-medium tracking-wide uppercase">
                    {ATTRIBUTION_LABELS[result.attribution]}
                </span>
                <Link
                    href={result.caseStudyHref}
                    className={`text-foreground group inline-flex items-center gap-1 font-medium transition-colors ${classes.link}`}
                    aria-label={`Case study: ${result.title}`}
                >
                    Case study
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </article>
    );
}

const monthYear = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
});

export function formatTestimonialDate(isoDate: string): string {
    return monthYear.format(new Date(`${isoDate}T00:00:00Z`));
}

function sourceLabel(url: string): string {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "linkedin.com" ? "View on LinkedIn" : host;
}

export function TestimonialQuote({ testimonial }: { testimonial: Testimonial }) {
    const role = [testimonial.title, testimonial.organization].filter(Boolean).join(", ");
    return (
        <figure className="border-border bg-card flex flex-col rounded-2xl border p-8 lg:p-10">
            <blockquote cite={testimonial.sourceUrl} className="text-lg leading-relaxed">
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="border-border mt-auto border-t pt-6 text-sm">
                <cite className="text-foreground block font-semibold not-italic">
                    {testimonial.author}
                </cite>
                <span className="text-muted-foreground mt-1 block">{role}</span>
                <span className="text-muted-foreground mt-1 block">
                    {testimonial.relationship}
                    {testimonial.date && (
                        <>
                            {" · "}
                            <time dateTime={testimonial.date}>
                                {formatTestimonialDate(testimonial.date)}
                            </time>
                        </>
                    )}
                </span>
                <a
                    href={testimonial.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal mt-4 inline-flex items-center gap-1 font-medium hover:underline"
                >
                    {sourceLabel(testimonial.sourceUrl)}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                </a>
            </figcaption>
        </figure>
    );
}
