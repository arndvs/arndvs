import Link from "next/link";

import type { ExperimentEntry } from "@/lib/data/experiments";

/**
 * "How to use it" and FAQs under a tool. The same FAQs are published as FAQPage, so
 * what a search or AI engine reads matches what's on the page.
 */
export function ExperimentGuide({
    experiment,
    related,
}: {
    experiment: ExperimentEntry;
    /** Where to go next: a service, a case study. */
    related: { label: string; href: string }[];
}) {
    return (
        <section className="border-border border-t py-16 lg:py-24">
            <div className="site-container grid gap-16 lg:grid-cols-[1fr_2fr]">
                <div>
                    <h2 className="font-display text-3xl font-bold tracking-tight">
                        How to use it
                    </h2>
                    <ol className="text-muted-foreground mt-6 list-decimal space-y-3 pl-5 leading-relaxed">
                        {experiment.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                    {related.length > 0 && (
                        <ul className="mt-10 space-y-2">
                            {related.map((r) => (
                                <li key={r.href}>
                                    <Link
                                        href={r.href}
                                        className="text-signal font-medium underline-offset-4 hover:underline"
                                    >
                                        {r.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <h2 className="font-display text-3xl font-bold tracking-tight">Questions</h2>
                    <dl className="mt-6 max-w-3xl space-y-8">
                        {experiment.faqs.map((f) => (
                            <div key={f.question}>
                                <dt className="text-lg font-semibold">{f.question}</dt>
                                <dd className="text-muted-foreground mt-2 leading-relaxed">
                                    {f.answer}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
