/**
 * Content for /results. Layout code never holds copy: add, correct, or retire an item here.
 *
 * Rules (enforced in data.test.ts):
 * - Every result names an internal `source` and a `verification` status. `source` is never rendered.
 * - Figures follow docs/reference/facts-ledger.md. When the ledger marks a figure Open, the result
 *   carries `verification: "open"` and the best-supported value, and the PR lists the alternatives.
 * - Testimonials are quoted verbatim. Cuts are marked with an ellipsis; nothing is reworded.
 * - Only testimonials with an approved `permission` render. `written-pending` stays off the page.
 */

export type ResultsAccent = "cyan" | "purple" | "green";

/** Who did the work behind a result. Shown on the card. */
export type Attribution = "solo" | "lead";

/**
 * Where a figure stands, matching the facts ledger.
 * confirmed: Aaron or the client confirmed it. counted: counted from a repo.
 * case-study: taken from the published case study. resume: from the master resume, not re-counted.
 * open: surfaces disagree; the best-supported value is shown.
 */
export type Verification = "confirmed" | "counted" | "case-study" | "resume" | "open";

/** linkedin-approved: a public LinkedIn recommendation. written-*: a written testimonial. */
export type TestimonialPermission = "linkedin-approved" | "written-approved" | "written-pending";

export interface ResultsClient {
    id: string;
    name: string;
    /** One line on what kind of business this is. */
    descriptor: string;
    period: string;
    role: string;
    accent: ResultsAccent;
    caseStudyHref: string;
}

export interface Result {
    id: string;
    clientId: string;
    title: string;
    /** The state before, in a few words. */
    before: string;
    /** The state after, in a few words. */
    after: string;
    /** One or two sentences on what changed and how. */
    change: string;
    caseStudyHref: string;
    attribution: Attribution;
    verification: Verification;
    /** Internal reference for the figure. Not rendered. */
    source: string;
}

export interface Testimonial {
    id: string;
    quote: string;
    author: string;
    title: string;
    organization?: string;
    /** How the author knows Aaron, as LinkedIn states it. */
    relationship: string;
    sourceUrl: string;
    /** ISO date of the recommendation. Empty until a written testimonial is approved. */
    date: string;
    permission: TestimonialPermission;
}

export interface ResultsPageData {
    intro: { eyebrow: string; title: string; description: string };
    clients: ResultsClient[];
    results: Result[];
    testimonials: Testimonial[];
    sourcingNote: string;
}

const LINKEDIN_RECOMMENDATIONS = "https://www.linkedin.com/in/arndvs/details/recommendations/";

export const RESULTS_PAGE: ResultsPageData = {
    intro: {
        eyebrow: "Results",
        title: "What changed after it shipped.",
        description:
            "Before and after, from recent work for a San Diego clinic, a direct-to-consumer brand, and the SaaS company I co-founded. Each result links to the case study with the detail.",
    },

    clients: [
        {
            id: "alignsd",
            name: "Align San Diego Family Chiropractic",
            descriptor: "Chiropractic and wellness clinic, San Diego",
            period: "2025 – present",
            role: "Solo developer",
            accent: "cyan",
            caseStudyHref: "/projects/align-san-diego-family-chiropractic",
        },
        {
            id: "mcrdse",
            name: "MCRDSE",
            descriptor: "Functional-mushroom brand, direct to consumer",
            period: "2026 – present",
            role: "Lead engineer",
            accent: "purple",
            caseStudyHref: "/projects/mcrdse-commerce",
        },
        {
            id: "ripemetrics",
            name: "RipeMetrics",
            descriptor: "Marketing automation and AI customer service SaaS, co-founded",
            period: "2017 – 2025",
            role: "Co-founder; led product and engineering",
            accent: "green",
            caseStudyHref: "/projects/ripemetrics",
        },
    ],

    results: [
        {
            id: "alignsd-insurance-verification",
            clientId: "alignsd",
            title: "Insurance verification without the phone tag",
            before: "Up to 7 days and four handoffs",
            after: "One automated loop",
            change: "Patients upload their insurance card and license online and a vision model reads them. Clear cases go straight to the biller, unclear ones to the front desk, and junk to the business inbox. The front desk steps in only when a case needs a person, instead of spending 15–20 minutes on every call.",
            caseStudyHref: "/projects/align-san-diego-family-chiropractic",
            attribution: "solo",
            verification: "case-study",
            source: "align-san-diego-family-chiropractic/data.ts (insurance-verification deep dive); routing confirmed in arndvs/alignsd src/app/api/insurance-verification/_lib/response-mapper.ts @ 9e772ef. Timing figures: owner to confirm.",
        },
        {
            id: "alignsd-owner-run-platform",
            clientId: "alignsd",
            title: "A clinic site the owner runs herself",
            before: "An outgrown WordPress site and three email tools",
            after: "One platform she edits without a developer",
            change: "The owner publishes pages, events, and service content on her own, and email runs from one system. An AI assist drafts each post's SEO title and description, turning a 15-minute chore into about 10 seconds. The practice serves 5,000+ families.",
            caseStudyHref: "/projects/align-san-diego-family-chiropractic",
            attribution: "solo",
            verification: "case-study",
            source: "align-san-diego-family-chiropractic/data.ts (situation; ai-enhancement and event-approval-workflow deep dives). 5,000+ families: facts ledger, Resume.",
        },
        {
            id: "mcrdse-recovery-sweep",
            clientId: "mcrdse",
            title: "Customers who bought and heard nothing, found",
            before: "Failed CRM pushes went unnoticed",
            after: "580 orders recovered in the first sweep",
            change: "A reconciliation sweep compares the order database with the CRM and re-pushes anything missing, without creating duplicates. Its first full run recovered 580 orders that had missed their lifecycle messages.",
            caseStudyHref: "/projects/mcrdse-commerce",
            attribution: "lead",
            verification: "resume",
            source: "mcrdse-commerce/data.ts (lifecycle-segments deep dive); facts ledger, Resume. Verify in the MCRDSE source.",
        },
        {
            id: "mcrdse-fail-closed-fulfillment",
            clientId: "mcrdse",
            title: "Unpaid orders can no longer ship",
            before: "About $381 shipped to people who never paid",
            after: "Orders ship only on confirmed payment",
            change: "After a declined payment slipped through a block-list, I replaced it with an allow-list of shippable payment statuses. Anything the system does not recognize now fails closed instead of shipping.",
            caseStudyHref: "/projects/mcrdse-commerce",
            attribution: "lead",
            verification: "resume",
            source: "mcrdse-commerce/data.ts (fail-closed-fulfillment deep dive); facts ledger, Resume.",
        },
        {
            id: "mcrdse-fact-check-gate",
            clientId: "mcrdse",
            title: "Fabricated citations stopped before publishing",
            before: "AI drafts with unchecked sources",
            after: "8 fabricated citations caught",
            change: "A fact-check pass reviews every AI-drafted article before it can be approved. Approval is a SHA-256 fingerprint of the exact copy and assets, so any later edit forces a fresh review.",
            caseStudyHref: "/projects/mcrdse-content",
            attribution: "lead",
            verification: "resume",
            source: "Fabricated citations: facts ledger, Resume (not in the case study). SHA-256 approval: mcrdse-content/data.ts (approval-locking deep dive). Verify the 8 in the MCRDSE source.",
        },
        {
            id: "mcrdse-quality-baseline",
            clientId: "mcrdse",
            title: "A storefront with a safety net",
            before: "No tests",
            after: "195 tests and a 284-item audit closed",
            change: "I audited the system for things that looked like they worked but didn't. Each of the 284 items was closed with a fix or a written decision, and the storefront went from no test suite to 195 tests.",
            caseStudyHref: "/projects/mcrdse-commerce",
            attribution: "lead",
            verification: "resume",
            source: "Facts ledger, Resume (284 audit items; 195 storefront tests). Repo count is Open (6/7/8), so it is left out.",
        },
        {
            id: "ripemetrics-onboarding",
            clientId: "ripemetrics",
            title: "Client onboarding in under a minute",
            before: "About 30 minutes of manual setup",
            after: "Under 60 seconds, automated",
            change: "New clients enter their website address. Agents scrape the site, extract hours, contact details, and brand information, and build the AI assistant's knowledge base while the client watches progress live.",
            caseStudyHref: "/projects/ripemetrics",
            attribution: "lead",
            verification: "open",
            source: "ripemetrics/data.ts (ai-onboarding deep dive). Facts ledger Open: 30 min (case study) vs 20+ min (LinkedIn) vs 40 min (Flock prep).",
        },
        {
            id: "ripemetrics-migration",
            clientId: "ripemetrics",
            title: "A platform rebuilt without taking clients offline",
            before: "A Laravel Livewire monolith",
            after: "React and Next.js, with zero downtime",
            change: "We moved paying clients to the new app behind feature flags, busiest screens first, so any account could roll back. The core app reached 880 components and 85 routes.",
            caseStudyHref: "/projects/ripemetrics",
            attribution: "lead",
            verification: "resume",
            source: "ripemetrics/data.ts (frontend-migration deep dive); 880 components / 85 routes: facts ledger, Resume.",
        },
    ],

    testimonials: [
        {
            id: "bonnie-fischer",
            quote: "Before AlignSD, my website was on WordPress, and I couldn't keep it current without waiting on someone. Aaron built the platform so I can update pages, events, and service content myself, without a developer in the loop. Patients now upload their insurance card and driver's license online, and my front desk only steps in when a case needs a person. Our emails run from one system instead of three, and the follow-ups after each visit are going live. We serve 5,000+ families, and I'd recommend Aaron to any practice that wants a website it can actually run.",
            author: "Bonnie Fischer",
            title: "Owner",
            organization: "Align San Diego Family Chiropractic",
            relationship: "Client",
            sourceUrl: "https://alignsd.com",
            date: "",
            // Drafted for her review. Flip to "written-approved" once she approves the text,
            // her name and title, and naming the clinic.
            permission: "written-pending",
        },
        {
            id: "andrew-carrigan",
            quote: "…he was someone who always had deep curiosity and would find creative ways to tackle problems for results. Aaron was always able to grab onto new technologies and quickly and efficiently get up to speed and integrate them as needed. … Aaron is an asset on any team and he is someone who continuously pushes himself to upskill…",
            author: "Andrew Carrigan",
            title: "Automated Marketing Architect",
            organization: "inKind",
            relationship: "Worked with Aaron on the same team at RipeMetrics",
            sourceUrl: LINKEDIN_RECOMMENDATIONS,
            date: "2026-08-22",
            permission: "linkedin-approved",
        },
        {
            id: "philippe-recto",
            quote: "His generosity in educating his interns has made many who have left his wing several times better than when they first joined his business. … Anyone who is starting their new careers for web development will find working for Aaron a valuable step in the right direction.",
            author: "Philippe Recto",
            title: "Salesforce Administrator",
            relationship: "Reported to Aaron directly at RipeMetrics",
            sourceUrl: LINKEDIN_RECOMMENDATIONS,
            date: "2019-01-31",
            permission: "linkedin-approved",
        },
        {
            id: "kevin-oefelein",
            quote: "He seriously knows more about loyalty and cause marketing than anyone I've ever known or any author I've ever read… If you're even thinking of doing any type of cause, loyalty, or reward marketing program in your business or non-profit, you'd be doing yourself a disservice not at least talking to Aaron and seeking out his advice.",
            author: "Kevin Oefelein",
            title: "Author, Speaker, Consultant",
            relationship: "Worked with Aaron at a different company",
            sourceUrl: LINKEDIN_RECOMMENDATIONS,
            date: "2012-10-27",
            permission: "linkedin-approved",
        },
    ],

    sourcingNote:
        "Every figure here is tracked to its source: the code, the case study, or my own records of the work. A number I can't trace stays off the page.",
};

export function isPublishable(testimonial: Testimonial): boolean {
    return testimonial.permission !== "written-pending";
}

export const PUBLISHED_TESTIMONIALS = RESULTS_PAGE.testimonials.filter(isPublishable);

export function resultsForClient(clientId: string): Result[] {
    return RESULTS_PAGE.results.filter((result) => result.clientId === clientId);
}
