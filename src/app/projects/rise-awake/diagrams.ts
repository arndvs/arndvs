export const diagrams = {
    systemArchitecture: `flowchart TB
        subgraph Frontend["Next.js 16 Frontend — 41 Routes"]
            PAGES["Public Pages<br/>Home, About, Products, Enterprise"]
            LEGAL["Legal System<br/>6 documents, 3 categories"]
            IR["Investor Relations<br/>Dynamic financials via temporal.ts"]
            INT["Internal Documents<br/>22 docs — accidentally public"]
            EASTER["Easter Eggs<br/>Konami code, PM-1, push listener"]
            CONFIG["Activation Configurator<br/>12-stage guided flow"]
        end
        subgraph CMS["Sanity v5 CMS"]
            BLOG["Blog Posts"]
            AUTHORS["Authors"]
            TYPEGEN["TypeGen Pipeline"]
        end
        subgraph Backend["Convex Backend"]
            MEDIA["Media Management"]
            APPS["Application Forms"]
            RT["Real-Time Subscriptions"]
        end
        subgraph Auth["Clerk Authentication"]
            SIGN["Sign In/Up"]
            RENDER["RISE Render Studio"]
            SESS["Session Handling"]
        end
        subgraph DataEngine["temporal.ts"]
            CANON["Canon FY Data"]
            PROJ["Growth Projections"]
            ADMIN["Admin Dates"]
        end
        PAGES --> CMS
        IR --> DataEngine
        CONFIG --> Backend
        APPS --> Backend
        Auth --> RENDER
        TYPEGEN --> Frontend
        style Frontend fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style CMS fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Backend fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Auth fill:#1a1a2e,stroke:#f0a050,color:#fff
        style DataEngine fill:#1a1a2e,stroke:#f43f5e,color:#fff`,

    temporalEngine: `flowchart LR
        subgraph Input["Three Layers"]
            LORE["LORE<br/>Fixed historical dates"]
            STATS["STATS<br/>Canon FY2020–2024 + projections"]
            ADMIN_D["ADMIN<br/>Dates relative to now"]
        end
        subgraph Engine["temporal.ts Engine"]
            CANON_E["Canon FY Data"]
            GROWTH["Decaying Growth Model"]
            DATES["Deterministic Date Seeds"]
        end
        subgraph Output["Dynamic Financials"]
            REV["Revenue Charts"]
            UNITS["Unit Shipments"]
            NPS["NPS Trends"]
            ADMIN_OUT["Fresh Admin Dates"]
        end
        STATS --> CANON_E
        STATS --> GROWTH
        ADMIN_D --> DATES
        CANON_E --> REV & UNITS & NPS
        GROWTH --> REV & UNITS & NPS
        DATES --> ADMIN_OUT
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
            CORAL["Coral — CTAs, accents"]
            SLATE["Slate — Backgrounds"]
            SEMANTIC["Adaptive semantic tokens"]
        end
        subgraph Components["Component Library"]
            SHADCN["shadcn/ui — 22 base components"]
            CUSTOM["Custom overlays + animations"]
            CHARTS["Recharts — financial visualizations"]
            SVG["Custom SVGs — bed illustrations"]
        end
        subgraph Tone["Design Tone"]
            CORP["Corporate enough to be real"]
            SATIRE["Absurd enough to be funny"]
            NEVER["Never breaks character"]
        end
        Typography --> Tone
        Color --> Tone
        Components --> Tone
        SEMANTIC --> CORP
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
            SLEEP["Sleep & Environmental Data Policy"]
            AUTONAV["Autonomous Navigation Disclosure"]
            DISC["General Disclaimer"]
        end
        subgraph Features["Legal System Features"]
            LAYOUT["Shared Legal Layout"]
            CAT["3 Legal Categories"]
            SIDEBAR["Sidebar Navigation"]
            TSX["Hardcoded TSX Pages"]
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
        subgraph Public["Public Routes — 33"]
            HOME["/"]
            ABOUT["/about"]
            PROD["/products/*"]
            ENT["/enterprise"]
            SDK["/sdk"]
            BLOG_R["/blog"]
            CAREER["/careers"]
            STATUS["/status"]
            MOVE["/move"]
        end
        subgraph Protected["Semi-Protected Routes"]
            INTERNAL["/internal/*<br/>22 documents"]
            APPLY["/careers/apply"]
            STUDIO["/studio/render<br/>RISE Render (Clerk auth)"]
        end
        subgraph Legal["Legal Routes"]
            LEGAL_R["/legal/*<br/>6 documents"]
        end
        subgraph IR["Investor Relations"]
            IR_R["/investors"]
            FIN["/investors/financials"]
            ANN["/investors/annual-report"]
        end
        subgraph Config["Interactive Routes"]
            ACTIVATE["/activate<br/>12-stage activation flow"]
            REMOTE["/remote<br/>PM-1 remote simulator"]
        end
        HOME --> PROD & ABOUT & ENT
        HOME --> BLOG_R & CAREER & STATUS
        CAREER --> APPLY
        HOME --> LEGAL_R
        HOME --> IR_R --> FIN & ANN
        HOME --> INTERNAL
        HOME --> ACTIVATE & REMOTE
        HOME --> MOVE
        PROD --> SDK
        style Public fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Protected fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Legal fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style IR fill:#1a1a2e,stroke:#f0a050,color:#fff
        style Config fill:#1a1a2e,stroke:#f43f5e,color:#fff`,

    contentArchitecture: `flowchart TB
        subgraph Sanity["Sanity v5 — Blog Content"]
            BLOG_S["Blog Posts"]
            AUTHORS_S["Authors"]
            CAT_S["Categories"]
        end
        subgraph Convex["Convex — Application Layer"]
            MEDIA_S["Media Assets"]
            APPS_S["Job Applications"]
            COMMENTS_S["Media Comments"]
            PROJECTS_S["Render Projects"]
        end
        subgraph Static["Static Content — TypeScript"]
            TEMPORAL["temporal.ts<br/>Dynamic financials"]
            PRODUCTS["Product Specs"]
            LEGAL_C["Legal Documents (TSX)"]
            INTERNAL_C["Internal Documents (TS)"]
            CONFIG_S["Configurator Steps"]
        end
        subgraph Frontend_S["Next.js 16 + React 19"]
            SSR["Server Components"]
            CLIENT["Client Components"]
        end
        Sanity --> SSR
        Convex --> CLIENT
        Static --> SSR
        SSR & CLIENT --> Frontend_S
        style Sanity fill:#1a1a2e,stroke:#14b8a6,color:#fff
        style Convex fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Static fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Frontend_S fill:#1a1a2e,stroke:#f0a050,color:#fff`,
} as const;

export type DiagramKey = keyof typeof diagrams;
