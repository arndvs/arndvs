export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Client["Browser / Client"]
        APP["Next.js 16 App Router\\n158 Pages · 256 Components"]
        FM["Framer Motion"]
        SHADER["Paper Design WebGL Shaders"]
    end

    subgraph Edge["Vercel Edge"]
        MW["Edge Middleware\\nGeolocation · Headers"]
        SI["Speed Insights"]
        SENTRY_EDGE["Sentry Edge Config"]
    end

    subgraph Server["Next.js Server"]
        RSC["React Server Components"]
        SA["Server Actions"]
        API["53 API Routes"]
        ISR["ISR / On-Demand Revalidation"]
    end

    subgraph CMS["Content Management"]
        SANITY["Sanity v5 CMS"]
        GROQ["GROQ Queries"]
        TYPEGEN["TypeGen\\n2,006 Files"]
        PREVIEW["Live Preview\\nVisual Editing"]
    end

    subgraph AI["AI Services"]
        OAI["OpenAI GPT-4o"]
        ZOD["Zod Structured Output"]
        ENHANCE["Content Enhancement"]
        OCR["Insurance Card OCR"]
    end

    subgraph Integrations["External Services"]
        GHL["GoHighLevel CRM"]
        STRIPE["Stripe Payments"]
        RESEND["Resend Email\\n27 Templates"]
        SLACK["Slack Notifications"]
        IPHUB["IPHub Geo-Blocking"]
        POSTHOG["PostHog Analytics"]
        INDEXNOW["Bing IndexNow"]
    end

    subgraph SEO["SEO & Structured Data"]
        JSONLD["81 JSON-LD Schema Files"]
        SITEMAP["Dynamic Sitemap"]
        AREAS["Programmatic Area Pages"]
        AEO["/llms.txt · /llms-full.txt"]
    end

    subgraph Quality["Quality & Security"]
        TESTS["55 Test Files"]
        AUDITS["6 Custom Audit Scripts"]
        HONEYPOT["Honeypot Validation"]
        RATELIMIT["Rate Limiting"]
    end

    Client --> Edge --> Server
    Server --> CMS
    Server --> AI
    Server --> Integrations
    Server --> SEO
    RSC --> SANITY
    API --> OAI
    API --> GHL
    API --> RESEND
    API --> SLACK
    API --> STRIPE
    API --> IPHUB
    SANITY --> GROQ
    SANITY --> TYPEGEN
    JSONLD --> RSC`,

    insuranceVerification: `sequenceDiagram
    participant P as Patient Browser
    participant HP as Honeypot Validator
    participant RL as Rate Limiter
    participant API as API Route<br/>(60s maxDuration)
    participant IP as IPHub API
    participant AI as OpenAI GPT-4o<br/>Vision
    participant CRM as GoHighLevel CRM
    participant EMAIL as Resend Email
    participant SLACK as Slack

    Note over P: Step 1: Patient Info
    P->>P: Name, DOB, Phone, Email

    Note over P: Step 2: Insurance Details
    P->>P: Provider, Member ID, Group #

    Note over P: Step 3: Document Upload
    P->>P: Insurance card photo(s)

    Note over P: Step 4: Submit
    P->>HP: Submit form data + files

    HP->>HP: Validate honeypot fields<br/>(multi-field + timing + checkbox)

    alt Honeypot Failed
        HP-->>P: Silent rejection
        HP->>EMAIL: Send spam alert email
        HP->>SLACK: Post spam notification
    end

    HP->>RL: Check rate limit

    alt Rate Limited
        RL-->>P: 429 Too Many Requests
    end

    RL->>API: Forward validated request
    API->>IP: Check IP reputation

    alt Blocked IP/Region
        IP-->>API: High risk score
        API-->>P: Blocked
        API->>EMAIL: Send blocked alert
        API->>SLACK: Post blocked notification
    end

    API->>AI: Analyze insurance card image
    AI-->>API: Structured verification data<br/>(Zod-validated)

    par Parallel Operations
        API->>CRM: Create/update contact<br/>(deduplicate by email)
        API->>EMAIL: Patient confirmation email
        API->>EMAIL: Staff notification email
        API->>EMAIL: BizOps summary email
        API->>SLACK: Post verification details
    end

    API-->>P: Verification submitted`,

    jsonldComposer: `graph LR
    subgraph L1["Layer 1: Core"]
        direction TB
        TYPES["types.ts\\nBase interfaces"]
        CONFIG["config.ts\\nBusiness constants"]
        UTILS["utils.ts\\nShared helpers"]
    end

    subgraph L2["Layer 2: Elements"]
        direction TB
        ADDR["address.ts"]
        HOURS["openingHours.ts"]
        GEO["geo.ts"]
        CONTACT["contactPoint.ts"]
        RATING["aggregateRating.ts"]
        IMG["image.ts"]
    end

    subgraph L3["Layer 3: Schemas"]
        direction TB
        ORG["Organization"]
        DOC["Physician"]
        BIZ["LocalBusiness"]
        MED["MedicalOrganization"]
        WEB["WebPage"]
        FAQ["FAQPage"]
        BLOG["BlogPosting"]
        EVENT["Event"]
        PROD["Product"]
        REV["Review"]
        BREADCRUMB["BreadcrumbList"]
        COLL["CollectionPage"]
        HOWTO["HowTo"]
        SVC["Service"]
    end

    subgraph L4["Layer 4: Builders"]
        direction TB
        B_SVC["serviceBuilder"]
        B_COND["conditionBuilder"]
        B_AREA["areaBuilder"]
        B_TEAM["teamBuilder"]
        B_POST["postBuilder"]
        B_EVENT["eventBuilder"]
    end

    subgraph L5["Layer 5: Composers"]
        direction TB
        GRAPH["graphComposer.ts\\nMulti-entity @graph"]
        PAGE["pageComposer.ts\\nPer-page assembly"]
    end

    subgraph Output["Rendered Output"]
        JSON["&lt;script type=application/ld+json&gt;\\n@graph with multiple entities"]
    end

    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> Output`,

    programmaticSeo: `graph TB
    subgraph Hub["/areas — Hub Page"]
        AREAS["Areas Served\\nSan Diego Neighborhoods"]
    end

    subgraph Spokes["Neighborhood Pages"]
        MV["/areas/mission-valley"]
        NH["/areas/north-park"]
        HH["/areas/hillcrest"]
        KM["/areas/kensington"]
        PB["/areas/pacific-beach"]
        LJ["/areas/la-jolla"]
        OT["/areas/old-town"]
        DOTS["... 10+ more neighborhoods"]
    end

    subgraph Keywords["Service Keyword Sub-Pages"]
        K1["/areas/mission-valley/chiropractor"]
        K2["/areas/mission-valley/prenatal-chiropractor"]
        K3["/areas/mission-valley/pediatric-chiropractor"]
        K4["/areas/mission-valley/massage-therapy"]
        K5["/areas/north-park/chiropractor"]
        K6["/areas/hillcrest/prenatal-chiropractor"]
        KDOTS["... 50+ keyword pages"]
    end

    subgraph PageSections["Each Area Page Contains"]
        direction TB
        HERO["Hero + Local Imagery"]
        MAP["Embedded Google Map"]
        SERVICES["Service Keyword Links"]
        GUIDE["Tabbed Local Guide\\nParks · Health · Food · Landmarks"]
        REVIEWS["Filtered Patient Reviews"]
        CTA["Area-Specific CTAs"]
        JSONLD2["JSON-LD: LocalBusiness +\\nBreadcrumbList + WebPage"]
    end

    AREAS --> MV
    AREAS --> NH
    AREAS --> HH
    AREAS --> KM
    AREAS --> PB
    AREAS --> LJ
    AREAS --> OT
    AREAS --> DOTS

    MV --> K1
    MV --> K2
    MV --> K3
    MV --> K4
    NH --> K5
    HH --> K6
    NH --> KDOTS

    MV -.-> PageSections`,

    spamPrevention: `flowchart TD
    REQ["Incoming Form Submission"] --> HP{"Honeypot\\nValidation"}

    HP -->|"Hidden field filled"| SPAM_SILENT["Silent Rejection\\n+ Spam Alert Email"]
    HP -->|"Submitted too fast\\n(< timing threshold)"| SPAM_SILENT
    HP -->|"Checkbox trap triggered"| SPAM_SILENT

    HP -->|"Passed"| RL{"Rate Limiter\\n(In-Memory Store)"}

    RL -->|"Exceeded limit\\nper IP/window"| RATE_BLOCK["429 Too Many Requests"]

    RL -->|"Under limit"| GEO{"IPHub API\\nGeo-Blocking"}

    GEO -->|"High-risk IP\\n(proxy/VPN/datacenter)"| GEO_BLOCK["Blocked\\n+ Alert Email\\n+ Slack Notification"]
    GEO -->|"Blocked country/region"| GEO_BLOCK

    GEO -->|"Legitimate"| VALIDATE{"Zod Schema\\nValidation"}

    VALIDATE -->|"Invalid data"| ERROR["400 Bad Request"]

    VALIDATE -->|"Valid"| PROCESS["Process Form\\nCRM + Email + Slack"]`,
} as const;

export type DiagramKey = keyof typeof diagrams;
