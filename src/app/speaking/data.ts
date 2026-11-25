/**
 * Content for /speaking. Add a talk by appending to TALKS; layout code holds no copy.
 *
 * Client material shown in a talk (a worked example built with a real business) never goes
 * here. Describe it generically.
 */

export interface TalkSlide {
    src: string;
    alt: string;
    /** Intrinsic size. Defaults to 1280×720 (16:9). */
    width?: number;
    height?: number;
}

export interface Talk {
    /** Used as the anchor on /speaking. */
    id: string;
    title: string;
    /** The title the host used to promote the session, if different. */
    billedAs?: string;
    format: string;
    host: string;
    event: string;
    /** Left out when the deck doesn't say where it was given. */
    venue?: string;
    city?: string;
    /** ISO date. */
    date: string;
    duration?: string;
    audience: string;
    summary: string;
    outline: { title: string; detail: string }[];
    takeaways: string[];
    slides: TalkSlide[];
    /** Public evidence the session happened: event pages, recordings. */
    links?: { label: string; href: string }[];
}

/** Something Aaron can bring to a group. `givenAs` points at a past talk when it has been given. */
export interface Topic {
    id: string;
    title: string;
    summary: string;
    formats: string;
    takeaways: string[];
    givenAs?: string;
}

/** A quote from someone who booked or attended a session. Only approved quotes render. */
export interface OrganizerQuote {
    quote: string;
    author: string;
    role: string;
    talkId: string;
    approved: boolean;
}

const FIND_YOUR_VOICE_SLIDES = "/speaking/find-your-voice";
const DEVELOPER_VELOCITY_SLIDES = "/speaking/developer-velocity";

export const TALKS: Talk[] = [
    {
        id: "find-your-voice",
        title: "Find Your Voice: AI Writing That Actually Sounds Like You",
        billedAs:
            "Leveraging AI for Small Business: Your Guide to Making AI Your Secret Marketing Assistant",
        format: "Hands-on workshop",
        host: "Inspired Birth Workers Alliance",
        event: "IBWA's fourth social of 2025",
        venue: "AlignSD Wellness Center",
        city: "San Diego, CA",
        date: "2025-10-18",
        duration: "45 minutes (30 of teaching, 15 of Q&A)",
        audience:
            "Doulas, lactation consultants, occupational therapists, acupuncturists, and other perinatal care providers who run their own practices and write their own marketing.",
        summary:
            "Small business owners know they need to post, email, and blog, but writing takes forever and AI drafts sound like nobody in particular. This workshop showed how to teach AI your voice from writing you already have, then build a reusable system that drafts content you only have to tweak.",
        outline: [
            {
                title: "Gather your voice",
                detail: "Find the writing you already have (posts, emails, your About page, client testimonials) and the voices you admire.",
            },
            {
                title: "Create your writeprint",
                detail: "Turn those samples into a writing profile that scores tone, rhythm, word choice, and structure, so AI can imitate them.",
            },
            {
                title: "Set up a Claude Project",
                detail: "Store the profile with custom instructions, a target market, services, a story vault, and a buyer profile, so you never re-explain yourself.",
            },
            {
                title: "Create content with the system",
                detail: "Prompt templates for social posts, Instagram, newsletters, blog outlines, and idea lists, plus techniques like prompt chaining and self-critique.",
            },
            {
                title: "Live demos",
                detail: "Attendees picked a creator they admire and we analyzed their style from a YouTube transcript, then drafted real content together.",
            },
            {
                title: "Action plan",
                detail: "A seven-day plan: build the profile on day one, set up the project, and end the week with next month's idea list and five drafts scheduled.",
            },
        ],
        takeaways: [
            "A writing profile that captures their own voice",
            "A reusable Claude Project with custom instructions",
            "Prompt templates for five content types",
            "A complete worked example from a local practice",
            "A take-home kit of prompts and questionnaires",
        ],
        slides: [
            {
                src: `${FIND_YOUR_VOICE_SLIDES}/title.webp`,
                alt: "Title slide: Find Your Voice, AI writing that actually sounds like you. Workshop for Inspired Birth Workers Alliance, October 18, 2025.",
            },
            {
                src: `${FIND_YOUR_VOICE_SLIDES}/writeprint.webp`,
                alt: "Slide: What is a writeprint? A fingerprint for your writing style that captures formality, sentence rhythm, natural phrases, structure, and quirks.",
            },
            {
                src: `${FIND_YOUR_VOICE_SLIDES}/prompt-template.webp`,
                alt: "Slide: a prompt template for social posts that connects to a client pain point, includes a personal story, and ends with a question.",
            },
            {
                src: `${FIND_YOUR_VOICE_SLIDES}/advanced-prompting.webp`,
                alt: "Slide: advanced strategies, including meta prompting, chain-of-thought, and tree-of-thought, each with an example.",
            },
        ],
    },
    {
        id: "developer-velocity",
        title: "Building an AI Assistant to Supercharge Developer Velocity",
        format: "Talk and live demo",
        host: "Rēlentless Software Solutions",
        event: "CTO Coffee",
        city: "San Diego, CA",
        date: "2023-08-31",
        duration: "2-hour morning session",
        audience: "CTOs and engineering leaders in San Diego.",
        summary:
            "ChatGPT can't answer questions about your own codebase, docs, or company data. I showed how we built an internal assistant at RipeMetrics that lets our developers ask those questions in plain language: how retrieval works, from loading and embedding documents to vector search, and how to stand up the stack so attendees could build their own.",
        links: [
            {
                label: "LinkedIn event",
                href: "https://www.linkedin.com/events/7092638461374967809/",
            },
        ],
        outline: [
            {
                title: "How ChatGPT works under the hood",
                detail: "A prompt goes to a large language model, which returns a response. The model only knows what it was trained on.",
            },
            {
                title: "Why not just ChatGPT?",
                detail: "It doesn't know your Confluence, your repos, or your stack. An internal knowledge base can answer questions about all three, and agents can draft documentation from it.",
            },
            {
                title: "The embedding path",
                detail: "Document loaders pull text from many formats, text splitters cut it into chunks, an embedding model turns each chunk into numbers by meaning, and a vector store keeps them.",
            },
            {
                title: "The retrieval path",
                detail: "A question is embedded the same way, its nearest neighbors are found in the vector store, and those text pieces go to the model as context with the question.",
            },
            {
                title: "The stack, set up step by step",
                detail: "LangChain, LangSmith, OpenAI embeddings and chat, Pinecone, Vector Admin, Flowise, and Bubble, with account setup for each.",
            },
            {
                title: "Next step: beyond engineering",
                detail: "Pointing the same approach at sales, marketing, and product data to ask questions like where growth is coming from, or which features to build next.",
            },
        ],
        takeaways: [
            "A blueprint for building their own AI assistant",
            "A plain-language model of how retrieval-augmented generation works",
            "A reference stack for an internal knowledge assistant",
            "Ideas for taking it past engineering to sales, marketing, and product",
        ],
        slides: [
            {
                src: `${DEVELOPER_VELOCITY_SLIDES}/title.webp`,
                alt: "Title slide: RipeMetrics, Building an AI Assistant to Supercharge Developer Velocity, August 31, 2023.",
                width: 1280,
                height: 961,
            },
            {
                src: `${DEVELOPER_VELOCITY_SLIDES}/embedding-path.webp`,
                alt: "Slide: the embedding path. A document loader feeds a text splitter, then an embedding model that turns chunks into vectors stored in a vector store.",
            },
            {
                src: `${DEVELOPER_VELOCITY_SLIDES}/retrieval-path.webp`,
                alt: "Slide: the retrieval path. A user question is embedded, compared against stored vectors, and the nearest text pieces go to the language model as context.",
            },
            {
                src: `${DEVELOPER_VELOCITY_SLIDES}/tech-stack.webp`,
                alt: "Slide: the solution tech stack. LangChain, LangSmith, OpenAI, Pinecone, Vector Admin, Flowise, and Bubble.",
            },
        ],
    },
];

export const SPEAKING_INTRO = {
    eyebrow: "Speaking",
    title: "Practical AI sessions for your group.",
    description:
        "Groups ask me to speak when their members want to use AI and don't know where to start. I bring a working demo, plain language, and something everyone can use that week. My past sessions are below, and I'm open to new topics.",
};

/** How a session runs. Each point is true of every talk listed in TALKS. */
export const SESSION_PRINCIPLES: { title: string; detail: string }[] = [
    {
        title: "Built around your group",
        detail: "Examples come from the kind of work your members do, not a generic tool tour.",
    },
    {
        title: "A live demo",
        detail: "I build something in front of the room, using a topic or example the audience picks.",
    },
    {
        title: "Something to keep",
        detail: "Attendees leave with prompts, setup steps, or a blueprint they can use the same week.",
    },
    {
        title: "Plain language",
        detail: "Technical ideas explained so a business owner and an engineer both follow along.",
    },
];

export const IDEAL_AUDIENCES =
    "Business associations and chambers, professional and practitioner groups, small business owners, and engineering teams and their leaders.";

export const TOPICS: Topic[] = [
    {
        id: "ai-writing-in-your-voice",
        title: "AI writing that sounds like you",
        summary:
            "Teach AI your voice from writing you already have, then set up a system that drafts posts, emails, and newsletters you only need to tweak.",
        formats: "45-minute talk or hands-on workshop",
        takeaways: [
            "A writing profile built from their own samples",
            "A reusable AI project that remembers their business",
            "Prompt templates for social, email, and blog content",
        ],
        givenAs: "find-your-voice",
    },
    {
        id: "ai-assistant-on-your-data",
        title: "Build an AI assistant on your own data",
        summary:
            "How retrieval-augmented generation works and how to stand up an assistant that answers questions from your docs, code, or company data.",
        formats: "60-minute talk or 2-hour working session",
        takeaways: [
            "A plain-language model of embeddings and vector search",
            "A reference stack and the steps to set it up",
            "Where these assistants go wrong, and how to check them",
        ],
        givenAs: "developer-velocity",
    },
    {
        id: "ai-at-the-front-desk",
        title: "Put AI to work at the front desk",
        summary:
            "Automate the intake, document checks, and follow-ups that eat a small practice's week, with a person reviewing anything the system isn't sure about.",
        formats: "45-minute talk",
        takeaways: [
            "A map of which front-desk tasks are safe to automate",
            "How to route unclear cases to a person",
            "A real example from a San Diego clinic",
        ],
    },
];

/** Empty until an organizer or attendee approves a quote. */
export const ORGANIZER_QUOTES: OrganizerQuote[] = [];
