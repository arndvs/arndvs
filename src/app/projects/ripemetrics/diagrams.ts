export type DiagramKey = keyof typeof diagrams;

export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Client["Browser / Client"]
        SPA["React 18 SPA\\n880 Components · 85 Routes"]
        MUI["Material UI v5 + Tailwind"]
        HC["Highcharts\\n40+ Custom Charts"]
        PREACT["Preact Islands\\n3KB Shadow DOM Widgets"]
    end

    subgraph Backend["Laravel 11 Backend"]
        API["REST API\\n160+ Endpoints"]
        HORIZON["Redis + Horizon\\nQueue Management"]
        WS["Pusher\\nReal-Time WebSocket"]
        CRON["Background Workers\\nOnboarding Pipeline"]
    end

    subgraph AI["AI & Vector Search"]
        OAI["OpenAI GPT-4o\\n+ Anthropic Claude 3"]
        PINE["Pinecone\\nNamespace Multi-Tenancy"]
        RAG["RAG Pipeline\\nAutoRespondService"]
        EMB["Ada-002 Embeddings\\nRecursive Text Splitting"]
    end

    subgraph Comms["Communication"]
        TWILIO["Twilio\\nIVR · Voice · SMS"]
        ELEVEN["ElevenLabs\\nTTS Voice Synthesis"]
        SG["SendGrid\\n10K+ Daily Emails"]
        PUSHER["PusherJS\\nStreaming Responses"]
    end

    subgraph Infra["Infrastructure"]
        DO["DigitalOcean\\nApp Servers"]
        FORGE["Laravel Forge\\nCI/CD"]
        VERCEL["Vercel\\nMarketing Site"]
        BB["Bitbucket\\nGit Pipelines"]
    end

    subgraph Data["Data Layer"]
        MYSQL["MySQL\\nTransactional Data"]
        MONGO["MongoDB\\nAnalytics"]
        REDUX["Redux Toolkit\\n41 Slices · 53 RTK Query Services"]
    end

    Client --> Backend
    SPA --> API
    SPA --> WS
    PREACT --> API
    API --> AI
    RAG --> OAI
    RAG --> PINE
    OAI --> EMB
    EMB --> PINE
    API --> Comms
    RAG --> ELEVEN
    ELEVEN --> TWILIO
    Backend --> Data
    REDUX --> API`,

    chatbotArchitecture: `sequenceDiagram
    participant U as End User
    participant W as Chat Widget
    participant API as Laravel API
    participant LLM as LLMClient<br/>(OpenAI ↔ Anthropic)
    participant VDB as Pinecone<br/>(Namespaced)
    participant DB as MySQL
    participant PS as Pusher WebSocket
    participant TTS as ElevenLabs TTS
    participant TEL as Twilio IVR

    U->>W: Types message
    W->>API: POST /chat (tenant_id, message)
    API->>DB: Load tenant config & conversation history
    API->>VDB: Query embeddings (top-k=5, namespace)
    VDB-->>API: Relevant document chunks
    API->>LLM: Function calling<br/>(searchProducts, searchDocs, escalate)
    LLM-->>API: Streaming response tokens
    API-->>PS: Broadcast to chat widget
    PS-->>W: Real-time response stream
    API->>DB: Persist message + response

    Note over API,TTS: Voice Channel Path
    API->>TTS: Convert response to speech
    TTS-->>API: Audio (eleven_flash_v2)
    API->>TEL: Play audio via IVR`,

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
    subgraph Input["Frontend Wizard"]
        URL["Client Website URL"]
        WIZARD["React Onboarding Flow\\nMulti-Phase Steps"]
        PUSHER["Pusher WebSocket\\nReal-Time Progress"]
    end

    subgraph AI["Backend AI Agent"]
        SCRAPER["WebScraperDataSummarizerAgent\\nWebsite + Google Places"]
        GPT["GPT-4o Extraction\\nStructured Business Data"]
        AUTO["Auto-Populate\\nHours · Contact · Social · Summaries"]
    end

    subgraph RAG["RAG Ingestion"]
        SPLIT["Recursive Text Splitter\\nConfigurable Chunks"]
        EMB["Ada-002 Embeddings"]
        LOADERS["6 Document Loaders\\nProducts · Store · DOCX · PDF"]
        UPSERT["Pinecone Upsert\\nBatches of 20 · Namespace Isolation"]
    end

    subgraph Result["Ready in < 60 Seconds"]
        VDB["Vector DB\\nSearchable Knowledge Base"]
        BOT["AI Chatbot Ready\\n4-Channel Service"]
        SETTINGS["Settings Sync\\nBi-Directional Pinecone"]
    end

    URL --> SCRAPER --> GPT --> AUTO
    WIZARD --> PUSHER
    AUTO --> SPLIT --> EMB --> LOADERS --> UPSERT --> VDB --> BOT
    AUTO --> SETTINGS`,
} as const;
