import type { Faq } from "@/lib/json-ld";
import { MODEL_CATALOG } from "@/lib/rag-cost/model-pricing";

/** An interactive tool under /experiments. Drives the index page, each page's guide, and the sitemap. */
export interface ExperimentEntry {
    slug: string;
    title: string;
    /** The search title: what someone types to find a tool like this. ≤ 48 characters. */
    seoTitle: string;
    /** schema.org applicationCategory for the WebApplication node. */
    applicationCategory: string;
    /** "How to use it", shown under the tool. */
    steps: string[];
    /** Shown under the tool and published as FAQPage; plain text, read by AI engines. */
    faqs: Faq[];
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
        title: "RAG Cost Calculator",
        seoTitle: "RAG Cost Calculator: What an AI Chatbot Costs",
        applicationCategory: "BusinessApplication",
        steps: [
            "Start from an example (a support bot, an internal docs search, or the course example) or enter your own traffic and token counts.",
            "Pick the model that answers most questions, and a cheaper one to route easy questions to.",
            "Turn on the levers one at a time: routing, a response cache, prompt caching, and decisions handed to a decision model. The waterfall shows what each one saves.",
            "Copy the link to share the exact scenario. Every setting is in the URL.",
        ],
        faqs: [
            {
                question: "What does the RAG cost calculator estimate?",
                answer: "The monthly bill for a retrieval-augmented chatbot: the tokens in each request (system prompt, retrieved chunks, the question and the answer) times your traffic, priced at each model's published per-million-token rates. It also shows latency and what each cost lever saves.",
            },
            {
                question: "Where do the model prices come from?",
                answer: `Each provider's published per-million-token prices, last checked ${MODEL_CATALOG.updated}. Prices change often, so check the provider's pricing page before you commit to a budget.`,
            },
            {
                question: "Which levers cut a RAG chatbot's cost the most?",
                answer: "Usually routing easy questions to a smaller model and caching repeated answers. Prompt caching helps when every request repeats a long system prompt. The calculator applies the levers in a fixed order, because each one saves less once the ones before it have run.",
            },
            {
                question: "What is a decision model, and what is Jev?",
                answer: "A decision model is a small, cheap model that answers yes-or-no questions inside the pipeline: which retrieved chunks to keep, whether a question can be answered, which model should take it, and whether a cached answer really matches. Jev is one, from TypeSafe. The calculator shows what handing those decisions to it saves against its own cost.",
            },
            {
                question: "Is anything I enter sent to a server?",
                answer: "No. The math runs in your browser, and your settings live only in the page's URL.",
            },
            {
                question: "Can you help price or build an AI feature for my product?",
                answer: "Yes. Working out what a RAG feature will cost before it's built is part of how I scope AI development work. See the AI development service page or get in touch.",
            },
        ],
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
        seoTitle: "User Story to Screen List Tool for UX Design",
        applicationCategory: "DesignApplication",
        steps: [
            "Pick an example, or write user stories about what people do today, one per line.",
            "Mark the things (nouns) and the actions (verbs) in each story.",
            "Read the screen list the rules produce: lists, detail screens, and create and edit screens for each thing.",
            "Walk each story through the screens and fix what it flags: a missing list, a missing edit screen, or one-or-many mistakes.",
        ],
        faqs: [
            {
                question: "What does Story to Screens do?",
                answer: "It turns user stories into a list of screens using the rules from my UX process, then walks each story through those screens and points out what a first pass would have missed, such as a list nobody planned or an edit screen for something people need to change.",
            },
            {
                question: "Does it use AI to make the screens?",
                answer: "No. It runs on written rules, not a language model, so the same stories always give the same screens and every suggestion can be traced to a rule.",
            },
            {
                question: "Where is my work saved?",
                answer: "In this browser only. Nothing is sent to a server. A share link packs your stories into the URL so someone else can open the same thing.",
            },
            {
                question: "Where do the rules come from?",
                answer: "From the UX design process I packaged as agent skills in ctrl+shft, my agent infrastructure. The ctrl+shft case study describes how it runs.",
            },
            {
                question: "Can you run this process on my product?",
                answer: "Yes. Mapping stories to screens before anyone writes code is how I start product builds. Get in touch with what you're building.",
            },
        ],
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
