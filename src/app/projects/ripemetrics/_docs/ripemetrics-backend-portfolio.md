# RipeMetrics — Backend Platform Portfolio Report

> Deep codebase audit of `ripemetrics-prod-ffe74c72cd5e` (one repo of many in the RipeMetrics ecosystem).

---

## Executive Summary

RipeMetrics is an AI-native customer intelligence and engagement platform built on **Laravel 11 / PHP 8.3**. It serves brick-and-mortar and e-commerce businesses with CRM, omni-channel messaging, AI-powered chatbots, marketing automation, analytics, and POS integrations. The backend is a monolithic Laravel app with ~170 Eloquent models, 160+ API endpoints, 100+ analytics chart classes, and deep integrations with 10+ third-party services across 300+ database migrations.

---

## Tech Stack

| Layer         | Technology                                                              |
| ------------- | ----------------------------------------------------------------------- |
| Framework     | Laravel 11.x (PHP 8.3)                                                  |
| Primary DB    | MySQL (utf8mb4)                                                         |
| Secondary DB  | MongoDB (`mongodb/laravel-mongodb`)                                     |
| Archive DB    | Separate MySQL instance                                                 |
| Cache / Queue | Redis via Laravel Horizon                                               |
| Search        | Meilisearch (via `laravel/scout`)                                       |
| Vector Store  | Pinecone (RAG)                                                          |
| AI            | OpenAI (`gpt-4o-mini`, `gpt-4o`) + Anthropic (`claude-3-opus`) fallback |
| Real-time     | Pusher + Laravel Reverb                                                 |
| Frontend      | Blade + Livewire 3 + Tailwind CSS                                       |
| Billing       | Stripe via `laravel/cashier`                                            |
| Testing       | Pest 3, PHPStan, Laravel Pint, Rector                                   |
| Monitoring    | Sentry, Telescope, Pulse                                                |
| CI/CD         | Bitbucket Pipelines + Docker (PHP 8.3 image)                            |

---

## Architecture Patterns

1. **Action-oriented** — Business logic in `lorisleiva/laravel-actions` (invokable classes usable as controllers, jobs, or commands)
2. **Event-driven** — 80+ domain events + 75+ listeners for side effects
3. **Queue-centric** — Redis queues via Horizon; ~55 queued jobs
4. **Multi-tenant by Store** — `Store` is the central tenant entity; `CustomerStore` is the per-store customer record
5. **POS-agnostic** — Abstracted POS integrations (Shopify, Clover, Blaze, Treez) via Saloon HTTP connectors
6. **AI-augmented** — OpenAI for auto-respond, sentiment, summarization; Pinecone for RAG; ElevenLabs for TTS
7. **Pre-computed BI layer** — 17 `Bi*` aggregate tables updated by scheduled commands

---

## Project Structure — `app/` Directory

| Directory           | Purpose                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Models/`           | ~170+ models. Core: `Store`, `CustomerStore`, `Order`, `Product`, `Campaign`, `User`, `Organization`, `Survey`, `TextMessage`, `ChatMessage`, `VoiceCall`. Shopify + Clover POS mirror models. BI aggregate models. |
| `Actions/`          | Business logic as invokable action classes. Domains: AI agents/retrievers/vector stores, Clover, Shopify, SendGrid, Twilio, Store setup, Subscriptions, Prospects, Voice, Web scrapers, Order processing.           |
| `Http/Controllers/` | ~100+ controllers. Mix of API controllers, webhook receivers (Stripe, Clover, Shopify, Twilio, SendGrid, Pusher), and admin controllers.                                                                            |
| `Jobs/`             | ~55 queued jobs: BI updates, email/SMS sending, campaign delivery, Shopify/Clover backfills, RFMD calculations.                                                                                                     |
| `Events/`           | ~80+ domain events covering the full lifecycle: orders, customers, campaigns, voice calls, chat, store creation, Shopify sync.                                                                                      |
| `Listeners/`        | ~75+ event listeners. Key flows: Stripe webhook handling, order expansion, email/SMS delivery, AI summarization, customer metric updates.                                                                           |
| `Services/`         | Thin service layer: AI (AutoRespond, CustomerIdentifier, SessionManager), DocumentProcessing, EmailValidation, MediaLibrary, TextProcessing, VectorStorage.                                                         |
| `Integrations/`     | Saloon-based HTTP connectors for: Apify, Blaze, Clover, OnFleet, Shopify, Treez.                                                                                                                                    |
| `Console/Commands/` | ~70+ Artisan commands: backfills, data fixes, BI updates, marketing setup, Shopify sync, birthday messages, campaign sending.                                                                                       |
| `Charts/`           | 100+ chart classes powering the analytics dashboard.                                                                                                                                                                |

---

## AI & Chatbot Integration

### Multi-Channel AI Chatbot

- **Core engine**: `AutoRespondService` — GPT-4o-mini with streaming responses, multi-channel formatting (chat/SMS/email/voice), conversation history cached in Redis
- **RAG pipeline**: Store knowledge docs + product catalog → OpenAI embeddings (`text-embedding-ada-002`) → Pinecone vector store → semantic search at query time
- **Tool calling**: 3 registered OpenAI function tools:
    - `searchProducts` — Semantic product search via Pinecone vectors
    - `searchStoreTrainingDocs` — RAG over uploaded knowledge documents
    - `escalateToHuman` — Structured human handoff with urgency/reason/contact info
- **Human escalation**: Broadcasts `ExternalChatWantsAHuman` event with full context preserved
- **Streaming**: Real-time token-by-token broadcast via WebSocket (Pusher)

### LLM Client Abstraction

- Dual-provider `LLMClient` with **automatic failover** — OpenAI primary (`gpt-4o`), Anthropic (`claude-3-opus`) backup
- Supports streaming and non-streaming modes, JSON response format
- Transparent to consumers — failure on one provider silently routes to the other

### AI Analysis Pipeline

| Capability                 | Model                     | Scope                           |
| -------------------------- | ------------------------- | ------------------------------- |
| Sentiment summary          | `gpt-3.5-turbo-instruct`  | SMS, email, chat, surveys       |
| Tone classification        | `gpt-3.5-turbo-instruct`  | SMS, email, chat, surveys       |
| Content moderation         | OpenAI Moderations API    | All channels                    |
| Aspect-based sentiment     | `gpt-4o-mini` (JSON mode) | All channels (structured JSON)  |
| Conversation summarization | `gpt-4o-mini`             | Chat threads (>15 messages)     |
| Attention detection        | `gpt-4o`                  | Supervisor escalation           |
| Business insight cards     | `gpt-4-1106-preview`      | Revenue, customer, product data |
| Chart data summaries       | `gpt-4o-mini`             | Executive summaries + recs      |

### Voice AI / IVR

- Twilio bidirectional WebSocket audio streaming
- Google Cloud Speech API (STT)
- ElevenLabs (TTS, `eleven_monolingual_v1`)
- IVR response tracking and AI auto-respond

### Document Knowledge Base (RAG)

- **Ingestion**: PDF/DOCX/TXT → text extraction → semantic chunking (1000 chars, 200 overlap) → embeddings → Pinecone
- **Per-store knowledge base** with training data management UI
- **Product catalog vectorization** for semantic product search
- **Document loaders**: `UpsertDocument`, `UpsertDocx`, `UpsertAISettings`, `UpsertStoreInfo`, `UpsertProductInfo`

---

## Omni-Channel Messaging

### Channel Maturity Matrix

| Channel                   | Status     | Provider             | Key Features                                                                        |
| ------------------------- | ---------- | -------------------- | ----------------------------------------------------------------------------------- |
| **SMS/MMS**               | Production | Twilio               | Per-store subaccounts, DNC management, token replacement, media, scheduled delivery |
| **Email (transactional)** | Production | SendGrid             | Per-store subuser accounts, domain auth, inbound parse, delivery tracking           |
| **Email (campaigns)**     | Production | SendGrid             | Unlayer editor, marketing group targeting, batch sends (50/chunk)                   |
| **Voice/IVR**             | Production | Twilio               | Call centers, voicemail recording, transcription, AI auto-respond                   |
| **In-app Chat**           | Production | Custom + AI          | AI chatbot with streaming, human escalation, sentiment analysis                     |
| **Web Push**              | Production | VAPID + Pusher Beams | Service worker, subscription management                                             |
| **Slack**                 | Production | Webhooks             | Negative feedback alerts, campaign notifications, missed calls                      |
| **Telegram**              | Configured | Bot API              | Token configured, sending partial                                                   |
| **Facebook Messenger**    | Configured | Graph API            | Page token configured, DNC tracking                                                 |
| **WhatsApp / Signal**     | Planned    | —                    | DNC tracking columns, capability checks implemented                                 |

### Campaign Management

- Multi-channel campaigns (email + SMS)
- Marketing group targeting with dynamic audience building
- Unlayer email design editor integration
- Campaign lifecycle: sending → completed → failed
- Coupon code attachment, stealth messages

### Automated Messaging / Customer Journey

- Post-purchase drip messages based on purchase ordinal
- Birthday SMS automation
- Predicted lost customer recapture messaging
- Configurable send time windows
- Survey integration in journey messages

### DNC & Compliance

- Per-channel Do Not Contact tracking: SMS, email, web push, WhatsApp, Facebook, Telegram, Signal
- Blacklist and invalid number management
- Duplicate message prevention (24h window)

---

## Analytics Engine — 100+ Chart Classes

Dynamic chart system loaded by class name via `ChartController@show`:

- **Sales/Revenue**: Spline charts, stat cards, purchase heatmaps, hourly breakdowns by day-of-week
- **Customer**: Lifetime value, retention curves, age/gender demographics, RFM+D segmentation
- **AI Insights**: Sentiment bubble charts, customer trend summaries, business recommendation cards
- **Product**: Sunburst, category bars, biggest movers, profitability, market basket
- **Marketing**: Source attribution, campaign performance, funnel analysis
- **Retention**: Cohort heatmaps, retention curves, milestone stat cards (2nd, 5th, 10th, 12-month)
- **NPS/Feedback**: Gauges, donuts, word clouds
- **Organization**: Multi-store comparison and rollup views
- **Communication Volume**: Radial bar charts summarizing all channel activity

---

## API Surface

- **~160+ endpoints** under Sanctum authentication
- **~50 active controllers**, 21 authorization policies, 90+ form request validators
- **Public chatbot API**: Initialize → message → history flow for embeddable widget
- **Webhook receivers** for: Stripe, Twilio (SMS status + voice), SendGrid (delivery + inbound), Clover, Shopify, Pusher, web scraper callbacks

### Key Endpoint Groups

| Group              | Endpoints | Highlights                                                            |
| ------------------ | --------- | --------------------------------------------------------------------- |
| Stores             | 25+       | Settings, contacts, Twilio/SendGrid setup, product recs, best sellers |
| Customers (CRM)    | 20+       | CRUD, send email/SMS/chat, timeline, mass operations                  |
| Prospects          | 15        | Kanban pipeline, stage changes, search, export                        |
| Campaigns          | 9         | CRUD, search, export, duplicate, image upload                         |
| Marketing Groups   | 10        | CRUD, import, contacts, search, export                                |
| AI / Chatbot       | 6         | External/internal chatbot, AI setup, knowledge docs                   |
| Charts / Analytics | Dynamic   | 100+ chart classes via `GET /v2/charts/{chart_name}`                  |
| Voice Call Center  | 4         | Dial, claim, hangup, hold                                             |
| Organizations      | 5+        | Multi-store analytics rollups                                         |

---

## POS & E-Commerce Integrations

| Integration | Type         | Depth                                                                                                    |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| **Shopify** | E-commerce   | Full: products, orders, customers, discounts, webhooks, billing, backfill (13+ mirror tables)            |
| **Clover**  | POS          | Full: merchants, orders, customers, employees, inventory, webhooks, Livewire dashboard (8 mirror tables) |
| **Blaze**   | POS          | Saloon HTTP connector                                                                                    |
| **Treez**   | POS          | Saloon HTTP connector                                                                                    |
| **OnFleet** | Delivery     | Saloon HTTP connector                                                                                    |
| **Apify**   | Web scraping | Orchestration for content extraction and onboarding pipeline                                             |

---

## Database Scale

- **300+ migrations** (2022–2025)
- **170+ Eloquent models**
- **Core entities**: `Store`, `CustomerStore` (RFMD segmentation), `Order`, `Product`, `Campaign`, `ChatMessage`, `TextMessage`, `VoiceCall`, `Survey`
- **17 pre-computed `Bi*` aggregate tables**: orders, customers, campaigns, comms, prospects, retention, marketing sources, demographics
- **13+ Shopify mirror tables**, 8 Clover mirror tables
- **3 database connections**: primary MySQL, archive MySQL, MongoDB

---

## Infrastructure & Ops

- **3 AWS S3 buckets**: dev, prod, clients
- **Docker** containerization (PHP 8.3)
- **Bitbucket Pipelines** CI/CD
- **Laravel Horizon** for Redis queue monitoring
- **Sentry** error tracking, **Telescope** request debugging, **Pulse** performance monitoring
- **70+ Artisan commands** for backfills, BI updates, data fixes, marketing setup
- **`RestrictCommandsServiceProvider`** blocks dangerous commands by environment
- **Stripe billing**: 4 product tiers (CRM, Engage, Intel, Admin) with monthly/yearly pricing

---

## Key Technical Achievements

1. **Multi-provider AI with automatic failover** — OpenAI primary, Anthropic backup, transparent to consumers
2. **Full RAG pipeline** — Document ingestion → chunking → embedding → vector search → grounded AI responses per tenant
3. **Streaming AI chatbot** — WebSocket-broadcast token-by-token responses with Pusher
4. **Aspect-based sentiment analysis** — Structured JSON extraction of sentiment, keywords, and aspects across all communication channels
5. **POS-agnostic architecture** — Saloon HTTP connectors abstract multiple POS systems behind a unified interface
6. **Event-driven side effects** — 80+ domain events decouple core logic from notifications, analytics, and sync
7. **Pre-computed BI layer** — Scheduled jobs maintain 17 aggregate tables for sub-second dashboard loads
8. **Omni-channel messaging** — 7 production channels (SMS, email, voice/IVR, chat, web push, Slack, real-time) + 3 configured/planned
9. **Multi-tenant by Store** — Hard isolation across 50+ tenants with per-store Twilio subaccounts, SendGrid subusers, and Pinecone namespaces
10. **100+ analytics chart classes** — Dynamic chart loading with AI-generated executive summaries and business recommendations

---

## Other Repos in the Ecosystem

This audit covers the **backend monolith** only. The full RipeMetrics platform spans additional repositories:

| Repo                             | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| `ripemetrics-reputation`         | Reputation management / review widgets     |
| `ripemetrics-ripe-changelog`     | Product changelog (Next.js + MDX)          |
| `ripemetrics-ripe-extractors`    | Content extraction pipelines               |
| `ripemetrics-ripe-wp-plugin`     | WordPress plugin for widget embedding      |
| `ripemetrics-app-frontend`       | React SPA (main SaaS dashboard)            |
| `ripemetrics-marketing-frontend` | Marketing website                          |
| `ripemetrics-preact-islands`     | Lightweight embeddable chat/review widgets |
