import { ArrowRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import type { Talk } from "./data";

const longDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

export function formatTalkDate(isoDate: string): string {
    return longDate.format(new Date(`${isoDate}T00:00:00Z`));
}

/** A compact link to a talk, for other pages (Results, About). */
export function TalkLink({ talk }: { talk: Talk }) {
    return (
        <Link
            href={`/speaking#${talk.id}`}
            className="bg-card hover:bg-card/80 group grid items-center gap-8 p-8 transition-colors md:grid-cols-[3fr_2fr] lg:gap-12 lg:p-10"
        >
            <div>
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                    {talk.format} · {talk.host} · {formatTalkDate(talk.date)}
                </span>
                <h3 className="font-display group-hover:text-signal mt-4 text-2xl transition-colors">
                    {talk.title}
                </h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{talk.summary}</p>
                <span className="text-muted-foreground group-hover:text-signal mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors">
                    See the talk
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
            </div>
            {talk.slides[0] && (
                <Image
                    src={talk.slides[0].src}
                    alt={talk.slides[0].alt}
                    width={1280}
                    height={720}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="border-border h-auto w-full rounded-xl border bg-white"
                />
            )}
        </Link>
    );
}

export function TalkDetail({ talk }: { talk: Talk }) {
    const facts = [
        { label: "Date", value: formatTalkDate(talk.date) },
        { label: "Host", value: talk.host },
        { label: "Event", value: talk.event },
        { label: "Venue", value: `${talk.venue}, ${talk.city}` },
        { label: "Format", value: `${talk.format}, ${talk.duration}` },
        { label: "Audience", value: talk.audience },
    ];

    return (
        <article
            id={talk.id}
            aria-labelledby={`${talk.id}-title`}
            className="border-border scroll-mt-20 border-t py-16 lg:py-24"
        >
            <div className="site-container">
                <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
                    <dl className="space-y-5 text-sm lg:sticky lg:top-24 lg:self-start">
                        {facts.map((fact) => (
                            <div key={fact.label}>
                                <dt className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                                    {fact.label}
                                </dt>
                                <dd className="mt-1 leading-relaxed">{fact.value}</dd>
                            </div>
                        ))}
                    </dl>

                    <div>
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            {talk.format}
                        </span>
                        <h2
                            id={`${talk.id}-title`}
                            className="font-display mt-4 text-4xl leading-none lg:text-5xl"
                        >
                            {talk.title}
                        </h2>
                        {talk.billedAs && (
                            <p className="text-muted-foreground mt-4 text-sm">
                                Billed by the host as &ldquo;{talk.billedAs}&rdquo;
                            </p>
                        )}
                        <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                            {talk.summary}
                        </p>

                        {talk.slides.length > 0 && (
                            <ul className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Slides">
                                {talk.slides.map((slide) => (
                                    <li
                                        key={slide.src}
                                        className="border-border overflow-hidden rounded-xl border bg-white"
                                    >
                                        <Image
                                            src={slide.src}
                                            alt={slide.alt}
                                            width={1280}
                                            height={720}
                                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                                            className="h-auto w-full"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                        <h3 className="mt-14 text-lg font-semibold">How the session ran</h3>
                        <ol className="mt-6 space-y-6">
                            {talk.outline.map((part, index) => (
                                <li key={part.title} className="flex gap-5">
                                    <span className="text-muted-foreground w-6 shrink-0 font-mono text-sm leading-7">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <p className="font-medium">{part.title}</p>
                                        <p className="text-muted-foreground mt-1 leading-relaxed">
                                            {part.detail}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <h3 className="mt-14 text-lg font-semibold">Attendees left with</h3>
                        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                            {talk.takeaways.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <ArrowRight className="text-signal mt-1 h-4 w-4 shrink-0" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </article>
    );
}
