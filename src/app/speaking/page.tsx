import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { generateSiteMetadata } from "@/lib/metadata";
import { safeJsonLdStringify } from "@/lib/utils/safe-json-ld";
import { siteConfig } from "@/sanity/env";

import { TalkDetail } from "./components";
import { TALKS } from "./data";

const description =
    "Talks and hands-on AI workshops by Aaron Davis for small business owners and local groups in San Diego: practical, no jargon, built around something attendees can use that week.";

export const metadata: Metadata = generateSiteMetadata({
    title: "Speaking",
    description,
    path: "/speaking",
});

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
                location: { "@type": "Place", name: talk.venue, address: talk.city },
                organizer: { "@type": "Organization", name: talk.host },
                performer: { "@id": `${siteConfig.url}/#person` },
                url: `${siteConfig.url}/speaking#${talk.id}`,
            })),
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
            />
            <main className="min-h-screen">
                <header className="pt-32 pb-16 lg:pt-40 lg:pb-24">
                    <div className="site-container">
                        <span className="text-signal text-sm font-medium tracking-widest uppercase">
                            Speaking
                        </span>
                        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                            AI workshops for people who run the business.
                        </h1>
                        <p className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed lg:text-xl">
                            I teach small business owners and local groups to use AI on the work in
                            front of them. No jargon and no tool tour: everyone leaves with
                            something set up that they can use that week.
                        </p>
                        <div className="mt-10">
                            <ContactForm triggerText="Invite me to speak" showIcon />
                        </div>
                    </div>
                </header>

                {TALKS.map((talk) => (
                    <TalkDetail key={talk.id} talk={talk} />
                ))}
            </main>
        </>
    );
}
