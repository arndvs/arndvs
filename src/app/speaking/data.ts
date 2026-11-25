/**
 * Content for /speaking. Add a talk by appending to TALKS; layout code holds no copy.
 *
 * Client material shown in a talk (a worked example built with a real business) never goes
 * here. Describe it generically.
 */

export interface TalkSlide {
    src: string;
    alt: string;
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
    venue: string;
    city: string;
    /** ISO date. */
    date: string;
    duration: string;
    audience: string;
    summary: string;
    outline: { title: string; detail: string }[];
    takeaways: string[];
    slides: TalkSlide[];
}

const FIND_YOUR_VOICE_SLIDES = "/speaking/find-your-voice";

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
];
