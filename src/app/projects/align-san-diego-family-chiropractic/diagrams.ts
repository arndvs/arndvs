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
        API["34 API Routes"]
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
        JSONLD["76 JSON-LD Schema Files"]
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
    JSONLD --> RSC
    ISR --> INDEXNOW`,

    insuranceVerificationBefore: `flowchart TD
    A["Patient calls front desk\\nOften no answer — office closed"]
    A -->|"Wait up to 4 days for callback"| B["Front desk calls back\\nSends email requesting documents"]
    B -->|"Wait 1–3 days for patient reply"| C["Front desk receives docs\\nForwards to biller manually"]
    C -->|"Biller processes — 1–2 days"| D["Biller replies to front desk\\nFront desk emails patient result"]
    D --> E["Total: up to 7 days\\n4 handoffs · patient left waiting"]

    style E fill:#F5C4B3,stroke:#993C1D,color:#4A1B0C`,

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

    emailSystem: `graph TB
    subgraph Triggers["Trigger Events"]
        T1["Insurance Verification"]
        T2["Contact Form"]
        T3["Newsletter Signup"]
        T4["Career Application"]
        T5["Event Approval"]
        T6["Lead Magnet Download"]
        T7["Patient Reactivation"]
        T8["Form Failure"]
    end

    subgraph Templates["27 React Email Templates"]
        direction TB
        subgraph Insurance["Insurance Verification (5)"]
            IV1["patient-confirmation"]
            IV2["staff-notification"]
            IV3["bizops-summary"]
            IV4["spam-alert"]
            IV5["blocked-alert"]
        end
        subgraph Contact["Contact & Forms (4)"]
            C1["contact-confirmation"]
            C2["contact-staff"]
            C3["career-application"]
            C4["career-staff"]
        end
        subgraph Marketing["Marketing (6)"]
            M1["newsletter-welcome"]
            M2["lead-magnet-delivery"]
            M3["first-visit-followup"]
            M4["patient-reactivation"]
            M5["special-offer"]
            M6["event-registration"]
        end
        subgraph Internal["Internal Alerts (5)"]
            I1["form-failure-alert"]
            I2["spam-notification"]
            I3["blocked-submission"]
            I4["event-approval-request"]
            I5["review-notification"]
        end
        subgraph Shared["30+ Shared Components"]
            S1["Header \\u00b7 Footer \\u00b7 Button"]
            S2["Logo \\u00b7 Divider \\u00b7 Badge"]
            S3["InfoRow \\u00b7 Section \\u00b7 CTA"]
        end
    end

    subgraph Delivery["Delivery"]
        RESEND["Resend API"]
        RETRY["Auto Retry"]
    end

    T1 --> Insurance
    T2 --> Contact
    T3 --> Marketing
    T4 --> Contact
    T5 --> Internal
    T6 --> Marketing
    T7 --> Marketing
    T8 --> Internal

    Templates --> Delivery`,

    aiEnhancement: `sequenceDiagram
    participant Editor as Sanity Studio Editor
    participant Action as Custom Document Action
    participant API as /api/enhance-post
    participant ZOD as Zod Schema<br/>Validator
    participant OAI as OpenAI GPT-4o<br/>(Structured Output)
    participant SANITY as Sanity<br/>Document

    Editor->>Action: Click "Enhance" button
    Action->>API: POST { documentId, content }

    API->>OAI: Send content + system prompt<br/>response_format: json_schema

    Note over OAI: Generates structured output:<br/>- SEO title and description<br/>- Summary and excerpt<br/>- Related topics<br/>- Reading time<br/>- Category suggestions<br/>- FAQ pairs

    OAI-->>API: JSON response

    API->>ZOD: Validate against schema

    alt Validation Failed
        ZOD-->>API: Parse error
        API-->>Action: Error response
        Action-->>Editor: Show error toast
    end

    ZOD-->>API: Typed data

    API->>SANITY: Patch document with<br/>enhanced metadata

    SANITY-->>API: Updated document
    API-->>Action: Success response
    Action-->>Editor: Show success toast<br/>+ refreshed preview

    Note over Editor,SANITY: Same flow for /api/enhance-event<br/>with event-specific Zod schema`,

    requestLifecycle: `graph TB
    subgraph Request["Incoming Request"]
        BROWSER["Browser Request"]
    end

    subgraph Vercel["Vercel Platform"]
        EDGE["Edge Middleware\\nGeolocation headers"]
        CDN["CDN / Static Cache"]
    end

    subgraph NextJS["Next.js 16 Runtime"]
        ROUTER["App Router\\nRoute Groups: (frontend)/(main)"]

        subgraph Rendering["Rendering Strategy"]
            SSR["Server Components\\n(default)"]
            CLIENT["'use client' Islands\\nFramer Motion \\u00b7 Forms \\u00b7 Shaders"]
            STREAM["Suspense Boundaries\\nStreaming SSR"]
        end

        subgraph DataLayer["Data Layer"]
            GROQ2["GROQ Queries\\n(cached + revalidated)"]
            ACTIONS["Server Actions\\nForm handlers"]
            ROUTES["API Routes\n34 endpoints"]
        end
    end

    subgraph Sanity["Sanity v5"]
        CDN_SANITY["API CDN"]
        DATASET["Production Dataset"]
        DRAFTS["Draft Documents"]
    end

    subgraph Response["Response Assembly"]
        HTML["HTML + JSON-LD\\nMeta + OG Tags"]
        HYDRATE["Client Hydration\\nInteractive Islands"]
    end

    BROWSER --> EDGE
    EDGE --> CDN
    CDN -->|"MISS"| ROUTER
    CDN -->|"HIT"| Response
    ROUTER --> Rendering
    SSR --> DataLayer
    GROQ2 --> Sanity
    DataLayer --> Response
    Response --> BROWSER`,

    eventApprovalWorkflow: `graph TD
    subgraph Studio["Sanity Studio"]
        DRAFT["Draft Event Created"]
        FIELDS["Required Fields\\nTitle · Date · Location · Image"]
        VALIDATE["Validation Rules\\nMin length · Date future · Image required"]
    end

    subgraph Approval["Approval Pipeline"]
        REVIEW["Editor Reviews Draft"]
        ENHANCE["AI Enhance Button\\nSEO title · Description · Tags"]
        PUBLISH["Publish Action"]
    end

    subgraph PostPublish["Post-Publish Automation"]
        WEBHOOK["Sanity Webhook Fires"]
        REVALIDATE["Next.js Revalidation\\n/events · /events/[slug]"]
        INDEXNOW["IndexNow Submission\\nBing · Yandex"]
        JSONLD["JSON-LD Generated\\nEvent schema + BreadcrumbList"]
    end

    DRAFT --> FIELDS
    FIELDS --> VALIDATE
    VALIDATE -->|"Pass"| REVIEW
    REVIEW --> ENHANCE
    ENHANCE --> PUBLISH
    PUBLISH --> WEBHOOK
    WEBHOOK --> REVALIDATE
    WEBHOOK --> INDEXNOW
    REVALIDATE --> JSONLD`,

    progressiveEnhancement: `graph TD
    subgraph ServerFirst["Server-First Rendering"]
        SSR_HTML["Full HTML from Server\\nNo JS required for content"]
        SEMANTIC["Semantic HTML\\nLandmarks · Headings · ARIA"]
        REDUCED["prefers-reduced-motion\\nCSS media query check"]
    end

    subgraph Enhancement["Progressive Enhancement Layers"]
        CSS_ANIM["CSS Animations\\nTransitions · Keyframes"]
        FRAMER["Framer Motion Islands\\n'use client' boundary"]
        WEBGL["WebGL Shader Hero\\nCanvas with fallback"]
        INTERSECTION["Intersection Observer\\nScroll-triggered reveals"]
    end

    subgraph Accessibility["Accessibility Guards"]
        MOTION_PREF["useReducedMotion()\\nDisables all animations"]
        FOCUS["Focus Management\\nKeyboard navigation"]
        CONTRAST["Color Contrast\\nWCAG AA minimum"]
        SCREEN["Screen Reader\\naria-live regions"]
    end

    SSR_HTML --> CSS_ANIM
    CSS_ANIM --> FRAMER
    FRAMER --> WEBGL
    FRAMER --> INTERSECTION
    REDUCED -->|"Reduced"| MOTION_PREF
    MOTION_PREF --> FRAMER
    SEMANTIC --> FOCUS
    SEMANTIC --> CONTRAST
    SEMANTIC --> SCREEN`,

    revalidationCascade: `graph LR
    subgraph Trigger["Content Change"]
        SANITY_PUBLISH["Sanity Document Published"]
        MANUAL["Manual Revalidation\\nAPI endpoint"]
    end

    subgraph Webhook["Webhook Handler"]
        PARSE["Parse Webhook Payload\\nDocument type + ID"]
        AUTH["Verify Webhook Secret"]
        ROUTE["Route by Document Type"]
    end

    subgraph Invalidation["Cache Invalidation"]
        TAG["revalidateTag()\\nGranular tag-based"]
        PATH["revalidatePath()\\nFull page rebuild"]
        RELATED["Related Pages\\nBlog index · Sitemap · RSS"]
    end

    subgraph Notification["Search Engine Notification"]
        INDEXNOW2["IndexNow API\\nBing · Yandex"]
        SITEMAP["Sitemap Regeneration\\nAuto on next request"]
    end

    SANITY_PUBLISH --> PARSE
    MANUAL --> PARSE
    PARSE --> AUTH
    AUTH --> ROUTE
    ROUTE -->|"Blog Post"| TAG
    ROUTE -->|"Service Page"| PATH
    TAG --> RELATED
    PATH --> RELATED
    RELATED --> INDEXNOW2
    RELATED --> SITEMAP`,
} as const;

export type DiagramKey = keyof typeof diagrams;
