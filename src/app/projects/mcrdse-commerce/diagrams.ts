export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Client["Browser / Client"]
        SITE["mcrdse.com\\nAstro 6 SSR Storefront"]
        SHOP["mcrdse.shop\\nSuper Market HTML Storefront"]
    end

    subgraph Edge["Cloudflare Edge"]
        PAGES["Cloudflare Pages / Workers"]
        D1["Cloudflare D1\\nOrders · Ledger · Subscriptions"]
        R2["Cloudflare R2\\nPayment Proofs"]
        CRON["Followup Cron Worker"]
    end

    subgraph Payments["Payments"]
        AUTHNET["Authorize.net\\nAccept Hosted + ARB"]
        STRIPE["Stripe\\nFallback Processor"]
        ALT["Cash App / Venmo / Zelle\\nAlt-Payment + Proof Upload"]
    end

    subgraph Ops["Operations"]
        OPS["Ops Dashboard\\noperations.mcrdse.com"]
        GHL["GoHighLevel CRM"]
        SS["ShipStation Fulfillment"]
    end

    SITE --> PAGES
    SHOP --> PAGES
    PAGES --> D1
    PAGES --> R2
    PAGES --> AUTHNET
    PAGES --> STRIPE
    PAGES --> ALT
    PAGES --> OPS
    OPS --> GHL
    OPS --> SS
    CRON --> D1`,
    loyaltyEarn: `sequenceDiagram
    participant W as Webhook / Ingest
    participant E as Earn Ceremony
    participant L as Points Ledger (D1)
    participant G as GHL CRM

    W->>E: order captured (orderRef)
    E->>E: ensureAccount (UPSERT + welcome bonus)
    E->>E: computeEarnTxn (pure, DB-free)
    E->>L: recordLedger (INSERT OR IGNORE, idempotent)
    alt fresh award
        E->>L: advance lifetime_spend
        E->>L: tier log (if boundary crossed)
        E->>G: maybePayReferral
    end
    E-->>W: earn:added | earn:exists`,
    orderIngestion: `graph LR
    subgraph Sources["Order Sources"]
        CARD["Card Checkout\\nAuthorize.net / Stripe"]
        ALT2["Alt-Payment\\nProof Upload"]
        LEGACY["Legacy Stripe / Woo"]
    end

    subgraph Ingest["Ingest Ceremony"]
        AUTH["X-Ingest-Secret Auth"]
        IDEM["Idempotency Key\\nINSERT OR IGNORE"]
        VERIFY["payment_verified Gate"]
        DISPATCH["runDispatch (waitUntil)"]
    end

    subgraph Sinks["Reconciliation Targets"]
        D1S["D1 orders (source of truth)"]
        GHLS["GoHighLevel"]
        SSS["ShipStation"]
        LOY["Loyalty Earn"]
    end

    CARD --> AUTH
    ALT2 --> AUTH
    LEGACY --> AUTH
    AUTH --> IDEM
    IDEM --> VERIFY
    VERIFY --> DISPATCH
    DISPATCH --> D1S
    DISPATCH --> GHLS
    DISPATCH --> SSS
    DISPATCH --> LOY`,
};

export type DiagramKey = keyof typeof diagrams;
