import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "Content Operations / AI-Search · In Production",
        title: "MCRDSE — Content & Community Platform",
        tagline:
            "A content approval-and-shipping worker with cryptographic approval locking, an educational community site with a branching archetype quiz, and a forward-looking AI-search (GEO) strategy.",
        stats: [
            { label: "Content Repos", value: "3" },
            { label: "Scripts in D1", value: "250" },
            { label: "Articles", value: "56" },
            { label: "Archetypes", value: "7" },
            { label: "Migrations", value: "30+" },
        ],
        cta: { text: "Visit Live Site", href: "https://mcrdsemovement.com" },
        screenshotSrc: "/projects/mcrdse-content/movement-home.png",
        screenshotAlt: "Microdose Movement educational site homepage",
    },

    situation: {
        narrative: [
            "MCRDSE runs three brands — the shop, the Microdose Movement educational community, and a founder's content channel. The founder films short-form content daily, and the bottleneck was never filming — it was deciding what to film, keeping the copy on-brand and legally safe, and getting approved content shipped to scheduling tools. The team needed a briefing dashboard that also enforced a rigorous approval-and-shipping workflow.",
            "The Movement site needed to be a pure-static educational property with a branching archetype quiz, Zod-typed content collections, and a forward-looking strategy for AI-search visibility — while staying strictly separated from the commerce site behind a brand firewall. The constraint: content must be safe (no medical claims, no shop cross-references), approval must be cryptographically locked, and every external integration must be idempotent.",
        ],
        context: {
            role: "Lead Engineer (architecture → production)",
            timeline: "2026 – Present",
            client: "Functional-mushroom brand · Content & community operations",
            live: "content.mcrdse.com · mcrdsemovement.com",
            stack: [
                "Cloudflare Worker",
                "Cloudflare D1",
                "Cloudflare R2",
                "Cloudflare Access",
                "Astro 6",
                "Preact",
                "Zernio API",
                "Linear",
                "GoHighLevel",
                "jose",
            ],
        },
    },

    architecture: {
        intro: "The content platform is a single Cloudflare Worker (Content Ship) that serves a briefing dashboard and a full approval-and-shipping workspace — ~40 routes, D1 for ~250 scripts and ~130 research entries, R2 for media and ZIPs, Cloudflare Access JWT auth, and Zernio for downstream scheduling. The Movement site is a separate pure-static Astro property with a Preact quiz island, 8 Zod-typed content collections, and Pages Functions backed by D1 as the source of truth. The two are deliberately separated by a brand firewall.",
        diagramKey: "contentShip",
        secondaryDiagramKey: "geoStrategy",
        secondaryDiagramTitle: "AI-Search / GEO Strategy",
        subsystems: [
            {
                title: "Content Pipeline",
                description: "Briefing dashboard, script creation, Google Drive intake",
            },
            {
                title: "Approval System",
                description: "SHA-256 approval locking, preflight, drift detection",
            },
            {
                title: "AI-Search / GEO",
                description: "Content-Signal protocol, Person/BlogPosting schema",
            },
            {
                title: "Community Quiz",
                description: "Branching archetype quiz with weighted scoring",
            },
            {
                title: "CRM Sync",
                description: "GoHighLevel contact + email event mirroring",
            },
            {
                title: "Security",
                description: "Access JWT, CSRF, signed R2 URLs, secret scanning",
            },
            {
                title: "Automation",
                description: "Zernio queue, Linear issue auto-create, idempotency",
            },
        ],
    },

    deepDives: [
        {
            id: "approval-locking",
            title: "Cryptographic Approval Locking",
            subtitle: "An Approval That Can't Be Silently Invalidated",
            problem:
                "In a content approval workflow, the dangerous failure mode is shipping stale or edited content that was approved in an earlier state. A simple 'approved' boolean flag trusts whatever is in the database at ship time — if an editor edits the copy or replaces the ZIP after approval, the flag still says approved and the wrong content ships. The system needed an approval that is cryptographically bound to the exact artifact set that was reviewed.",
            diagramKey: "approvalLock",
            walkthrough: [
                "Each approve action SHA-256-hashes the exact copy, the ordered slide identities (key/etag/size), and the final ZIP into a versioned manifest (schema:1). The hash is order-independent — slides are sorted numerically so re-listing doesn't false-positive.",
                "Every mutation path (edit, upload, request-changes) calls a shared invalidation statement that nulls the approval hash. This prevents the class of bug where a rejected script could still ship from a stale package.",
                "A preflight panel checks ordered slides, caption, CTA, and ZIP before approve, returning READY or BLOCKED. Approval is blocked with a 409 if not ready.",
                "At ship time, the approved-package endpoint re-hashes the current artifact set and compares it to the stored hash. If they match, it streams the locked ZIP; if the hash drifted, it returns 409 — the approval is invalidated and the editor must re-approve.",
                "Media-bearing Zernio drafts send approved versions with per-slide HMAC-signed R2 URLs (1-hour expiry), so downstream tools can fetch media without exposing the rest of the app.",
            ],
            insight: {
                title: "Approval Is a Fingerprint, Not a Flag",
                body: "Treating 'approved' as a cryptographic fingerprint of the exact artifact set — rather than a boolean — means any drift is detected at ship time instead of trusted blindly. The hash is the source of truth for what was actually reviewed. This is the difference between an approval system that catches mistakes and one that ships them.",
            },
        },
        {
            id: "geo-strategy",
            title: "AI-Search (GEO) Strategy",
            subtitle: "Getting Cited by AI Search Engines While Refusing Training",
            problem:
                "Traditional SEO optimizes for Google's crawler. But a growing share of discovery now happens through AI search engines (ChatGPT, Perplexity, Gemini) that read and cite web content. For a health-adjacent educational site, the opportunity is to get cited as a source by AI assistants — but the brand also wants to refuse being used for model training. The challenge: signal AI systems to cite the content while explicitly blocking training-only crawlers.",
            diagramKey: "geoStrategy",
            walkthrough: [
                "The robots.txt uses the Content-Signal protocol: search=yes, ai-input=yes, ai-train=no. This explicitly allows AI citation/RAG while blocking training-only crawlers (CCBot, Google-Extended, Meta-ExternalAgent, Bytespider, Amazonbot).",
                "A rich article-seo module emits BlogPosting JSON-LD with speakable (voice-reader surface), mainEntityOfPage entity graph, and rich Person author schema (jobTitle, image, knowsAbout, worksFor) — an E-E-A-T signal for AI citation systems on YMYL health content.",
                "The sitemap is generated with @astrojs/sitemap, filtering out /api/ and /quiz/play so only meaningful content is surfaced.",
                "Gated lead-magnet PDFs (7 archetype guidebooks) are content-addressable with aggressive immutable caching, and doubly excluded from search via robots.txt + X-Robots-Tag: noindex, nofollow.",
            ],
            insight: {
                title: "Design for the AI Crawler, Not Just Google",
                body: "The Content-Signal protocol is a deliberate bet: allow AI systems to read and cite your content, refuse to be training data. Combined with rich Person/BlogPosting/speakable schema, the site is structured to be the answer an AI assistant cites. This is a forward-looking distribution channel that most sites haven't started thinking about.",
            },
        },
        {
            id: "archetype-quiz",
            title: "Branching Archetype Quiz",
            subtitle: "A Pure State Machine That Sorts Visitors Into 7 Archetypes",
            problem:
                "The Movement site needed to engage visitors and route them to the right content. The team designed seven archetypes (Wandering Spore, Foraging Shadow, Farming Node, Dreaming Sprout, Weaving Symbiont, Mycelium Sage, Tending Steward) and a two-minute quiz that sorts visitors into one. The quiz had to be a pure, testable state machine — not tangled UI logic — with branching, weighted scoring, tiebreakers, and escape hatches.",
            diagramKey: "geoStrategy",
            walkthrough: [
                "The quiz engine is a pure, immutable state machine with no UI coupling: initialState, answerQuestion, computeResult, goBack (replays the path from scratch), resetQuiz. Every transition returns a new state.",
                "Branching: Q1 sorts into 4 clusters (A/B/C/D) → Q2 narrows within cluster → Q3 confirms/branches → Q4 locks the archetype (Cluster C exits early at Q3) → Q5 tiebreaker (only for tied Mycelium Sage/Tending Steward) → Q6 captures a Bliss-vs-Focus signal (data-only in v1).",
                "A weighted scoring system computes a secondary archetype, surfaced on the result page alongside the primary.",
                "The Preact island handles session persistence via sessionStorage (1-hour expiry), back navigation, an 'unsure' escape hatch routing to a relevant article, and email capture. The result reveals even if the submit API fails — non-blocking resilience.",
                "Result pages render a 16personalities-style identity narrative with a curated content map per archetype, driven by the archetype-content-map.",
            ],
            insight: {
                title: "Pure Logic, Decoupled UI",
                body: "By keeping the quiz engine a pure, DB-free state machine, the branching logic is trivially unit-testable and the UI is a thin rendering layer. The 'unsure' escape hatch and non-blocking submit mean a user is never trapped or blocked — the quiz always resolves to useful content. This is the pattern for any complex interactive flow: logic first, UI second.",
            },
        },
    ],

    decisions: [
        {
            decision: "Single Cloudflare Worker over a framework app",
            alternatives: "Next.js, Astro SSR, separate microservices",
            reasoning:
                "Content Ship is a single Worker with a hand-rolled router, server-rendered views, and ~1 runtime dependency (jose). Dependency-light, fast, and cheap to run on Cloudflare's edge.",
        },
        {
            decision: "SHA-256 approval locking over a boolean flag",
            alternatives: "Approved boolean, status enum, manual sign-off",
            reasoning:
                "A hash of the exact artifact set detects drift at ship time (409) instead of trusting a stale flag. Edits invalidate the approval centrally, preventing stale-package shipping.",
        },
        {
            decision: "Cloudflare Access JWT verification over shared-secret auth",
            alternatives: "Shared secret header, session cookie, OAuth",
            reasoning:
                "The Worker verifies the Cf-Access-Jwt-Assertion signature against the Access JWKS via jose, checking issuer + audience and failing closed if vars are unset. Never trusts the spoofable email header.",
        },
        {
            decision: "Content-Signal protocol over standard robots.txt",
            alternatives: "Standard robots.txt, no AI strategy, block all AI crawlers",
            reasoning:
                "search=yes, ai-input=yes, ai-train=no allows AI citation/RAG while refusing training use — a forward-looking GEO play that most sites haven't started.",
        },
        {
            decision: "D1 as source of truth with GHL as best-effort sink",
            alternatives: "GHL as source, external DB, no persistence",
            reasoning:
                "Contact/quiz/apply flows write to D1 first (500 on failure), then GHL (failures swallowed). No silent lead loss, user flow never blocked, idempotent writes.",
        },
        {
            decision: "Zernio feature gate over always-on integration",
            alternatives: "Always-on Zernio, manual scheduling, no scheduling",
            reasoning:
                "Zernio is fully built but hidden behind a single var until the paid account + key are wired. The code ships without the dependency.",
        },
        {
            decision: "Brand firewall between Movement and shop",
            alternatives: "Cross-link content, shared brand, no separation",
            reasoning:
                "The Movement site is strictly separated from the commerce site — no product mentions, no cross-linking. Enforced in repo instructions plus cross-account asset identity verification after a real incident.",
        },
    ],

    learnings: [
        {
            title: "Hash the Artifact, Not the Intent",
            body: "The approval system's power comes from hashing the exact copy, slides, and ZIP — not a status field. Any drift is caught at ship time. When correctness matters, bind state to the actual data, not to a flag that can go stale.",
        },
        {
            title: "Feature-Gate Paid Integrations",
            body: "Zernio is fully built but hidden behind a single var until the paid account is provisioned. This lets the code ship without the dependency and avoids a broken integration in production. Gate first, enable when ready.",
        },
        {
            title: "Pure Logic Is Testable Logic",
            body: "The quiz engine and the approval hashing are pure functions with no I/O. That makes the hardest logic trivially unit-testable and lets the orchestration around it be refactored freely. The financial and correctness cores should always be pure.",
        },
        {
            title: "Idempotency for External Integrations",
            body: "Every external call (Zernio, Linear, Drive) has an abort timeout, an idempotency key, and a failure path that bounces state back rather than leaving it stuck. External systems fail; the design must make failure recoverable, not fatal.",
        },
        {
            title: "Design for the AI Crawler",
            body: "The Content-Signal protocol and rich Person/BlogPosting/speakable schema are a deliberate bet on AI-search citation. Most sites optimize only for Google; structuring content for AI assistants is a compounding early-mover advantage.",
        },
    ],

    metrics: {
        hero: [
            { value: 3, label: "Content Repos" },
            { value: 250, label: "Scripts in D1" },
            { value: 56, label: "Articles" },
            { value: 7, label: "Archetypes" },
        ],
        supporting: [
            { value: 40, label: "Worker Routes", suffix: "+" },
            { value: 30, label: "Migrations", suffix: "+" },
            { value: 35, label: "GHL Email Templates" },
            { value: 500, label: "Test Lines", suffix: "+" },
        ],
    },

    gallery: [
        {
            src: "/projects/mcrdse-content/movement-home.png",
            alt: "Microdose Movement educational site homepage",
            caption: "Movement — Pure-static Astro site with six content pillars",
        },
        {
            src: "/projects/mcrdse-content/content-ship.png",
            alt: "Content Ship briefing dashboard",
            caption: "Content Ship — Briefing dashboard with approval-and-shipping workspace",
        },
        {
            src: "/projects/mcrdse-content/quiz.png",
            alt: "Microdose Movement archetype quiz",
            caption: "Quiz — Branching archetype quiz with weighted scoring",
        },
    ],

    cta: {
        text: "Interested in what I could build for your business? I'm currently taking on full-stack web development and content-operations projects. Read the full technical deep-dive on how I built this system.",
        buttons: [
            { text: "Get in Touch", href: "/#contact", variant: "default" },
            { text: "View More Projects", href: "/projects", variant: "outline" },
        ],
    },
};
