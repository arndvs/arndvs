import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "E-Commerce / Edge Computing · In Production",
        title: "MCRDSE — E-Commerce & Loyalty Platform",
        tagline:
            "A 6-repo Cloudflare edge ecosystem for a functional-mushroom supplement brand — two storefronts, a loyalty program built for correctness under concurrency, and order reconciliation across four external systems.",
        stats: [
            { label: "Repos", value: "6" },
            { label: "Commits", value: "1,400+" },
            { label: "Storefronts", value: "2" },
            { label: "Systems Reconciled", value: "4" },
            { label: "API Routes", value: "100+" },
        ],
        cta: { text: "Visit Live Site", href: "https://mcrdse.com" },
        screenshotSrc: "/projects/mcrdse-commerce/mcrdse-home.png",
        screenshotAlt: "MCRDSE storefront homepage",
    },

    situation: {
        narrative: [
            "MCRDSE is a functional-mushroom supplement brand (Focus Dose, Bliss Dose, Pure Dose) that outgrew its WooCommerce/WordPress stack. The old platform couldn't handle the brand's needs: a loyalty program, Subscribe & Save subscriptions, alt-payment methods, and a second storefront on a separate domain. The team wanted a fully self-hosted edge architecture on Cloudflare — no WordPress admin, no monolithic backend.",
            "The constraint: this is a live business. Orders, payments, and fulfillment touch real customers and real money. Every architectural decision had to be safe under webhook retries, concurrent requests, and partial external-system outages. The result is a system where idempotency is a pervasive invariant, the database is the source of truth, and every external push is best-effort and self-healing.",
        ],
        context: {
            role: "Lead Engineer (architecture → production)",
            timeline: "2026 – Present",
            client: "Functional-mushroom supplement brand · DTC e-commerce",
            live: "mcrdse.com · mcrdse.shop",
            stack: [
                "Astro 6",
                "Cloudflare Pages / Workers",
                "Cloudflare D1",
                "Cloudflare R2",
                "Authorize.net",
                "Stripe",
                "ShipStation",
                "GoHighLevel",
                "Resend",
                "React Email",
            ],
        },
    },

    architecture: {
        intro: "The system spans two storefronts (mcrdse.com on Astro, mcrdse.shop on a standalone HTML package) that share a reconciliation spine. Cloudflare D1 is the single source of truth for orders, subscriptions, and the loyalty ledger. Payments run through Authorize.net Accept Hosted with Stripe as a selectable fallback, plus alt-payment methods verified by proof upload. Fulfillment pushes to ShipStation, contacts sync to GoHighLevel, and a standalone cron worker handles follow-up emails. The core principle: every external system is reconciled against D1 — never treated as authoritative.",
        diagramKey: "systemArchitecture",
        secondaryDiagramKey: "orderIngestion",
        secondaryDiagramTitle: "Order Ingestion",
        subsystems: [
            {
                title: "Loyalty Engine",
                description:
                    "Append-only points ledger, atomic redemptions, tier boundaries, referrals",
            },
            {
                title: "Order Ingestion",
                description: "Idempotent ingest ceremony with payment-verified gate",
            },
            {
                title: "Fulfillment",
                description: "ShipStation push with fail-closed ship gate",
            },
            {
                title: "CRM Sync",
                description: "GoHighLevel contact upsert + nurture workflows",
            },
            {
                title: "Payments",
                description:
                    "Authorize.net Accept Hosted + ARB, Stripe fallback, alt-payment proofs",
            },
            {
                title: "Data Layer",
                description: "Cloudflare D1 source of truth, R2 payment proofs, 60+ migrations",
            },
            {
                title: "Security",
                description: "Fail-closed auth, SSRF guards, XSS-safe URLs, secret scanning",
            },
        ],
    },

    deepDives: [
        {
            id: "loyalty-correctness",
            title: "Loyalty Program Built for Correctness",
            subtitle: "A Points System That Can Never Double-Pay or Double-Spend",
            problem:
                "Loyalty points are a financial system, but most implementations store a mutable balance that concurrent writes can clobber. Under webhook retries — where the same order capture can be delivered twice — a naive earn path double-pays points. Under concurrent redemptions, two requests can both pass a balance check and both deduct, letting a customer spend the same points twice. The MCRDSE loyalty program had to be correct under both failure modes, on a SQLite-backed D1 database with no distributed locks.",
            diagramKey: "loyaltyEarn",
            walkthrough: [
                "The balance is never stored. It's always derived from an append-only points_ledger — a SUM of deltas. Every movement is a row, so concurrent writes can't clobber each other and every point is auditable back to its source.",
                "The earn ceremony is a single host for the order-earn side-effect chain: ensureAccount (UPSERT + one-time welcome bonus) → computeEarnTxn (a pure, DB-free function so the financial core is trivially unit-testable) → idempotent recordLedger grant → advance lifetime_spend (only on a fresh award) → tier log (only if a boundary crossed) → maybePayReferral.",
                "Idempotency keys make retries safe: earn:<orderRef>, welcome:<email>, referral:<friend>, redeem:<redemptionId>. A retried webhook returns 'exists' instead of double-paying. The lifetime_spend advance is gated on a fresh award, so a retried webhook can't double-count dollars toward tier boundaries.",
                "Redemption uses an atomic INSERT ... SELECT ... WHERE (SUM(delta)) >= cost. SQLite serializes writers, so two concurrent redeems can't both deduct — the database itself is the guard, not a pre-check.",
                "Tier boundaries (Spore → Mycelium → Fruiting Body) are driven by lifetime spend with additive multipliers, and subscription orders earn 2x points. The economics live in one canonical generated file shared across both repos so the storefront and ops dashboard can't drift.",
            ],
            insight: {
                title: "Derive, Don't Store, the Money",
                body: "The single most important decision was making the balance a derived value from an append-only ledger rather than a stored mutable field. That one choice eliminates the entire class of double-spend and lost-update bugs that plague points systems — and it makes every point auditable. Combined with idempotency keys and an atomic balance-gated deduction, the system is correct under webhook retries and concurrency without needing distributed locks.",
            },
        },
        {
            id: "fail-closed-fulfillment",
            title: "Fail-Closed Fulfillment Gate",
            subtitle: "A Production Incident That Shipped $381 to Non-Payers",
            problem:
                "The original fulfillment logic used a blocklist of 'do not ship' statuses. When Authorize.net delivered a declined or voided capture, the order fell through the blocklist and shipped anyway — real product went to customers who hadn't paid, costing roughly $381 in a single incident. The fix had to make it structurally impossible to ship an unpaid order, not just patch the specific statuses that slipped through.",
            diagramKey: "orderIngestion",
            walkthrough: [
                "The old logic shipped by default and blocked specific statuses. The new logic ships only for an explicit allow-list of SHIPPABLE_STATUSES: authorizedPendingCapture, capturedPendingSettlement, settledSuccessfully. Anything else is not shippable.",
                "The same fail-closed principle extends to alt-payment orders. An alt-payment order (Cash App, Venmo, Zelle) can't be pushed to GoHighLevel or ShipStation until payment_verified = 1 in D1. The database is the gate — enforced per-push in push-ghl, push-shipstation, and easypost.",
                "Proof uploads are strictly validated as base64 JPEG (rejecting any other MIME prefix as malicious) and capped at 6 MB, stored in R2. Auto-verify only fires for a whitelisted subset of methods.",
                "The webhook handler verifies the Authorize.net signature on every delivery, records each delivery to Analytics Engine for observability, and routes through the fail-closed gate before any fulfillment side-effect.",
            ],
            insight: {
                title: "Allow-List Over Block-List for Money",
                body: "A blocklist is a list of everything you've thought of so far. An allow-list is a statement of what's actually safe. For anything that ships physical product or fires customer-facing messages, the allow-list is the only correct default — it fails closed on the unknown instead of shipping on it. The $381 incident was the tuition that taught this lesson, and it's now a structural invariant, not a patch.",
            },
        },
        {
            id: "idempotent-reconciliation",
            title: "Idempotent Multi-System Reconciliation",
            subtitle: "Four External Systems, One Source of Truth",
            problem:
                "A single order touches Authorize.net (payment), GoHighLevel (CRM), ShipStation (fulfillment), and D1 (source of truth). Each external system can fail, retry, or deliver webhooks out of order. Without careful idempotency, the same order creates duplicate GHL contacts, duplicate ShipStation orders, or double-charges. The system had to reconcile four systems against one authoritative database without ever duplicating.",
            diagramKey: "orderIngestion",
            walkthrough: [
                "D1 is the single source of truth. Every external system is reconciled against the orders table — never treated as authoritative. One row per order holds the payment reference, customer/shipping data, a JSON products array, and cross-reference columns for GHL and ShipStation.",
                "The ingest ceremony is the only authoritative way orders enter D1. It's authenticated (X-Ingest-Secret), idempotent (keyed by payment reference or a synthesized dedup key), and migration-tolerant — it tries the full INSERT and falls back through progressively older schemas so ingestion never breaks when migrations lag.",
                "Every outward push is idempotent with adopt-don't-duplicate: GHL looks up the contact by email then phone (phone is the strongest cross-email identity signal), ShipStation looks up by orderNumber and upserts. Renewals use a transId-keyed order number to avoid collisions across customers on the same SKU.",
                "runDispatch dispatches GHL and ShipStation independently, so a ShipStation outage doesn't starve GHL nurture. Every failure lands in an audit_log as auto-dispatch-failed — the only durable trace, since Pages console isn't persisted.",
                "A dual-run fence between EasyPost and ShipStation prevents double postage purchase: whoever writes first owns the order via an atomic claim, and the other refuses.",
            ],
            insight: {
                title: "Adopt, Don't Duplicate",
                body: "The pattern that makes reconciliation safe is 'adopt, don't duplicate' — every external system is looked up by a stable identity and upserted, never blindly inserted. Combined with D1 as the authoritative source and independent dispatch, the system self-heals: a retry adopts the existing record instead of creating a duplicate. This is the difference between a system that survives outages and one that amplifies them.",
            },
        },
    ],

    decisions: [
        {
            decision: "Cloudflare D1 as source of truth over a hosted CRM/DB",
            alternatives: "GoHighLevel as source, hosted Postgres, Stripe as source",
            reasoning:
                "D1 is the single authoritative store for orders, subscriptions, and the loyalty ledger. External systems are reconciled against it, never trusted. This inverts the usual 'CRM is the source' assumption and makes every push idempotent + self-healing.",
        },
        {
            decision: "Authorize.net Accept Hosted over Stripe-only",
            alternatives: "Stripe-only, WooCommerce Payments, PayPal-only",
            reasoning:
                "The brand migrated off Stripe and WooCommerce. Authorize.net Accept Hosted with ARB subscriptions is the primary processor, with Stripe as a selectable fallback via CARD_PROCESSOR and a Cash App/Venmo-only kill switch.",
        },
        {
            decision: "Append-only points ledger over stored balance",
            alternatives: "Stored mutable balance, Redis counter, external loyalty SaaS",
            reasoning:
                "A derived balance from an append-only ledger eliminates double-spend and lost-update bugs under concurrency and webhook retries, and makes every point auditable. The financial core is a pure function, trivially unit-testable.",
        },
        {
            decision: "Allow-list ship gate over block-list",
            alternatives: "Block-list of declined/voided statuses, manual review",
            reasoning:
                "A block-list shipped $381 to non-payers. An allow-list of shippable statuses fails closed on the unknown. For anything that ships physical product, the allow-list is the only correct default.",
        },
        {
            decision: "Dual storefronts on separate domains over one site",
            alternatives: "Single storefront, subdomain, shared cart",
            reasoning:
                "mcrdse.com (Astro) and mcrdse.shop (HTML package) are fully isolated — separate D1, checkout, cart, webhooks, and storefront tags. The two properties never cross-contaminate data or secrets.",
        },
        {
            decision: "Raw fetch for Authorize.net over the Node SDK",
            alternatives: "Authorize.net Node SDK, Stripe SDK, third-party gateway",
            reasoning:
                "The Node SDK needs Node APIs unavailable on Cloudflare Workers. Raw fetch against the JSON transaction API handles the UTF-8 BOM Authorize.net prefixes, with Web Crypto everywhere (no Node crypto).",
        },
        {
            decision: "Standalone cron worker for follow-ups over Pages route",
            alternatives: "Pages scheduled function, external scheduler, in-app timer",
            reasoning:
                "Cloudflare Pages can't host a second Worker or Cron Trigger in its own config. A standalone followup worker with a D1 claim-guarded send log handles day-4/day-10 follow-up emails idempotently.",
        },
    ],

    learnings: [
        {
            title: "Idempotency Is a Pervasive Invariant, Not a Feature",
            body: "Across every repo, the pattern is the same: INSERT OR IGNORE on unique keys, atomic conditional UPDATE claims, x-request-id dedup. Once idempotency is a default rather than an afterthought, webhook retries and concurrent requests stop being bugs and become no-ops. It's the highest-leverage engineering habit in this codebase.",
        },
        {
            title: "The Database Is the Gate, Not the Code",
            body: "Alt-payment orders can't be pushed until payment_verified = 1 in D1 — enforced per-push, not in one place. When a safety invariant is enforced by the data layer rather than scattered checks, it can't be accidentally bypassed by a new code path.",
        },
        {
            title: "Fail Closed on Money",
            body: "The $381 incident taught that block-lists are lists of what you've thought of so far. Allow-lists are statements of what's actually safe. For shipping, payments, and customer-facing messages, default to deny and enumerate what's allowed.",
        },
        {
            title: "Pure Financial Cores Are Worth the Abstraction",
            body: "computeEarnTxn is a pure, DB-free function — the money math is trivially unit-testable in isolation. When the financial core has no I/O, you can lock its correctness with contract tests and refactor the orchestration around it freely.",
        },
        {
            title: "Cross-Repo Convergence Prevents Drift",
            body: "The loyalty earn ceremony and economics were converged into a single shared module + generated economics file across the storefront and ops dashboard. Two copies of money logic will drift; one canonical source can't.",
        },
    ],

    metrics: {
        hero: [
            { value: 6, label: "Repositories" },
            { value: 1400, label: "Commits", suffix: "+" },
            { value: 2, label: "Storefronts" },
            { value: 4, label: "Systems Reconciled" },
        ],
        supporting: [
            { value: 100, label: "API Routes", suffix: "+" },
            { value: 60, label: "D1 Migrations", suffix: "+" },
            { value: 3, label: "Loyalty Tiers" },
            { value: 59, label: "Test Files", suffix: "+" },
        ],
    },

    gallery: [
        {
            src: "/projects/mcrdse-commerce/mcrdse-home.png",
            alt: "MCRDSE storefront homepage",
            caption: "Homepage — Hormozi-style conversion layout for the Focus + Bliss bundle",
        },
        {
            src: "/projects/mcrdse-commerce/mcrdse-shop.png",
            alt: "MCRDSE Super Market storefront",
            caption: "Super Market — Second storefront on mcrdse.shop with member gate",
        },
        {
            src: "/projects/mcrdse-commerce/mcrdse-product.png",
            alt: "MCRDSE product detail page",
            caption: "Product — Detail page with EffectMeter outcome tiles and ritual calendar",
        },
        {
            src: "/projects/mcrdse-commerce/mcrdse-loyalty.png",
            alt: "MCRDSE loyalty program",
            caption: "Loyalty — Points ledger, tier boundaries, and reward ladder",
        },
    ],

    cta: {
        text: "Interested in what I could build for your business? I'm currently taking on full-stack web development and edge-computing projects. Read the full technical deep-dive on how I built this system.",
        buttons: [
            { text: "Get in Touch", href: "/#contact", variant: "default" },
            { text: "View More Projects", href: "/projects", variant: "outline" },
        ],
    },
};
