import { Check } from "lucide-react";

import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbList, graph } from "@/lib/json-ld";
import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import { TalkDetail, TopicCard } from "./components";
import {
    IDEAL_AUDIENCES,
    ORGANIZER_QUOTES,
    SESSION_PRINCIPLES,
    SPEAKING_INTRO,
    TALKS,
    TOPICS,
} from "./data";

const description =
    "Talks and hands-on AI workshops by Aaron Davis for business groups, practitioners, and engineering teams in San Diego: a live demo, plain language, and something attendees can use that week.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Speaking",
    description,
    path: "/speaking",
});

const talksById = new Map(TALKS.map((talk) => [talk.id, talk]));
const approvedQuotes = ORGANIZER_QUOTES.filter((quote) => quote.approved);

export default function SpeakingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${siteConfig.url}/speaking/#webpage`,
                url: `${siteConfig.url}/speaking`,
                name: "Speaking",
                description,
                isPartOf: { "@id": `${siteConfig.url}/#website` },
                about: { "@id": `${siteConfig.url}/#person` },
            },
            ...TALKS.map((talk) => ({
                "@type": "EducationEvent",
                "@id": `${siteConfig.url}/speaking/#${talk.id}`,
                name: talk.title,
                description: talk.summary,
                startDate: talk.date,
                eventStatus: "https://schema.org/EventScheduled",
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                ...(talk.city && {
                    location: {
                        "@type": "Place",
                        name: talk.venue ?? talk.city,
                        address: talk.city,
                    },
                }),
                organizer: { "@type": "Organization", name: talk.host },
                performer: { "@id": `${siteConfig.url}/#person` },
                url: `${siteConfig.url}/speaking#${talk.id}`,
                ...(talk.links?.length && { sameAs: talk.links.map((link) => link.href) }),
            })),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <JsonLd
                data={graph(breadcrumbList("/speaking", [{ name: "Speaking", path: "/speaking" }]))}
            />
            <main className="min-h-screen">
                {/* Intro */}
                <header className="pt-32 pb-16 lg:pt-40 lg:pb-24">
                    <div className="site-container">
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            {SPEAKING_INTRO.eyebrow}
                        </span>
                        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                            {SPEAKING_INTRO.title}
                        </h1>
                        <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl">
                            {SPEAKING_INTRO.description}
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-6">
                            <ContactForm triggerText="Invite me to speak" showIcon />
                            <a
                                href="#topics"
                                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                            >
                                See topics
                            </a>
                        </div>
                    </div>
                </header>

                {/* What a group gets */}
                <section
                    aria-labelledby="principles-heading"
                    className="border-border border-t py-16 lg:py-24"
                >
                    <div className="site-container grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <div>
                            <h2
                                id="principles-heading"
                                className="font-display text-3xl lg:text-4xl"
                            >
                                What your group gets
                            </h2>
                            <p className="text-muted-foreground mt-4 leading-relaxed">
                                <span className="text-foreground font-medium">Good fit: </span>
                                {IDEAL_AUDIENCES}
                            </p>
                        </div>
                        <ul className="grid gap-8 sm:grid-cols-2">
                            {SESSION_PRINCIPLES.map((principle) => (
                                <li key={principle.title} className="flex gap-3">
                                    <Check className="text-signal mt-1 h-4 w-4 shrink-0" />
                                    <div>
                                        <p className="font-medium">{principle.title}</p>
                                        <p className="text-muted-foreground mt-1 leading-relaxed">
                                            {principle.detail}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Past sessions */}
                <section aria-labelledby="past-heading" className="border-border border-t">
                    <div className="site-container pt-16 lg:pt-24">
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            Past sessions
                        </span>
                        <h2
                            id="past-heading"
                            className="font-display mt-4 text-4xl tracking-tight lg:text-5xl"
                        >
                            Where I&apos;ve spoken
                        </h2>
                    </div>
                    {TALKS.map((talk, index) => (
                        <TalkDetail key={talk.id} talk={talk} divider={index > 0} />
                    ))}
                </section>

                {/* Topics */}
                <section
                    id="topics"
                    aria-labelledby="topics-heading"
                    className="border-border scroll-mt-20 border-t py-24 lg:py-32"
                >
                    <div className="site-container">
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            Topics
                        </span>
                        <h2
                            id="topics-heading"
                            className="font-display mt-4 text-4xl tracking-tight lg:text-5xl"
                        >
                            What I can bring to your group
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
                            Every session is shaped around the people in the room. These are
                            starting points, and I&apos;m glad to build a new one around what your
                            group needs.
                        </p>
                        <div className="bg-border mt-12 grid gap-px overflow-hidden rounded-2xl md:grid-cols-3">
                            {TOPICS.map((topic) => (
                                <TopicCard
                                    key={topic.id}
                                    topic={topic}
                                    givenAs={
                                        topic.givenAs ? talksById.get(topic.givenAs) : undefined
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Organizer quotes, once approved */}
                {approvedQuotes.length > 0 && (
                    <section
                        aria-label="From organizers"
                        className="border-border border-t py-24 lg:py-32"
                    >
                        <div className="site-container grid gap-6 md:grid-cols-2">
                            {approvedQuotes.map((quote) => (
                                <figure
                                    key={quote.author}
                                    className="border-border bg-card rounded-2xl border p-8"
                                >
                                    <blockquote className="text-lg leading-relaxed">
                                        <p>&ldquo;{quote.quote}&rdquo;</p>
                                    </blockquote>
                                    <figcaption className="text-muted-foreground mt-6 text-sm">
                                        <cite className="text-foreground font-semibold not-italic">
                                            {quote.author}
                                        </cite>
                                        , {quote.role}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="border-border border-t py-24 lg:py-32">
                    <div className="site-container">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="font-display text-4xl tracking-tight lg:text-5xl">
                                Have a group that wants to{" "}
                                <span className="text-gradient">use AI</span>?
                            </h2>
                            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                                Tell me who&apos;s in the room and what they&apos;re stuck on.
                                I&apos;ll suggest a session that fits.
                            </p>
                            <div className="mt-10 flex justify-center">
                                <ContactForm triggerText="Invite me to speak" showIcon />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
