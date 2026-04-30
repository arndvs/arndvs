import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "Creative Technology · Full-Stack Web · Transmedia",
        title: "RISE Awake",
        tagline:
            "A 41-route Next.js 16 application operating as the real corporate website of a fictional company that sells autonomous push beds. Sanity v5 CMS, Convex real-time backend, Clerk authentication, temporal.ts dynamic financials engine, 22 internal documents that were never supposed to be public, 6 legal documents that reward reading the fine print, and a 12-stage activation configurator — all maintaining deadpan corporate sincerity across every pixel.",
        stats: [
            { label: "Routes", value: "41" },
            { label: "Internal Docs", value: "22" },
            { label: "Legal Docs", value: "6" },
            { label: "Tech Stack Depth", value: "8+" },
            { label: "Easter Eggs", value: "4+" },
        ],
        cta: {
            text: "Visit riseawake.com",
            href: "https://riseawake.com",
        },
    },

    situation: {
        narrative: [
            "PUSH — the short film — needed more than a landing page. If the film is a marketing video produced by RISE Technologies, Inc., then RISE Technologies needs to exist. Not a splash page with a logo. A complete corporate web presence — product pages, pricing tiers, investor relations with believable financials, legal documents, a careers section with real application forms, an enterprise sales page, an SDK portal, and a 12-stage product configurator that walks you through activating a bed that will never let you sleep in.",
            "riseawake.com is that presence. Built on Next.js 16 with React 19, it operates as a fully functional corporate website that happens to sell something impossible. The tone never breaks. The design system — DM Sans body, DM Serif Display headlines, teal primary, coral accents — is corporate enough to be real and absurd enough to be funny. Every page is a real page. Every document is a real document. The /internal section, accessible because a junior developer named Arvin deployed without auth, contains 22 documents that reveal the company from the inside — marketing playbooks, incident logs, and a resignation letter from a VP who decided she didn't want to be pushed anymore.",
        ],
        context: {
            role: "Full-Stack Developer & Creative Technologist",
            timeline: "2026 – Present",
            client: "RISE Technologies, Inc. (Fictional)",
            live: "riseawake.com",
            stack: [
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Sanity v5",
                "Convex",
                "Clerk",
                "Tailwind v4",
                "shadcn/ui",
                "Recharts",
                "Resend",
            ],
        },
    },

    architecture: {
        intro: "riseawake.com is a modern full-stack application with three content layers: Sanity v5 for blog content, Convex for real-time application data and media management, and a custom temporal.ts engine for dynamic financial metrics. The frontend renders 41+ routes across public pages, semi-protected internal documents, legal documents, investor relations, and interactive flows — all backed by Clerk authentication and a design system that maintains corporate sincerity while hiding satirical depth in every layer.",
        diagramKey: "systemArchitecture",
        secondaryDiagramKey: "routeMap",
        secondaryDiagramTitle: "Route Map — 41+ Pages Organized by Access Level",
        subsystems: [
            {
                title: "Next.js 16 + React 19",
                description:
                    "App Router, Server Components, 41 routes, TypeScript strict mode throughout",
            },
            {
                title: "Sanity v5 CMS",
                description:
                    "Blog content management, live preview, TypeGen pipeline for type-safe GROQ queries",
            },
            {
                title: "Convex Backend",
                description:
                    "Real-time subscriptions, media management, career application forms and processing",
            },
            {
                title: "Clerk Authentication",
                description:
                    "Sign in/up flows, session handling, role-based access for protected routes",
            },
            {
                title: "temporal.ts Engine",
                description:
                    "Custom dynamic data engine with canon FY data and decaying growth model for projected financials",
            },
            {
                title: "Design System",
                description:
                    "DM Sans/DM Serif Display, teal + coral + slate palette, adaptive semantic colors, shadcn/ui",
            },
        ],
    },

    deepDives: [
        {
            id: "temporal-engine",
            title: "The temporal.ts Engine",
            subtitle: "Dynamic Financials That Feel Real Without Being Real",
            problem:
                "A fictional company's investor relations page needs financial data that looks believable — quarterly revenue, unit shipments, deployment stats, customer metrics. Static numbers feel fake. Random numbers feel noisy. The data needs trajectory and internal consistency across multiple charts and tables that a real investor would cross-reference.",
            diagramKey: "temporalEngine",
            walkthrough: [
                "temporal.ts is a custom data engine built around three layers: LORE (fixed historical dates that never change), STATS (canon FY2020–2024 data plus projected years via a decaying growth model), and ADMIN (dates computed relative to 'now' so they never go stale). It takes a fiscal year number and returns a complete FYMetrics snapshot — revenue, units shipped, margin, employees, waitlist, NPS range, and active markets.",
                "The engine models multiple interrelated metrics — revenue, units, margin, employees, waitlist, NPS, and market count — each with its own decaying growth rate but all internally consistent. Canon data (FY2020–2024) is hardcoded from the audited 'dataroom.' Beyond FY2024, metrics are projected using per-metric growth rates that decelerate each year — RISE is maturing toward IPO, so growth naturally tapers.",
                "Admin date functions keep the fiction alive without maintenance. Legal documents show 'last updated' dates 1–4 months ago. Job postings are always 2–10 weeks old. SDK documentation feels recently refreshed. Each function uses a deterministic seed (current date or job ID hash) so the same page load always produces the same dates — no flickering on re-render.",
                "Recharts renders the output as financial visualizations — bar charts, line graphs, and data tables — styled to match the corporate design system. A convenience facade (rise.revenue(), rise.waitlist(), rise.yoyGrowth()) gives consumer pages single-import access to formatted headline stats. A real investor would see a believable story. A careful reader would notice the growth rate is slightly too perfect.",
            ],
            insight: {
                title: "The data is a character",
                body: "The financials tell a story: a company that grew too fast, expanded into markets it shouldn't have, and measures everything except whether people actually wanted to be pushed out of bed. The numbers are the satire. They just look like a dashboard.",
            },
        },
        {
            id: "internal-docs",
            title: "Internal Document System",
            subtitle: "22 Documents That Were Never Supposed to Be Public",
            problem:
                "The transmedia universe needs depth beyond product pages. The audience that falls down the rabbit hole needs to find something real — internal company documents that reveal RISE from the inside. Marketing playbooks, incident reports, discontinuation memos, a resignation letter. Each one needs to be a complete document that functions as corporate satire while cross-referencing the film's characters and events.",
            diagramKey: "internalDocsSystem",
            walkthrough: [
                "The narrative framing is that a junior developer named Arvin Reyes deployed the /internal route to production without authentication controls. The documents are 'accidentally' public. This framing lets the audience feel like they're discovering something secret — which makes the satire land harder than if the documents were presented as part of the official site.",
                "22 documents span four categories: Marketing (persona definitions, messaging playbooks, campaign briefs), Operations (incident logs, the Push Assist discontinuation memo, vendor evaluations), People (onboarding guides, the Claire Sung resignation letter, performance reviews), and Executive (board reports, strategy decks, investor updates).",
                "Cross-references to the film are embedded throughout. The customer avatar in the marketing playbook shares Dave's name. The incident log references the 'kitchen collision event' from Act 3. Claire Sung's resignation letter mentions 'being pushed' in a way that's both literally about the bed and figuratively about corporate culture. James Park, General Counsel, noticed the overlap. He chose not to examine it further.",
                "Each document is rendered as a complete, formatted corporate document with headers, dates, classification labels, and internal reference numbers. The design maintains the same teal + DM Sans system as the public site but with a slightly different layout that signals 'internal tool' without breaking the overall design language.",
            ],
            insight: {
                title: "Arvin is the audience surrogate",
                body: "Arvin Reyes didn't know what he was publishing. Neither does the audience — at first. The documents reveal themselves gradually. The marketing playbook seems normal until you recognize Dave. The incident log seems routine until you realize it describes a scene from the film. The resignation letter makes you feel something unexpected. Arvin's mistake is the audience's invitation.",
            },
        },
        {
            id: "design-system",
            title: "Design System & Visual Identity",
            subtitle: "Corporate Enough to Be Real, Absurd Enough to Be Funny",
            problem:
                "The visual design must maintain an impossible balance: professional enough that a first-time visitor might believe RISE Technologies is real, satirical enough that the comedy registers on second reading. If the design is too polished, the satire is invisible. If it's too obvious, the joke dies on arrival.",
            diagramKey: "designSystem",
            walkthrough: [
                "Typography is the foundation. DM Sans for body text — clean, professional, the kind of font a real startup would choose. DM Serif Display for headlines — authoritative, slightly old-fashioned, suggesting a company that takes itself very seriously. The combination reads as 'enterprise SaaS' at first glance and 'slightly overwrought' at second.",
                "The color system centers on teal as the brand primary — calming, health-adjacent, the kind of color a wellness-tech company would pick. Coral accents mark CTAs and warnings with just enough urgency. Slate backgrounds and careful whitespace create the corporate void that makes the content feel important. The design system uses Tailwind v4's adaptive semantic color tokens — colors that shift contextually between light and dark mode while maintaining the corporate tone.",
                "shadcn/ui provides the component foundation — buttons, cards, dialogs, navigation — ensuring functional consistency across 41 routes. Custom overlays add the RISE-specific personality: the activation configurator's guided flow, the internal document layout, and the legal document sidebar navigation. CSS transitions and Tailwind utilities handle micro-interactions that feel corporate (smooth, measured) rather than playful.",
                "The design tone never breaks character. Product pages present the Push Bed with the same sincerity that Apple presents an iPhone. Pricing tiers use enterprise language ('Custom activation schedules,' 'Dedicated push specialist'). The careers page has real application forms powered by Convex. Every pixel maintains the fiction.",
            ],
            insight: {
                title: "The Konami code is the tell",
                body: "The film grain only appears when you trigger the Konami code easter egg — a momentary rupture in the corporate surface that signals 'this is art, not commerce' before snapping back to professional sobriety. The uncanny valley between corporate website and art installation lives in details like this: things that feel slightly off but that you can't quite place.",
            },
        },
        {
            id: "legal-system",
            title: "Legal Document System",
            subtitle: "Fine Print That Rewards the Careful Reader",
            problem:
                "Legal pages are the most skipped pages on any website. For riseawake.com, they're the deepest layer of the rabbit hole. The legal system needs to be technically complete — real legal document structure, proper section numbering, defined terms — while containing clauses that mirror film events and satirize corporate language.",
            diagramKey: "legalDocSystem",
            walkthrough: [
                "Six legal documents span three categories: Agreements (Terms of Service, Push Mode EULA), Privacy (Privacy Policy, Sleep & Environmental Data Policy), and Disclosures (Autonomous Navigation Disclosure, General Disclaimer). Each is a complete legal document with proper structure — defined terms, numbered sections, effective dates, and governing law.",
                "The Push Mode EULA is the centerpiece. Section 3 states: 'There is no confirmation dialog. There is no undo.' This is both a legal clause and a description of how the bed works in the film — once the button is pressed, there is no off switch. The EULA describes the film's premise in legal language, and the legal language is funnier than any joke could be.",
                "A shared legal layout with sidebar navigation and consistent header styling makes the legal section feel like a real legal portal. Each document is implemented as a dedicated TSX page with hardcoded content — the same approach a compliance team would take when every word matters and CMS flexibility would be a liability.",
                "Cross-references between documents create a web of internal consistency. The Privacy Policy references data collected by the Push Mode EULA. The Terms of Service reference the Sleep & Environmental Data Policy. The Autonomous Navigation Disclosure explains what happens when the bed decides to move. Each reference reinforces the fiction's solidity while adding another layer of absurdity.",
            ],
            insight: {
                title: "Legal language is already satire",
                body: "Corporate legal prose is inherently absurd — dense, self-referential, designed to be comprehensive rather than comprehensible. The RISE legal documents don't need to exaggerate. They just need to apply standard legal language to an absurd product. 'The Service may initiate Push Mode at the scheduled activation time' is simultaneously a real legal clause and a comedy line.",
            },
        },
        {
            id: "easter-eggs",
            title: "Easter Egg Architecture",
            subtitle: "Rewards for the Audience That Falls Deepest",
            problem:
                "A transmedia experience needs depth layers — the surface visit, the curious click-through, the deep dive, and the obsessive exploration. Easter eggs serve the deepest layer, rewarding the audience that has watched the film, read the internal documents, and is now looking for more. They need to be discoverable but not obvious.",
            diagramKey: "easterEggArchitecture",
            walkthrough: [
                "The Konami code triggers a hidden animation — a nod to gaming culture that signals 'there are secrets here' to the audience that tries it. It's the most traditional easter egg and serves as a gateway: if you found this, there are more things to find.",
                "The PM-1 Remote reference appears in hover states on product pages — the prop bible's canonical remote designation surfacing in the marketing material. An audience member who read the production documents would recognize it. A casual visitor would see a model number.",
                "The push listener responds to keyboard input that spells 'push' — a direct interaction with the film's central concept. The response is subtle enough that the user might wonder if they imagined it, which is exactly how the bed's presence works in the film.",
                "Arvin's TODO comments are scattered through the site's source code (visible in the browser's developer tools) — references to the junior developer whose deployment mistake exposed the internal documents. A web developer inspecting the site would find comments like '// TODO: Arvin - add auth before launch' — the narrative extending into the code itself.",
            ],
            insight: {
                title: "The best easter egg is the entire website",
                body: "The deepest rabbit hole isn't any single hidden element. It's the realization that riseawake.com is a portfolio piece — that every legal clause, every internal document, every dynamic financial chart was built by a developer as a creative technology showcase. The website's existence is its own meta-easter-egg.",
            },
        },
    ],

    decisions: [
        {
            decision: "Next.js 16 with React 19 on day one",
            alternatives:
                "Next.js 14/15 for stability — React 19 features aren't strictly necessary",
            reasoning:
                "A portfolio project should demonstrate current capabilities. React 19's Server Components, improved streaming, and use() hook are used throughout. The upgrade path from 15 to 16 was clean, and any edge cases encountered became learning opportunities documented in the case study itself.",
        },
        {
            decision: "Sanity v5 + Convex dual backend",
            alternatives:
                "Single backend (Sanity for everything, or Convex for everything, or a traditional database)",
            reasoning:
                "Different content types have different needs. Sanity excels at editorial content with rich schemas, live preview, and TypeGen. Convex excels at real-time application data — career applications, media uploads, subscription events. Using both demonstrates the architectural judgment to pick the right tool for each job rather than forcing one tool to do everything.",
        },
        {
            decision: "temporal.ts custom engine over static data",
            alternatives:
                "Hardcode financial numbers — simpler, no engine to maintain, still looks corporate",
            reasoning:
                "Static numbers don't tell a story. The temporal engine generates internally consistent financial trajectories that cross-reference across charts and tables. It demonstrates data engineering skills. And the growth curve being slightly too perfect is itself a joke — RISE's numbers look exactly like what a fictional company would present to investors.",
        },
        {
            decision: "22 internal documents, not 5 or 50",
            alternatives: "Fewer documents for less maintenance, or more for deeper immersion",
            reasoning:
                "22 is enough to span four categories without any document feeling like filler. Each document serves a narrative function — cross-referencing film characters, deepening the satire, or revealing the company's internal contradictions. More would dilute the quality. Fewer would leave gaps in the organizational structure.",
        },
        {
            decision: "Film grain as Konami code easter egg, not site-wide overlay",
            alternatives:
                "Persistent film grain overlay across all pages — more cinematic, less corporate",
            reasoning:
                "A real corporate website wouldn't have a film grain overlay. Keeping the grain hidden behind the Konami code easter egg means the site passes as a genuine corporate presence on first visit. The grain becomes a reward for deep exploration — a momentary rupture in the corporate surface that confirms 'this is art, not commerce' before snapping back.",
        },
        {
            decision: "Clerk for auth rather than NextAuth or custom",
            alternatives: "NextAuth for more control, or custom auth for maximum flexibility",
            reasoning:
                "Clerk provides production-quality auth with minimal boilerplate — sign-in/up flows, session management, role-based access. For a portfolio project, the value is in demonstrating integration judgment (picking Clerk and integrating it cleanly) rather than building auth from scratch. The /internal route's 'accidental' public access is a narrative choice, not a Clerk limitation.",
        },
        {
            decision: "Real application forms on the careers page",
            alternatives:
                "Static careers page with 'Apply via email' — less engineering, same visual",
            reasoning:
                "The application form powered by Convex demonstrates full-stack capability and maintains the fiction's completeness. An audience member can actually apply to work at RISE Technologies. The form submissions are real. The company isn't. This is the kind of detail that makes the transmedia experience feel complete rather than sketched.",
        },
        {
            decision: "12-stage activation configurator",
            alternatives: "Simple 'Buy Now' flow or a shorter 3-step configuration",
            reasoning:
                "12 stages mirrors enterprise software onboarding — deliberately long, deliberately detailed, each step asking you to configure something slightly absurd ('Push intensity preference,' 'Morning activation window,' 'Household obstacle inventory'). The length is the joke. The implementation demonstrates complex multi-step form state management.",
        },
    ],

    learnings: [
        {
            title: "Dual CMS architecture scales cleanly",
            body: "Sanity for editorial content and Convex for application data created clear boundaries. Neither system fought the other. Content editors use Sanity Studio. Application data flows through Convex mutations. The frontend queries both without confusion.",
        },
        {
            title: "Fictional products are the best portfolio pieces",
            body: "A real client constrains what you can show. A fictional company lets you demonstrate every capability — CMS integration, real-time backends, auth flows, dynamic data, legal systems, design systems — without NDAs or scope limitations.",
        },
        {
            title: "Satire requires more rigor than sincerity",
            body: "Every satirical element must be technically correct to land. The legal documents need real legal structure. The financials need internal consistency. The design system needs corporate-grade polish. Cutting corners makes the satire feel lazy instead of sharp.",
        },
        {
            title: "Easter eggs should reward depth, not gate content",
            body: "The Konami code, PM-1 reference, and push listener add delight for deep explorers without hiding critical content. The internal documents are the discovery — the easter eggs are the bonus for going further.",
        },
        {
            title: "temporal.ts solved a problem every portfolio has",
            body: "Dynamic, internally consistent demo data is hard. Most portfolio projects show static screenshots or fake numbers that don't cross-reference. A canon-plus-projection engine produces data that tells a story, extends into the future, and survives cross-referencing.",
        },
        {
            title: "The narrative layer elevates the technical work",
            body: "41 routes of corporate website is a solid technical demo. 41 routes of satirical transmedia universe connected to a short film is memorable. The narrative doesn't replace the engineering — it makes the engineering impossible to forget.",
        },
    ],

    metrics: {
        hero: [
            { value: 41, label: "Routes", suffix: "+" },
            { value: 22, label: "Internal Documents", suffix: "" },
            { value: 6, label: "Legal Documents", suffix: "" },
            { value: 12, label: "Configurator Stages", suffix: "" },
        ],
        supporting: [
            { value: 8, label: "Tech Stack Integrations" },
            { value: 4, label: "Content Categories" },
            { value: 4, label: "Easter Eggs" },
            { value: 50, label: "Total URLs", suffix: "+" },
            { value: 3, label: "Backend Services" },
            { value: 3, label: "Legal Categories" },
            { value: 8, label: "Diagram Types" },
            { value: 5, label: "Anti-Spam Layers" },
        ],
    },

    gallery: [],

    cta: {
        text: "riseawake.com is the companion piece to PUSH — the short film. The website is the company. The film is the marketing video. Together, they demonstrate full-stack engineering, creative technology, and transmedia storytelling as a single integrated portfolio piece.",
        buttons: [
            {
                text: "View PUSH Case Study",
                href: "/projects/push",
                variant: "default",
            },
            {
                text: "Visit riseawake.com",
                href: "https://riseawake.com",
                variant: "outline",
            },
            {
                text: "View on GitHub",
                href: "https://github.com/arndvs/rise-awake",
                variant: "outline",
            },
        ],
    },
};
