import type { DiagramKey } from "./diagrams";

export interface HeaderData {
    backLink: string;
    backText: string;
    badge: { color: string; label: string };
    title: string;
    description: string;
}

export interface OverviewData {
    role: { label: string; value: string };
    timeline: { label: string; value: string };
    technologies: { label: string; items: string[] };
}

export interface Feature {
    id: string;
    title: string;
    description: string;
}

export interface ImpactMetric {
    value: string;
    label: string;
}

export interface TechSection {
    heading: string;
    content: string;
}

export interface Achievement {
    title: string;
    description: string;
}

export interface ConclusionData {
    title: string;
    description: string;
    cta: { secondary: { text: string; href: string } };
}

export interface DeepDive {
    id: string;
    title: string;
    subtitle: string;
    problem: string;
    diagramKey: DiagramKey;
    walkthrough: string[];
    insight: { title: string; body: string };
}

export interface Decision {
    decision: string;
    alternatives: string;
    reasoning: string;
}

export interface Learning {
    title: string;
    body: string;
}

export interface PageData {
    header: HeaderData;
    overview: OverviewData;
    challenge: { title: string; description: string };
    solution: { title: string; description: string; features: Feature[] };
    impact: { title: string; metrics: ImpactMetric[] };
    architectureDiagramKey: DiagramKey;
    deepDives: DeepDive[];
    decisions: Decision[];
    learnings: Learning[];
    technicalImplementation: { title: string; sections: TechSection[] };
    achievements: { title: string; items: Achievement[] };
    conclusion: ConclusionData;
}

export const pageData: PageData = {
    header: {
        backLink: "/projects",
        backText: "Back to projects",
        badge: {
            color: "green",
            label: "AI / SaaS Platform",
        },
        title: "RipeMetrics",
        description:
            "AI-native customer growth platform spanning 8 repositories — 880+ components, a production RAG pipeline, and multi-channel AI across chat, SMS, email, and voice.",
    },
    overview: {
        role: {
            label: "Role",
            value: "Lead Frontend Developer & AI Engineer",
        },
        timeline: {
            label: "Timeline",
            value: "April 2017 – July 2025",
        },
        technologies: {
            label: "Technologies",
            items: [
                "React 18",
                "Next.js 14",
                "TypeScript",
                "Redux Toolkit / RTK Query",
                "Material UI v5",
                "Tailwind CSS",
                "Laravel 11",
                "MySQL / MongoDB",
                "OpenAI / Anthropic",
                "Pinecone",
                "ElevenLabs",
                "Twilio",
                "Pusher",
            ],
        },
    },
    challenge: {
        title: "The Challenge",
        description:
            "RipeMetrics needed to evolve from a server-rendered Laravel Livewire monolith into a modern React SaaS platform — without disrupting active paying clients. The product also needed AI-powered customer service across four channels (chat, SMS, email, voice), an onboarding flow that replaced a 30-minute manual setup with a sub-60-second automated process, and a full CRM with drag-and-drop pipelines, scheduling, and omni-channel messaging.",
    },
    solution: {
        title: "The Solution",
        description:
            "A complete platform rebuild: 880 React components across 85 routes, powered by 41 Redux slices and 53 RTK Query services. The frontend connects to a Laravel 11 backend running a custom RAG pipeline with OpenAI function calling, Pinecone vector search, and dual-LLM failover (OpenAI ↔ Anthropic).",
        features: [
            {
                id: "saas-platform",
                title: "Enterprise SaaS Platform",
                description:
                    "Multi-repo SaaS platform with a 128K+ LOC Next.js core application: CRM (drag-and-drop kanban, 6-channel messaging, polymorphic timeline), Engage (campaign builder, customer segmentation, NPS dashboards), and Intel (40+ Highcharts analytics visualizations with AI-generated business insights).",
            },
            {
                id: "ai-chatbot",
                title: "Multi-Channel AI Customer Service",
                description:
                    "RAG-based chatbot with OpenAI function calling (searchProducts, searchStoreTrainingDocs, escalateToHuman), Pinecone namespace isolation per tenant, conversation summarization at 15 messages, and channel-aware formatting — Markdown for chat, plain text for SMS, HTML for email, voice for IVR.",
            },
            {
                id: "voice-ai",
                title: "Voice AI & IVR System",
                description:
                    "ElevenLabs TTS voice synthesis integrated with Twilio IVR — speech recognition routes callers through an AI-powered decision tree, generates responses via the RAG pipeline, converts to audio with ElevenLabs, and plays back via Twilio. Redis-cached audio for holding messages.",
            },
            {
                id: "ai-onboarding",
                title: "AI-Powered Onboarding",
                description:
                    "Replaced a 30-minute manual client setup with a sub-60-second automated pipeline. The frontend onboarding wizard shows real-time progress via Pusher while backend agents scrape the client's website, extract business data with GPT-4o, and auto-populate the AI knowledge base.",
            },
            {
                id: "cross-platform",
                title: "Cross-Platform Widget Architecture",
                description:
                    "3KB Preact islands with Shadow DOM encapsulation, deployed as Web Components via a WordPress plugin. Pusher-powered real-time streaming for chat responses, injected onto client sites without style conflicts or runtime bloat.",
            },
        ],
    },
    impact: {
        title: "Impact",
        metrics: [
            { value: "8", label: "Repositories across the platform" },
            { value: "880", label: "React components built" },
            { value: "4", label: "AI channels (chat, SMS, email, voice)" },
        ],
    },
    architectureDiagramKey: "systemArchitecture",
    deepDives: [
        {
            id: "frontend-migration",
            title: "Laravel → React Migration",
            subtitle: "Refactoring a Monolith Without Downtime",
            problem:
                "The original platform was built on Laravel Livewire — server-rendered components with limited interactivity. As the product grew, Livewire's round-trip model added 6+ seconds to common dashboard interactions. Real-time features like live chat and streaming AI responses were impossible without a fundamental architecture change.",
            diagramKey: "migrationTimeline",
            walkthrough: [
                "I audited every Livewire component and mapped them to React equivalents, prioritizing the highest-traffic surfaces first: the analytics dashboard (40+ charts), the chat interface, and the CRM pipeline views.",
                "RTK Query replaced Laravel's Eloquent-based API layer with 53 typed services and ~75 cache tags. Each endpoint got typed request/response schemas, optimistic updates, and automatic cache invalidation — cutting perceived latency by ~4 seconds on dashboard loads.",
                "The migration ran in parallel with production — a feature flag routed enterprise clients to the React app while smaller accounts stayed on Livewire. Over 3 months, we migrated 100% of users with zero downtime incidents.",
                "Material UI v5 provided the component foundation, but Tailwind handled all custom styling. A usePageType() hook let settings and onboarding share the same components in different contexts, eliminating 30+ duplicate screens.",
            ],
            insight: {
                title: "Parallel Migration > Big Bang Rewrite",
                body: "Running both frontends simultaneously cost extra infrastructure, but it eliminated the risk of a failed big-bang cutover. Feature flags let us validate the React app with power users first, catch edge cases, and roll back per-client if needed. The 6-second improvement in response times justified the migration cost within the first month.",
            },
        },
        {
            id: "ai-chatbot",
            title: "AI Chatbot & Voice AI Architecture",
            subtitle: "Multi-Tenant RAG with Dual-LLM Failover",
            problem:
                "Each client needed a chatbot that understood their specific business — not a generic GPT wrapper. The system had to isolate each client's knowledge base, support real-time responses across four channels (chat, SMS, email, voice), maintain conversation history, and scale to handle concurrent multi-tenant sessions without cross-contamination of context.",
            diagramKey: "chatbotArchitecture",
            walkthrough: [
                "Each client's website content, FAQs, and documentation gets embedded via OpenAI's text-embedding-ada-002 and stored in a namespaced Pinecone index. Namespaces provide hard tenant isolation — one client's vectors never appear in another's search results.",
                "The core AutoRespondService (~1,100 lines) uses OpenAI function calling with three tools — searchProducts, searchStoreTrainingDocs, and escalateToHuman. When a user sends a message, the service retrieves top-5 relevant chunks from Pinecone, builds a system prompt with store context, and streams the completion via Pusher WebSocket to the frontend.",
                "A dual-LLM client provides automatic failover: if OpenAI fails, the system seamlessly switches to Anthropic Claude 3 Opus (and vice versa). Channel-aware token limits keep responses appropriate — 1,000 tokens for chat, 400 for SMS, 2,000 for email, 150 for voice. Conversations are automatically summarized after 15 messages to manage the context window.",
                "For voice calls, the response goes through ElevenLabs TTS (eleven_flash_v2 model), gets cached in Redis, and plays back via Twilio's IVR system. The IVR decision tree routes callers through AI response → call center → voicemail based on availability.",
            ],
            insight: {
                title: "Namespace Isolation Is Non-Negotiable",
                body: "Early prototypes used metadata filtering instead of namespaces for tenant isolation. During load testing, I discovered that metadata filters on large indexes added 200-400ms latency per query and had edge cases where filters could return cross-tenant results under high concurrency. Switching to dedicated namespaces eliminated both problems and simplified the query path.",
            },
        },
        {
            id: "ai-onboarding",
            title: "AI-Powered Client Onboarding",
            subtitle: "From 30 Minutes to Under 60 Seconds",
            problem:
                "Onboarding a new client required manually copying their website content, writing chatbot training data, configuring hours and contact info, and building the knowledge base. This 30-minute manual process consumed entire days and was the primary bottleneck to scaling the business.",
            diagramKey: "onboardingPipeline",
            walkthrough: [
                "The frontend onboarding wizard is a multi-phase flow built with React — it collects the client's URL, then shows real-time extraction progress via Pusher WebSocket events. An animated beam visualization gives users visual feedback as each extraction step completes.",
                "On the backend, a WebScraperDataSummarizerAgent scrapes the store's website and Google Places data, then uses GPT-4o to extract structured business info: name, brand color, hours, contact details, social links, privacy/TOS URLs, and four business summaries (about, products, demographics, additional context).",
                "Extracted content feeds through a recursive text splitter, gets embedded via Ada-002, and upserts into the client's Pinecone namespace in batches of 20. Six specialized document loaders handle different content types — product catalogs, store info, AI training settings, uploaded DOCX/PDF files, and industry-specific knowledge bases.",
                "A usePageType() hook lets the onboarding wizard and settings pages share the same AI configuration components — editing training data, adjusting chatbot personality, customizing widget theming — without duplicating 30+ screens of UI.",
            ],
            insight: {
                title: "Bi-Directional Vector Sync Prevents Stale Knowledge",
                body: "The AI setup controller syncs training data bi-directionally with Pinecone — updating text in the settings UI automatically re-embeds and upserts the corresponding vectors, and clearing a field deletes its Pinecone vectors. This eliminated a class of bugs where the chatbot's knowledge base drifted from the client's configured training data.",
            },
        },
    ],
    decisions: [
        {
            decision: "RTK Query over React Query / SWR",
            alternatives: "TanStack Query, SWR, custom fetch hooks",
            reasoning:
                "The SaaS dashboard had complex cross-component state (selected client, active filters, real-time chat state) across 41 Redux slices. RTK Query integrates natively with the Redux store, giving us one state management solution instead of Redux + a separate data-fetching library. 53 services with ~75 cache invalidation tags made cross-endpoint cache management (e.g., updating a chat session invalidates the analytics view) trivial.",
        },
        {
            decision: "Laravel as unified backend over split runtimes",
            alternatives: "FastAPI for AI routes, Express.js, separate microservices",
            reasoning:
                "All AI inference — RAG retrieval, OpenAI function calling, embeddings, TTS — runs through Laravel Actions and Services, not a separate Python/Node runtime. This kept the deployment story simple (single Laravel app on DigitalOcean via Forge) while PHP 8.3's performance was more than adequate for orchestrating API calls to OpenAI, Pinecone, and ElevenLabs. The trade-off was no native ML libraries, but the platform orchestrates external AI services rather than running models locally.",
        },
        {
            decision: "Pinecone with namespace-based multi-tenancy",
            alternatives: "Pinecone-only flat index, Weaviate, Qdrant, pgvector",
            reasoning:
                "Pinecone's namespace isolation provides hard multi-tenant boundaries — each client's vectors are physically separated, eliminating the risk of cross-tenant data leakage. Metadata filtering was tested first but added 200-400ms latency and had concurrency edge cases. Namespaces eliminated both problems and simplified the query path to a single index with per-tenant namespaces.",
        },
        {
            decision: "Preact islands for embeddable widgets",
            alternatives: "React, Web Components, vanilla JS, iframe embeds",
            reasoning:
                "Clients embed our chat widget on their WordPress and Shopify sites. React's 40KB+ runtime was unacceptable for a third-party script. Preact's 3KB runtime with Shadow DOM encapsulation let us inject widgets without style conflicts. Iframes were ruled out because they break on mobile and can't access parent page context for URL-aware chatbot responses.",
        },
        {
            decision: "Dual-LLM failover (OpenAI ↔ Anthropic)",
            alternatives: "Single provider, manual fallback, queue-and-retry",
            reasoning:
                "The LLMClient automatically tries Anthropic Claude 3 Opus if OpenAI fails, and vice versa. For a customer-facing chatbot where downtime means lost revenue for clients, the dual-provider architecture cost minimal additional complexity (same prompt format, same streaming interface) but eliminated single-provider outage risk entirely.",
        },
        {
            decision: "usePageType() for settings/onboarding reuse",
            alternatives: "Duplicate components, conditional rendering, separate routes",
            reasoning:
                "The AI configuration UI appears in both onboarding (first-time setup) and settings (ongoing management). A custom usePageType() hook detects the context and adjusts behavior — onboarding shows guided steps with progress indicators, settings shows direct-edit forms. This eliminated 30+ duplicate screens and ensured configuration changes propagated to both contexts automatically.",
        },
    ],
    learnings: [
        {
            title: "Multi-Tenant Vector DBs Need Hard Isolation",
            body: "Metadata filtering looks simpler than namespaces but breaks under load. Always use hard isolation (namespaces, separate indexes, or separate collections) for multi-tenant vector stores. The performance and correctness guarantees are worth the operational complexity.",
        },
        {
            title: "Channel-Aware AI Needs Per-Channel Constraints",
            body: "A chatbot response that works in a web widget (1,000 tokens, Markdown) is unusable as a voice IVR prompt (150 tokens, plain text) or an SMS reply (400 tokens). Building channel awareness into the AI service from day one — instead of retrofitting it — saved months of per-channel edge case fixes.",
        },
        {
            title: "Product-Market Fit Tests Architecture",
            body: "RipeMetrics pivoted 3 times: from review management to customer analytics to AI chatbots. Each pivot stress-tested the architecture differently. The modular service-oriented design survived because individual services (email, analytics, chat) could be swapped or deprecated without cascading changes. The 880-component frontend survived because of strict data-driven rendering — swap the data, keep the components.",
        },
    ],
    technicalImplementation: {
        title: "Technical Implementation",
        sections: [
            {
                heading: "Frontend Architecture",
                content:
                    "Built the 128K+ LOC Next.js 14 core application plus 7 supporting repos (reputation app, marketing site, extractors, embeddable widgets, changelog, WP plugin). The core app spans CRM with drag-and-drop kanban (react-beautiful-dnd), polymorphic timeline (7 item types), and 6-channel messaging. Engage module with Unlayer campaign builder, customer segmentation, NPS dashboards, and landing page studio. 41 Redux slices and 53 RTK Query services with ~75 cache invalidation tags power the data layer across 85 routes.",
            },
            {
                heading: "AI & Voice Engineering",
                content:
                    "Built the production RAG pipeline on Laravel: recursive text splitting, OpenAI Ada-002 embeddings, Pinecone vector storage with namespace multi-tenancy, and a 1,100-line AutoRespondService with OpenAI function calling and dual-LLM failover (OpenAI ↔ Anthropic). Integrated ElevenLabs TTS for voice AI, Twilio IVR with speech recognition, and 7 AI-powered business insight tools that generate strategic recommendations from analytics data.",
            },
            {
                heading: "Backend & Infrastructure",
                content:
                    "Laravel 11 backend with 170+ models, 300+ migrations, MySQL + MongoDB, Redis/Horizon queue management. DigitalOcean hosting via Laravel Forge CI/CD. Integrated 15+ third-party services including Twilio, SendGrid, Stripe, Shopify, ElevenLabs, and Pusher for real-time WebSocket events.",
            },
            {
                heading: "Cross-Platform Widgets",
                content:
                    "Preact 10 islands with Shadow DOM encapsulation deployed as Web Components via a WordPress plugin. 3KB runtime with Pusher-powered real-time streaming for chat responses, injected onto client WordPress and Shopify sites without style conflicts.",
            },
        ],
    },
    achievements: {
        title: "Key Achievements",
        items: [
            {
                title: "Multi-Repo SaaS Platform",
                description:
                    "Built 8 repositories: 128K+ LOC core app (880 components, 85 routes, 41 Redux slices, 53 RTK Query services), reputation app (Laravel/Inertia/React), marketing site (Next.js, 80+ components), Preact widget system, TypeScript extraction pipeline, changelog, and WordPress plugin.",
            },
            {
                title: "30-Minute to 60-Second Onboarding",
                description:
                    "Replaced a 30-minute manual client setup with an AI-powered pipeline that scrapes, extracts, embeds, and configures a new client's chatbot in under 60 seconds.",
            },
            {
                title: "Production RAG Pipeline",
                description:
                    "Built a complete retrieval-augmented generation system from scratch in Laravel: document ingestion, chunking, embedding, Pinecone storage, semantic retrieval, OpenAI function calling, and dual-LLM failover.",
            },
            {
                title: "Four-Channel AI Service",
                description:
                    "Same AI brain serves chat widgets, SMS, email, and phone calls — each with channel-appropriate formatting, token limits, and delivery mechanisms (Pusher, Twilio, SendGrid, ElevenLabs TTS).",
            },
            {
                title: "Performance Optimization",
                description:
                    "Reduced dashboard response times by 6 seconds through the Livewire → React migration, RTK Query caching with ~75 invalidation tags, and optimistic updates.",
            },
            {
                title: "Zero-Downtime Migration",
                description:
                    "Migrated all clients from Laravel Livewire to React over 3 months using feature flags — per-client rollout with zero downtime incidents.",
            },
            {
                title: "Voice AI Integration",
                description:
                    "ElevenLabs TTS voice synthesis with Twilio IVR, speech recognition routing, Redis-cached audio, and a priority decision tree: AI response → call center → voicemail.",
            },
        ],
    },
    conclusion: {
        title: "Results",
        description:
            "As Lead Frontend Developer & AI Engineer, I built a multi-repo platform spanning 8 repositories — a 128K+ LOC React core app (880 components, 85 routes), consumer-facing reputation app, marketing site, embeddable Preact widgets, TypeScript extraction pipeline, and the production RAG pipeline. The AI-powered onboarding reduced a 30-minute manual process to under 60 seconds. The multi-channel AI system handles customer interactions across chat, SMS, email, and voice — with dual-LLM failover ensuring zero-downtime AI service.",
        cta: {
            secondary: { text: "View More Projects", href: "/projects" },
        },
    },
};
