/** An interactive experiment under /experiments. Drives the index page and the sitemap. */
export interface ExperimentEntry {
    slug: string;
    title: string;
    description: string;
    lastModified: string;
    /** An illustration of the experiment, 2400×1350 with no text of its own, shown on its card on /experiments. */
    image: { src: string; alt: string };
    /** The 1200×630 link preview for the experiment's page. */
    shareImage: string;
}

export const EXPERIMENTS: ExperimentEntry[] = [
    {
        slug: "rag-cost",
        title: "RAG Cost Estimator",
        description:
            "What a retrieval-augmented chatbot costs at enterprise scale, which levers move the bill, and what handing decisions to a decision model like Jev saves. Every number shows its math.",
        lastModified: "2026-11-20",
        image: {
            src: "/images/experiments/rag-cost-card.jpg",
            alt: "Four levers beside a printed monthly bill. Routing, a response cache, and two Jev decisions have torn strips off it, taking it from $2,700 to $1,020.73 a month, 62% less.",
        },
        shareImage: "/og/experiments-rag-cost.jpg",
    },
    {
        slug: "story-to-screens",
        title: "Story to Screens",
        description:
            "Turn user stories into a screen list with the rules from a UX process, then see what a first pass would have missed: lists, edit screens, and one-or-many mistakes. Try an example or write your own.",
        lastModified: "2026-11-24",
        image: {
            src: "/images/experiments/story-to-screens-card.jpg",
            alt: "A user story with its nouns and verbs marked, feeding a flow of screens colored by release.",
        },
        shareImage: "/og/experiments-story-to-screens.jpg",
    },
];

export const findExperiment = (slug: string): ExperimentEntry => {
    const entry = EXPERIMENTS.find((experiment) => experiment.slug === slug);
    if (!entry) throw new Error(`No experiment registered with slug "${slug}".`);

    return entry;
};
