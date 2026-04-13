export type DiagramKey = keyof typeof diagrams;

export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Client["Browser / Client"]
        SPA["React SPA\\nRTK Query · TypeScript"]
        MUI["Material UI + Tailwind"]
        HC["Highcharts\\n40+ Custom Charts"]
        PREACT["Preact Islands\\nEmbeddable Widgets"]
    end

    subgraph Backend["FastAPI + Next.js"]
        NEXT["Next.js Marketing Site\\nSanity CMS"]
        FAST["FastAPI Server\\nStreaming AI Routes"]
        WS["WebSocket Server\\nPusherJS"]
        CRON["Background Workers\\nOnboarding Pipeline"]
    end

    subgraph AI["AI & Vector Search"]
        OAI["OpenAI GPT Models"]
        PINE["Pinecone\\nProduction Vector DB"]
        CHROMA["Chroma\\nDev Vector DB"]
        EMB["Embedding Pipeline\\nDocument Chunking"]
    end

    subgraph Comms["Communication"]
        TWILIO["Twilio\\nIVR · Voice"]
        ELEVEN["ElevenLabs\\nVoice Synthesis"]
        SG["SendGrid\\n10K+ Daily Emails"]
        PUSHER["PusherJS\\nReal-Time Events"]
    end

    subgraph Infra["Infrastructure"]
        DO["DigitalOcean\\nApp Servers"]
        FORGE["Laravel Forge\\nCI/CD"]
        VERCEL["Vercel\\nMarketing Site"]
        BB["Bitbucket\\nGit Pipelines"]
    end

    subgraph Observability["Observability"]
        SENTRY["Sentry\\nError Tracking"]
        PH["PostHog\\nProduct Analytics"]
    end

    Client --> Backend
    SPA --> FAST
    SPA --> WS
    PREACT --> FAST
    NEXT --> VERCEL
    FAST --> AI
    FAST --> Comms
    FAST --> DO
    OAI --> EMB
    EMB --> PINE
    EMB --> CHROMA
    FAST --> SENTRY
    SPA --> PH`,

    chatbotArchitecture: `sequenceDiagram
    participant U as End User
    participant W as Chat Widget
    participant API as FastAPI Server
    participant OAI as OpenAI API
    participant VDB as Vector DB<br/>(Pinecone/Chroma)
    participant DB as PostgreSQL/MySQL
    participant PS as PusherJS

    U->>W: Types message
    W->>API: POST /chat (tenant_id, message)
    API->>DB: Load tenant config & conversation history
    API->>VDB: Query embeddings (top-k=5)
    VDB-->>API: Relevant document chunks
    API->>OAI: Chat completion<br/>(system prompt + context + history)
    OAI-->>API: Streaming response tokens
    API-->>W: SSE stream chunks
    API->>DB: Persist message + response
    API->>PS: Broadcast to agent dashboard
    PS-->>W: Real-time typing indicator`,

    migrationTimeline: `gantt
    title Laravel Livewire → React/Next.js Migration
    dateFormat YYYY-MM
    axisFormat %b %Y

    section Planning
    Audit existing Livewire components    :done, 2023-01, 2023-02
    Define RTK Query API layer            :done, 2023-02, 2023-03
    Design component library              :done, 2023-02, 2023-03

    section Core Migration
    Auth & routing layer                  :done, 2023-03, 2023-04
    Dashboard shell + layout              :done, 2023-04, 2023-05
    Analytics charts (Highcharts)         :done, 2023-05, 2023-07
    Chat interface + WebSocket            :done, 2023-06, 2023-08

    section AI Features
    Chatbot v1 (OpenAI + MySQL)           :done, 2023-07, 2023-09
    Vector DB integration                 :done, 2023-09, 2023-11
    Streaming responses                   :done, 2023-10, 2023-12

    section Polish
    Preact widget embeds                  :done, 2024-01, 2024-03
    Twilio IVR call center                :done, 2024-02, 2024-05
    Performance optimization              :done, 2024-04, 2024-06`,

    onboardingPipeline: `flowchart LR
    subgraph Input["Client Onboarding"]
        URL["Client Website URL"]
        CONFIG["Extraction Config"]
    end

    subgraph Extraction["Apify SDK Pipeline"]
        CRAWL["Web Crawler\\nSitemap + Link Discovery"]
        PARSE["Content Parser\\nHTML → Structured Text"]
        CHUNK["Document Chunker\\n512-token Segments"]
    end

    subgraph Processing["Embedding & Storage"]
        EMB["OpenAI Embeddings\\ntext-embedding-ada-002"]
        NS["Namespace Creation\\ntenant_id Isolation"]
        UPSERT["Vector Upsert\\nBatch Processing"]
    end

    subgraph Result["Ready in 2 Minutes"]
        VDB["Vector DB\\nSearchable Knowledge Base"]
        BOT["Chatbot Ready\\nContext-Aware Responses"]
    end

    URL --> CRAWL --> PARSE --> CHUNK
    CONFIG --> CRAWL
    CHUNK --> EMB --> NS --> UPSERT --> VDB --> BOT`,
} as const;
