import type { DiagramKey } from "./diagrams"

export interface HeaderData {
  backLink: string
  backText: string
  badge: { color: string; label: string }
  title: string
  description: string
}

export interface OverviewData {
  role: { label: string; value: string }
  timeline: { label: string; value: string }
  technologies: { label: string; items: string[] }
}

export interface Feature {
  id: string
  title: string
  description: string
}

export interface ImpactMetric {
  value: string
  label: string
}

export interface TechSection {
  heading: string
  content: string
}

export interface Achievement {
  title: string
  description: string
}

export interface ConclusionData {
  title: string
  description: string
  cta: { secondary: { text: string; href: string } }
}

export interface DeepDive {
  id: string
  title: string
  subtitle: string
  problem: string
  diagramKey: DiagramKey
  walkthrough: string[]
  insight: { title: string; body: string }
}

export interface Decision {
  decision: string
  alternatives: string
  reasoning: string
}

export interface Learning {
  title: string
  body: string
}

export interface PageData {
  header: HeaderData
  overview: OverviewData
  challenge: { title: string; description: string }
  solution: { title: string; description: string; features: Feature[] }
  impact: { title: string; metrics: ImpactMetric[] }
  architectureDiagramKey: DiagramKey
  deepDives: DeepDive[]
  decisions: Decision[]
  learnings: Learning[]
  technicalImplementation: { title: string; sections: TechSection[] }
  achievements: { title: string; items: Achievement[] }
  conclusion: ConclusionData
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
      "AI-native customer growth platform that helps businesses automate customer service, reduce costs by 40%, and scale support operations through intelligent chatbots, predictive analytics, and omni-channel communication.",
  },
  overview: {
    role: {
      label: "Role",
      value: "Founder, President & Full Stack Developer",
    },
    timeline: {
      label: "Timeline",
      value: "April 2017 - July 2025",
    },
    technologies: {
      label: "Technologies",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "Redux RTK",
        "Material UI",
        "Tailwind",
        "FastAPI",
        "PostgreSQL",
        "MySQL",
        "OpenAI",
        "Pinecone",
        "Chroma",
      ],
    },
  },
  challenge: {
    title: "The Challenge",
    description:
      "Businesses struggle to scale customer service operations efficiently. Traditional support systems are costly, slow to respond, and can't handle the volume of customer interactions modern businesses face. Companies need intelligent automation that maintains service quality while reducing operational costs.",
  },
  solution: {
    title: "The Solution",
    description:
      "RipeMetrics is an AI-native customer growth platform that processes thousands of customer interactions daily across 50+ enterprise clients. The platform combines context-aware chatbots, vector database search, and real-time analytics to deliver intelligent, automated customer service at scale.",
    features: [
      {
        id: "chatbots",
        title: "AI-Powered Chatbots",
        description:
          "Context-aware chatbots built with OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service with intelligent response generation.",
      },
      {
        id: "analytics",
        title: "Real-Time Analytics Dashboard",
        description:
          "Comprehensive analytics with 40+ custom charts using Highcharts for large dataset visualization, providing actionable insights into customer interactions and service performance.",
      },
      {
        id: "extraction",
        title: "Automated Content Extraction",
        description:
          "Modular website content extraction system using TypeScript and Apify SDK, reducing client onboarding time from 20 minutes to just 2 minutes.",
      },
      {
        id: "call-center",
        title: "Real-Time Call Center",
        description:
          "Web-based call center with ElevenLabs voice synthesis and Twilio integration for IVR system, enabling voice-based customer interactions with AI assistance.",
      },
    ],
  },
  impact: {
    title: "Impact",
    metrics: [
      { value: "50+", label: "Enterprise clients served" },
      { value: "40%", label: "Reduction in customer service costs" },
      { value: "95%+", label: "System uptime achieved" },
    ],
  },
  architectureDiagramKey: "systemArchitecture",
  deepDives: [
    {
      id: "frontend-migration",
      title: "Laravel → React Migration",
      subtitle: "Refactoring a Monolith Without Downtime",
      problem:
        "The original platform was built on Laravel Livewire — server-rendered components with limited interactivity. As the product grew to 50+ clients, Livewire's round-trip model added 6+ seconds to common dashboard interactions. Real-time features like live chat and streaming AI responses were impossible without a fundamental architecture change.",
      diagramKey: "migrationTimeline",
      walkthrough: [
        "I audited every Livewire component and mapped them to React equivalents, prioritizing the highest-traffic surfaces first: the analytics dashboard (40+ charts), the chat interface, and the client management panel.",
        "RTK Query replaced Laravel's Eloquent-based API layer. Each endpoint got typed request/response schemas, optimistic updates for UI responsiveness, and automatic cache invalidation. This alone cut perceived latency by ~4 seconds on dashboard loads.",
        "The migration ran in parallel with production — a feature flag routed enterprise clients to the React app while smaller accounts stayed on Livewire. Over 3 months, we migrated 100% of users with zero downtime incidents.",
        "Material UI provided the component foundation, but Tailwind handled all custom styling. This hybrid approach gave us rapid prototyping speed (MUI's pre-built components) with pixel-level control (Tailwind utilities) where designs demanded it.",
      ],
      insight: {
        title: "Parallel Migration > Big Bang Rewrite",
        body: "Running both frontends simultaneously cost extra infrastructure, but it eliminated the risk of a failed big-bang cutover. Feature flags let us validate the React app with power users first, catch edge cases, and roll back per-client if needed. The 6-second improvement in response times justified the migration cost within the first month.",
      },
    },
    {
      id: "ai-chatbot",
      title: "AI Chatbot Architecture",
      subtitle: "Multi-Tenant RAG with Streaming Responses",
      problem:
        "Each client needed a chatbot that understood their specific business — not a generic GPT wrapper. The system had to isolate each client's knowledge base, support real-time streaming responses, maintain conversation history, and scale to handle concurrent sessions across 50+ tenants without cross-contamination of context.",
      diagramKey: "chatbotArchitecture",
      walkthrough: [
        "Each client's website content, FAQs, and documentation gets embedded via OpenAI's text-embedding-ada-002 and stored in a namespaced Pinecone index. Namespaces provide hard tenant isolation — one client's vectors never appear in another's search results.",
        "When a user sends a message, the API retrieves the top-5 most relevant document chunks from that tenant's namespace, joins them with the conversation history (last 10 messages), and constructs a system prompt that constrains the model to the client's domain.",
        "FastAPI handles the OpenAI streaming response via Server-Sent Events. Tokens stream to the chat widget in real-time while the full response is asynchronously persisted to the database and broadcast to the agent dashboard via PusherJS.",
        "A fallback escalation path triggers when the chatbot's confidence score drops below a threshold — the conversation routes to a human agent with full context preserved, so the agent doesn't start from scratch.",
      ],
      insight: {
        title: "Namespace Isolation Is Non-Negotiable",
        body: "Early prototypes used metadata filtering instead of namespaces for tenant isolation. During load testing, I discovered that metadata filters on large indexes added 200-400ms latency per query and had edge cases where filters could return cross-tenant results under high concurrency. Switching to dedicated namespaces eliminated both problems and simplified the query path.",
      },
    },
    {
      id: "onboarding-pipeline",
      title: "Automated Client Onboarding",
      subtitle: "From 20 Minutes to 2 Minutes Per Client",
      problem:
        "Onboarding a new client required manually copying their website content, writing chatbot training data, and configuring the knowledge base. At 50+ clients, this manual process consumed 15+ hours per week and was the primary bottleneck to scaling the business.",
      diagramKey: "onboardingPipeline",
      walkthrough: [
        "The pipeline starts with a client URL and extraction config. Apify SDK crawls the site following both sitemap.xml links and discovered anchor tags, building a complete page inventory with deduplication.",
        "Each page runs through a content parser that strips navigation, footers, and boilerplate, extracting only meaningful content. The parser handles SPAs via headless browser rendering when static HTML extraction fails.",
        "Extracted content is chunked into 512-token segments with 50-token overlap to preserve context at chunk boundaries. Each chunk gets embedded and upserted into the client's Pinecone namespace in batches of 100.",
        "The entire pipeline runs asynchronously — the admin triggers it from the dashboard, gets a real-time progress feed via PusherJS, and the chatbot is ready to test within 2 minutes for a typical 50-page site.",
      ],
      insight: {
        title: "Chunk Overlap Prevents Context Loss",
        body: "Initial chunking without overlap created a subtle bug: sentences split across chunk boundaries lost meaning, causing the chatbot to give incomplete answers. Adding 50-token overlap (roughly one paragraph) eliminated these edge cases. The 10% storage overhead was insignificant compared to the improvement in answer quality.",
      },
    },
  ],
  decisions: [
    {
      decision: "RTK Query over React Query / SWR",
      alternatives: "TanStack Query, SWR, custom fetch hooks",
      reasoning:
        "The SaaS dashboard had complex cross-component state (selected client, active filters, real-time chat state) that needed Redux. RTK Query integrates natively with the Redux store, giving us one state management solution instead of Redux + a separate data-fetching library. Cache invalidation tags across related endpoints (e.g., updating a chat session invalidates the analytics view) were trivial with RTK Query's tag system.",
    },
    {
      decision: "FastAPI for AI routes instead of Node.js",
      alternatives: "Express.js, Next.js API routes, Django",
      reasoning:
        "Python's ML ecosystem (LangChain, sentence-transformers, numpy) made FastAPI the natural choice for AI-heavy routes. FastAPI's native async support and streaming response capabilities matched the chatbot's SSE requirements perfectly. The trade-off — running two server runtimes — was offset by cleaner separation of concerns: Next.js handles the marketing site and SSR, FastAPI handles all AI inference routes.",
    },
    {
      decision: "Pinecone + Chroma dual vector DB strategy",
      alternatives: "Pinecone-only, Weaviate, Qdrant, pgvector",
      reasoning:
        "Pinecone runs in production for its managed infrastructure and namespace-based multi-tenancy. Chroma runs locally for development and testing — identical API surface, zero cloud costs during iteration. This dual approach let developers test embedding pipelines and chatbot behavior locally without burning Pinecone API credits or risking production data.",
    },
    {
      decision: "Preact islands for embeddable widgets",
      alternatives: "React, Web Components, vanilla JS, iframe embeds",
      reasoning:
        "Clients embed our chat widget on their WordPress and Shopify sites. React's 40KB+ runtime was unacceptable for a third-party script. Preact's 3KB runtime with compatible API let us share component logic between the main app and the embeddable widget. Iframes were ruled out because they break on mobile and can't access parent page context for URL-aware chatbot responses.",
    },
    {
      decision: "SendGrid with TCR/10DLC compliance",
      alternatives: "Amazon SES, Mailgun, Postmark, self-hosted SMTP",
      reasoning:
        "At 10,000+ daily marketing emails, deliverability is the constraint — not cost. SendGrid's dedicated IP pools and TCR/10DLC registration process (which took 6 weeks to complete) ensured our emails landed in inboxes, not spam folders. The compliance process was painful but necessary: without 10DLC registration, carriers increasingly block unregistered bulk SMS/email senders.",
    },
  ],
  learnings: [
    {
      title: "Multi-Tenant Vector DBs Need Hard Isolation",
      body: "Metadata filtering looks simpler than namespaces but breaks under load. Always use hard isolation (namespaces, separate indexes, or separate collections) for multi-tenant vector stores. The performance and correctness guarantees are worth the operational complexity.",
    },
    {
      title: "Streaming Changes Everything About Error Handling",
      body: "With traditional request/response, you return errors before any data. With SSE streaming, you might be 200 tokens into a response when OpenAI rate-limits you. I built a structured error token protocol so the frontend can distinguish between a normal end-of-stream and a mid-stream failure.",
    },
    {
      title: "Product-Market Fit Tests Architecture",
      body: "RipeMetrics pivoted 3 times: from review management to customer analytics to AI chatbots. Each pivot stress-tested the architecture differently. The modular service-oriented design survived because individual services (email, analytics, chat) could be swapped or deprecated without cascading changes.",
    },
  ],
  technicalImplementation: {
    title: "Technical Implementation",
    sections: [
      {
        heading: "Frontend Architecture",
        content:
          "Led complete refactor from Laravel Livewire to React/Next.js using RTK Query, TypeScript, TailwindCSS, and Material UI, reducing network request response times by 6 seconds on average. Built the main SaaS application and marketing website with headless CMS integration using Sanity. Created lightweight Preact islands architecture for embeddable widgets and WordPress plugin integration.",
      },
      {
        heading: "AI & Machine Learning",
        content:
          "Designed context-aware chatbot using OpenAI, MySQL, and Pinecone/Chroma vector databases for omni-channel AI customer service. Implemented Next.js/FastAPI system for AI interactions with streaming response capabilities. Architected vector databases for document embeddings with multi-tenant architecture.",
      },
      {
        heading: "Backend & Infrastructure",
        content:
          "Built real-time communication systems using PusherJS and WebSockets. Monitored and maintained CI/CD pipelines through Forge, Vercel, Bitbucket, and DigitalOcean. Implemented PostHog analytics to monitor onboarding processes and optimize user flow conversion rates. Configured SendGrid SDK for marketing email server supporting 10,000+ daily emails with TCR/10DLC compliance.",
      },
    ],
  },
  achievements: {
    title: "Key Technical Achievements",
    items: [
      {
        title: "Performance Optimization",
        description:
          "Reduced network request response times by 6 seconds on average through complete React/Next.js refactor with RTK Query and TypeScript.",
      },
      {
        title: "Rapid Client Onboarding",
        description:
          "Built automated content extraction system that reduced client onboarding time from 20 minutes to 2 minutes using TypeScript and Apify SDK.",
      },
      {
        title: "Comprehensive Analytics",
        description:
          "Developed analytics dashboard with 40+ custom charts using Highcharts for large dataset visualization and real-time insights.",
      },
      {
        title: "High Availability",
        description:
          "Achieved 95%+ system uptime through robust architecture, comprehensive monitoring with Sentry and PostHog, and efficient CI/CD pipelines.",
      },
      {
        title: "Scalable Email Infrastructure",
        description:
          "Configured SendGrid SDK to support 10,000+ daily marketing emails with TCR/10DLC compliance for enterprise-scale communication.",
      },
      {
        title: "Multi-Tenant Vector Database",
        description:
          "Architected vector databases for document embeddings with multi-tenant architecture using Pinecone and Chroma for intelligent search.",
      },
    ],
  },
  conclusion: {
    title: "Results",
    description:
      "RipeMetrics successfully scaled from concept to serving 50+ enterprise clients, processing thousands of customer interactions daily. The platform reduced customer service costs by 40% through AI automation while maintaining 95%+ system uptime. Led technical team through multiple successful product pivots based on market feedback, demonstrating the platform's adaptability and robust architecture.",
    cta: {
      secondary: { text: "View More Projects", href: "/projects" },
    },
  },
}
