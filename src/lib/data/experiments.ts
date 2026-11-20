/** An interactive experiment under /experiments. Drives the index page and the sitemap. */
export interface ExperimentEntry {
    slug: string;
    title: string;
    description: string;
    lastModified: string;
}

export const EXPERIMENTS: ExperimentEntry[] = [
    {
        slug: "rag-cost",
        title: "RAG Cost Estimator",
        description:
            "What a retrieval-augmented chatbot costs at enterprise scale, which levers move the bill, and what handing decisions to a decision model like Jev saves. Every number shows its math.",
        lastModified: "2026-11-20",
    },
];

export const findExperiment = (slug: string): ExperimentEntry => {
    const entry = EXPERIMENTS.find((experiment) => experiment.slug === slug);
    if (!entry) throw new Error(`No experiment registered with slug "${slug}".`);

    return entry;
};
