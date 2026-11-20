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
];

export const findExperiment = (slug: string): ExperimentEntry => {
    const entry = EXPERIMENTS.find((experiment) => experiment.slug === slug);
    if (!entry) throw new Error(`No experiment registered with slug "${slug}".`);

    return entry;
};
