/**
 * What Aaron offers to businesses, one entry per service page under /services.
 * Drives the pages, the hub, the sitemap, /llms.txt and the structured data.
 *
 * Each service targets one search query (`query`) so the pages don't compete with each
 * other. Proof points link to case studies (by PROJECTS slug) and results (by RESULTS_PAGE
 * id); tests check both resolve and that no result marked "open" is used. Figures belong
 * in results and case studies, not in this copy, so they stay traced to a source.
 */

export interface ServiceFaq {
    question: string;
    answer: string;
}

export interface Service {
    slug: string;
    /** Navigation and card name. */
    name: string;
    /** The <title>, before " | Aaron Davis". Keep the location or skill a buyer searches for. */
    title: string;
    /** The one query this page should rank for. Not rendered; checked for overlap in tests. */
    query: string;
    /** Meta description, 70–160 characters. */
    description: string;
    h1: string;
    intro: string;
    /** Who this is for, in the reader's words. */
    forWho: string[];
    /** What gets built. */
    deliverables: string[];
    /** Case studies that prove it, by PROJECTS slug, with one line on why each is relevant. */
    caseStudies: { slug: string; why: string }[];
    /** Results that prove it, by RESULTS_PAGE id. */
    resultIds: string[];
    /** Interactive experiments that show the thinking, by EXPERIMENTS slug. */
    experiments?: string[];
    faqs: ServiceFaq[];
    serviceType: string;
    lastModified: string;
}

/** How every engagement runs. Shown on each service page. */
export const PROCESS: { title: string; detail: string }[] = [
    {
        title: "Talk to the person who owns the problem",
        detail: "I start with whoever lives with the problem every day, not a spec handed down. Most of the scope comes out of that first conversation.",
    },
    {
        title: "Scope and estimate up front",
        detail: "You get a written scope and an estimate before any paid work starts, with what's in, what's out and what I'd do first.",
    },
    {
        title: "Build in small, tested steps",
        detail: "Work ships in reviewable pieces with tests, so you can see it running early and change direction cheaply.",
    },
    {
        title: "Launch and stay for the follow-through",
        detail: "I stay through launch and the first weeks of real use, when the important fixes show up.",
    },
];

const WORK_TERMS: ServiceFaq = {
    question: "How do you work: contract, hourly, or full-time?",
    answer: "Contract projects with a written scope and an estimate up front. I'm also open to full-time roles in this area. I'm based in San Diego and work remotely, hybrid, or on-site in San Diego.",
};

export const SERVICES: Service[] = [
    {
        slug: "ai-development",
        name: "AI features and agents",
        title: "AI Developer in San Diego",
        query: "AI developer San Diego",
        description:
            "AI features, agents and RAG systems built into your product and workflows by a San Diego applied AI engineer, from first conversation to production.",
        h1: "AI features that work in production, not just in the demo",
        intro: "I build AI into the products and workflows a business already runs: retrieval over your own content, assistants that act on real systems, and the checks that keep model output honest. I've done it for my own SaaS company for years and for clients since.",
        forWho: [
            "A product team that wants AI features without hiring a whole AI group first",
            "An operator whose team spends hours on documents, triage or follow-up a model could draft",
            "A founder with a prototype that works in a demo and breaks with real users",
        ],
        deliverables: [
            "RAG over your documents, with costs estimated before you build",
            "Assistants and agents that call your APIs, with guardrails and human review where it matters",
            "Evaluation sets that catch invented answers before users do",
            "Model and prompt choices sized to your traffic and budget",
        ],
        caseStudies: [
            {
                slug: "ripemetrics",
                why: "A production RAG pipeline and AI customer service across chat, SMS, email and voice, in the SaaS company I co-founded",
            },
            {
                slug: "mcrdse-content",
                why: "An AI content pipeline with a fact-check gate that stops fabricated citations before publishing",
            },
            {
                slug: "ctrlshft",
                why: "The agent infrastructure I build with every day: skills, guardrail hooks and a compliance HUD",
            },
        ],
        resultIds: ["mcrdse-fact-check-gate"],
        experiments: ["rag-cost"],
        faqs: [
            {
                question: "What does a RAG chatbot cost to run?",
                answer: "It depends on traffic, how much context each answer pulls in, caching, and which model handles which questions. My RAG Cost Calculator shows the math for your numbers; routing easy questions to a smaller model and caching repeated answers are usually the biggest levers.",
            },
            {
                question: "How do you stop the model from making things up?",
                answer: "Every answer has to cite where it came from, checks in code reject anything unsupported, and an evaluation set of real cases runs before any prompt or model change ships. A missing answer is treated as better than a wrong one.",
            },
            {
                question: "Which models and providers do you use?",
                answer: "Whichever fits the job and your data rules. I've shipped on OpenAI and AWS Bedrock and build daily with Anthropic's Claude. Provider code sits behind one interface, so switching later is a small change.",
            },
            WORK_TERMS,
        ],
        serviceType: "AI software development",
        lastModified: "2026-11-24",
    },
    {
        slug: "braze-lifecycle-engineering",
        name: "Braze and lifecycle engineering",
        title: "Braze Developer and Lifecycle Engineer",
        query: "Braze developer",
        description:
            "Braze Canvases, Liquid, data contracts and event pipelines from a Braze Certified Practitioner who co-founded a marketing automation platform.",
        h1: "Lifecycle messages that fire on the right data, and stop when it's wrong",
        intro: "I spent eight years building a marketing automation platform, and I'm a Braze Certified Practitioner. I work on both sides of a lifecycle program: the journeys and messages, and the data and events that decide who gets them.",
        forWho: [
            "A lifecycle team whose journeys depend on data nobody fully trusts",
            "A company moving to Braze that needs the data contract designed before the Canvases",
            "Engineering teams asked to send events to Braze without a clear owner for each field",
        ],
        deliverables: [
            "Data contracts: every profile field, its type, and which system owns it",
            "Canvases with control groups, timing and exits designed around what users did and didn't do",
            "Liquid that checks its own data and aborts instead of sending a wrong offer",
            "Event pipelines that record each purchase once, with retries that can't double-count",
        ],
        caseStudies: [
            {
                slug: "inkind-first-reward-journey",
                why: "A Braze first-reward journey built end to end: Snowflake data contract, Canvas, self-checking Liquid and a Rails outbox",
            },
            {
                slug: "ripemetrics",
                why: "The journey engine and segmentation in the marketing automation platform I co-founded",
            },
            {
                slug: "mcrdse-commerce",
                why: "Order reconciliation across four systems, so customers who bought get their lifecycle messages",
            },
        ],
        resultIds: ["mcrdse-recovery-sweep"],
        faqs: [
            {
                question: "Are you certified in Braze?",
                answer: "Yes: Braze Certified Practitioner and Braze Certified Marketing Specialist, plus Snowflake's Data Engineering and Generative AI certificates.",
            },
            {
                question: "Can you work with our data team, not just in the Braze dashboard?",
                answer: "That's most of the job. I write the data contract with the people who own each source, then build the sync (API events or Cloud Data Ingestion) so one system owns each field and two writers never race.",
            },
            {
                question: "Do you write the copy?",
                answer: "I write the logic, the Liquid and working copy that states the offer plainly. Your brand team owns the final voice.",
            },
            WORK_TERMS,
        ],
        serviceType: "Marketing automation engineering",
        lastModified: "2026-11-24",
    },
    {
        slug: "sanity-nextjs-development",
        name: "Sanity and Next.js sites",
        title: "Sanity and Next.js Developer in San Diego",
        query: "Sanity developer San Diego",
        description:
            "Next.js sites on Sanity that owners edit without a developer: structured content, AI-assisted publishing and technical SEO, built in San Diego.",
        h1: "A site your team runs without calling a developer",
        intro: "I build content sites on Next.js and Sanity for owners who publish their own pages. The structure, the editing experience and the search basics are designed together, so publishing a page doesn't need me.",
        forWho: [
            "A business that has outgrown WordPress and its plugin stack",
            "A marketing team that waits on developers for every page",
            "A founder who needs a site search engines and AI assistants can read",
        ],
        deliverables: [
            "Content models in Sanity shaped around how your team writes, with previews",
            "Next.js pages, fast and accessible, with structured data and sitemaps built in",
            "AI-assisted drafting and checks inside the editor where they save time",
            "Programmatic pages only where you have real, distinct content for each",
        ],
        caseStudies: [
            {
                slug: "align-san-diego-family-chiropractic",
                why: "A Next.js and Sanity platform the practice owner edits herself, replacing WordPress and three email tools",
            },
            {
                slug: "mcrdse-content",
                why: "A content approval-and-shipping workflow and an educational community site",
            },
            {
                slug: "rise-awake",
                why: "A Next.js 16 and Sanity v5 site with a real-time backend and authentication",
            },
        ],
        resultIds: ["alignsd-owner-run-platform"],
        faqs: [
            {
                question: "Why Sanity instead of WordPress?",
                answer: "Sanity stores content as structured data, so the same content can drive pages, structured data and AI-readable files without copy-paste. Editors get a clean, custom editing screen instead of a plugin stack to maintain.",
            },
            {
                question: "Will my team be able to edit it?",
                answer: "That's the main design goal. The practice site in my case studies is edited by its non-technical owner, with no developer in the loop for new pages.",
            },
            {
                question: "Do you handle SEO?",
                answer: "The technical side, yes: structured data, sitemaps, fast pages, canonical URLs, llms.txt and indexing pings. Content strategy works best paired with whoever knows your customers.",
            },
            WORK_TERMS,
        ],
        serviceType: "Website development",
        lastModified: "2026-11-24",
    },
    {
        slug: "healthcare-practice-websites",
        name: "Healthcare practice websites and automation",
        title: "Websites and Automation for Healthcare Practices",
        query: "chiropractor website developer",
        description:
            "Websites and front-office automation for chiropractors and other private practices: online intake, insurance verification and a site the owner edits.",
        h1: "A practice website that does front-desk work",
        intro: "I build websites and automation for private healthcare practices, starting with a San Diego chiropractic practice I've worked with since 2025. The site brings patients in, and the automation behind it takes calls and paperwork off the front desk.",
        forWho: [
            "A practice owner whose site can't be updated without paying someone",
            "A front desk spending hours on insurance verification calls",
            "A practice that wants to rank for its specialties and neighborhoods",
        ],
        deliverables: [
            "A Next.js and Sanity site the owner edits, with service, condition and neighborhood pages",
            "Online insurance-card upload, read by a vision model and routed to the right person",
            "Intake, forms and email that replace separate tools",
            "Local SEO built in: structured data, neighborhood pages with real content, indexing pings",
        ],
        caseStudies: [
            {
                slug: "align-san-diego-family-chiropractic",
                why: "The full platform: insurance verification, programmatic neighborhood pages, AI-assisted content and transactional email",
            },
        ],
        resultIds: ["alignsd-insurance-verification", "alignsd-owner-run-platform"],
        faqs: [
            {
                question: "Does this work with our EHR?",
                answer: "Usually alongside it rather than inside it. The website and intake automation hand off to your existing systems; anything that writes into a patient record is scoped separately and checked with you first.",
            },
            {
                question: "What about HIPAA?",
                answer: "I design to keep patient data to a minimum, use vendors that sign Business Associate Agreements where patient data passes through them, and delete what isn't needed. I'm not a compliance auditor: I'll say plainly what needs your compliance review before launch.",
            },
            {
                question: "Can you help us rank in our neighborhood?",
                answer: "Yes: service and condition pages, neighborhood pages only where you can say something specific, structured data for your practice, and a Google Business Profile that matches the site.",
            },
            WORK_TERMS,
        ],
        serviceType: "Healthcare practice website development",
        lastModified: "2026-11-24",
    },
];

export function findService(slug: string): Service | undefined {
    return SERVICES.find((s) => s.slug === slug);
}
