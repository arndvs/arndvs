export const diagrams = {
    systemArchitecture: `flowchart TB
        subgraph Frontend["Next.js 16 Frontend — 41 Routes"]
            PAGES["Public Pages<br/>Home, About, Products, Pricing"]
            LEGAL["Legal System<br/>6 documents, 4 categories"]
            IR["Investor Relations<br/>Dynamic financials via temporal.ts"]
            INT["Internal Documents<br/>22 docs — accidentally public"]
            EASTER["Easter Eggs<br/>Konami code, PM-1, push listener"]
            CONFIG["Activation Configurator<br/>12-stage guided flow"]
        end
        subgraph CMS["Sanity v5 CMS"]
            SCHEMA["Content Schemas"]
            PREVIEW["Live Preview"]
            TYPEGEN["TypeGen Pipeline"]
        end
        subgraph Backend["Convex Backend"]
            MEDIA["Media Management"]
            APPS["Application Forms"]
            RT["Real-Time Subscriptions"]
        end
        subgraph Auth["Clerk Authentication"]
            SIGN["Sign In/Up"]
            ROLES["Role Management"]
            SESS["Session Handling"]
        end
        PAGES --> CMS
        LEGAL --> CMS
        IR --> CMS
        INT --> CMS
        CONFIG --> Backend
        APPS --> Backend
        Auth --> PAGES
        Auth --> INT
        TYPEGEN --> Frontend
        style Frontend fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style CMS fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Backend fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Auth fill:#1a1a2e,stroke:#f0a050,color:#fff`,

    temporalEngine: `flowchart LR
        subgraph Input["Configuration"]
            FY["Fiscal Year Offset"]
            BASE["Base Metrics"]
            SEED["Random Seed"]
        end
        subgraph Engine["temporal.ts Engine"]
            CALC["Quarterly Calculations"]
            GROWTH["Growth Trajectories"]
            VAR["Variance Injection"]
            SNAP["Point-in-Time Snapshots"]
        end
        subgraph Output["Dynamic Financials"]
            REV["Revenue Charts"]
            ARR["ARR Metrics"]
            DEPLOY["Deployment Stats"]
            CUST["Customer Growth"]
        end
        FY --> CALC
        BASE --> CALC
        SEED --> VAR
        CALC --> GROWTH --> VAR --> SNAP
        SNAP --> REV & ARR & DEPLOY & CUST
        style Input fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Engine fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Output fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    internalDocsSystem: `flowchart TD
        subgraph Access["The Arvin Problem"]
            DEV["Junior Dev deploys /internal"]
            AUTH["No auth controls"]
            PUBLIC["22 docs publicly accessible"]
        end
        subgraph Categories["Document Categories"]
            MKT["Marketing<br/>Playbooks, personas, messaging"]
            OPS["Operations<br/>Incident logs, discontinuation"]
            HR["People<br/>Memos, resignation letters"]
            EXEC["Executive<br/>Board reports, strategy"]
        end
        subgraph Narrative["Narrative Function"]
            TONE["Deadpan corporate satire"]
            CROSS["Cross-references to film"]
            DEPTH["Retroactive comedy deepening"]
        end
        DEV --> AUTH --> PUBLIC
        PUBLIC --> MKT & OPS & HR & EXEC
        MKT & OPS & HR & EXEC --> TONE
        MKT & OPS & HR & EXEC --> CROSS
        TONE & CROSS --> DEPTH
        style Access fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Categories fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Narrative fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    designSystem: `flowchart TB
        subgraph Typography["Typography"]
            DMSANS["DM Sans<br/>Body — clean, corporate"]
            DMSERIF["DM Serif Display<br/>Headlines — authoritative"]
        end
        subgraph Color["Color System"]
            TEAL["Teal — Brand primary"]
            ORANGE["Orange — CTAs, warnings"]
            SLATE["Slate — Backgrounds"]
            GRAIN["Film grain overlay — texture layer"]
        end
        subgraph Components["Component Library"]
            SHADCN["shadcn/ui — base components"]
            CUSTOM["Custom overlays + animations"]
            CHARTS["Recharts — financial visualizations"]
            MOTION["Framer Motion — micro-interactions"]
        end
        subgraph Tone["Design Tone"]
            CORP["Corporate enough to be real"]
            SATIRE["Absurd enough to be funny"]
            NEVER["Never breaks character"]
        end
        Typography --> Tone
        Color --> Tone
        Components --> Tone
        GRAIN --> SATIRE
        SHADCN --> CORP
        DMSERIF --> CORP
        TEAL --> CORP
        style Typography fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Color fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Components fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Tone fill:#1a1a2e,stroke:#f0a050,color:#fff`,

    legalDocSystem: `flowchart TD
        subgraph Docs["6 Legal Documents"]
            TOS["Terms of Service"]
            PP["Privacy Policy"]
            EULA["Push Mode EULA"]
            COOKIE["Cookie Policy"]
            DSAR["Data Subject Access Request"]
            DPA["Data Processing Addendum"]
        end
        subgraph Features["Legal System Features"]
            TOC["Auto-generated TOC"]
            CAT["4 Legal Categories"]
            SEARCH["Document Search"]
            NAV["Category Navigation"]
        end
        subgraph Narrative["Narrative Layer"]
            FINE["Fine print that rewards reading"]
            CLAUSES["Clauses that mirror film events"]
            UNDO["'There is no undo' — EULA Section 3"]
        end
        Docs --> Features
        Docs --> Narrative
        EULA -->|"Most satirical"| UNDO
        style Docs fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Features fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Narrative fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    easterEggArchitecture: `flowchart LR
        subgraph Surface["Surface Layer"]
            KONAMI["Konami Code"]
            PM1["PM-1 Remote Reference"]
            PUSH_L["Push Listener"]
            ARVIN["Arvin's TODO comments"]
        end
        subgraph Trigger["Trigger Mechanisms"]
            KEY["Keyboard sequences"]
            HOVER["Hover states"]
            SCROLL["Scroll depth"]
            URL["URL patterns"]
        end
        subgraph Reward["Discovery Rewards"]
            ANIM["Hidden animations"]
            TEXT["Revealed text"]
            CROSS["Cross-references to PUSH"]
            META["Meta-commentary"]
        end
        Surface --> Trigger --> Reward
        KONAMI --> KEY
        PM1 --> HOVER
        PUSH_L --> KEY
        ARVIN --> URL
        style Surface fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Trigger fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Reward fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    routeMap: `flowchart TB
        subgraph Public["Public Routes — 20+"]
            HOME["/"]
            ABOUT["/about"]
            PROD["/products/*"]
            PRICE["/pricing"]
            ENT["/enterprise"]
            DEMO["/demo"]
            SDK["/sdk"]
            BLOG_R["/blog"]
            CAREER["/careers"]
        end
        subgraph Protected["Semi-Protected Routes"]
            INTERNAL["/internal/*<br/>22 documents"]
            APPLY["/careers/apply"]
            DASH["/dashboard"]
        end
        subgraph Legal["Legal Routes"]
            LEGAL_R["/legal/*<br/>6 documents"]
        end
        subgraph IR["Investor Relations"]
            IR_R["/investor-relations"]
            FIN["/financials"]
        end
        subgraph Config["Interactive Routes"]
            CONFIGURATOR["/configurator<br/>12-stage activation flow"]
        end
        HOME --> PROD & ABOUT & PRICE & ENT
        HOME --> BLOG_R & CAREER
        CAREER --> APPLY
        HOME --> LEGAL_R
        HOME --> IR_R --> FIN
        HOME --> INTERNAL
        HOME --> CONFIGURATOR
        PROD --> DEMO & SDK
        style Public fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Protected fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Legal fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style IR fill:#1a1a2e,stroke:#f0a050,color:#fff
        style Config fill:#1a1a2e,stroke:#f43f5e,color:#fff`,

    contentArchitecture: `flowchart TB
        subgraph Sanity["Sanity v5 — Content Layer"]
            PAGES_S["Page Content"]
            BLOG_S["Blog Posts"]
            TEAM_S["Team Members"]
            LEGAL_S["Legal Documents"]
            INT_S["Internal Documents"]
        end
        subgraph Convex["Convex — Application Layer"]
            MEDIA_S["Media Assets"]
            APPS_S["Job Applications"]
            SUBS_S["Real-Time Data"]
        end
        subgraph Static["Static Content"]
            TEMPORAL["temporal.ts<br/>Dynamic financials"]
            PRODUCTS["Product Specs"]
            CONFIG_S["Configurator Steps"]
        end
        subgraph Frontend_S["Next.js 16 + React 19"]
            SSR["Server Components"]
            CLIENT["Client Components"]
            RSC["React Server Components"]
        end
        Sanity --> SSR
        Convex --> CLIENT
        Static --> RSC
        SSR & CLIENT & RSC --> Frontend_S
        style Sanity fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Convex fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Static fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Frontend_S fill:#1a1a2e,stroke:#f0a050,color:#fff`,
} as const;

export type DiagramKey = keyof typeof diagrams;
