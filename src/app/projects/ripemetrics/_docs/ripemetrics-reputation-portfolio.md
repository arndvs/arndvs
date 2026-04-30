# RipeMetrics Reputation — Portfolio Report

> Deep codebase audit of `ripemetrics-reputation-7ec639309e3d` — the consumer-facing reputation, loyalty, and AI chatbot app.

---

## Executive Summary

RipeMetrics Reputation is a **consumer-facing multi-tenant web app** that gives each retail store a branded subdomain (`storename.myreputation.vip`). Customers land on personalized pages, take NPS/CX surveys, leave reviews on Google/Weedmaps/Yelp, manage communication preferences, interact with an AI chatbot, and opt into loyalty programs. Built on **Laravel 11 + Inertia.js + React 18**, it shares a database with the main RipeMetrics backend and proxies complex AI queries to the production API.

---

## Tech Stack

| Layer           | Technology                                                |
| --------------- | --------------------------------------------------------- |
| Framework       | Laravel 11 (PHP 8.3)                                      |
| Frontend        | React 18 via Inertia.js                                   |
| Build           | Vite 3                                                    |
| CSS             | Tailwind CSS 3 + Material UI + Headless UI                |
| Animation       | Framer Motion                                             |
| Forms           | react-hook-form + Laravel Precognition                    |
| DB              | MySQL 8.0 (shared with main RipeMetrics backend)          |
| Cache / Queue   | Redis (Alpine) via Laravel Horizon                        |
| Search          | Typesense 0.25.2                                          |
| WebSockets      | Laravel Reverb + Pusher.js                                |
| AI / LLM        | OpenAI (GPT-3.5-turbo, text-davinci-003, Moderations API) |
| Vector DB       | Pinecone (`text-embedding-ada-002`)                       |
| Monitoring      | Sentry, Laravel Pulse, Laravel Horizon                    |
| Dev Environment | Laravel Sail (Docker)                                     |
| Testing         | Pest 2 + PHPUnit 10                                       |
| Static Analysis | Larastan (PHPStan), Rector, Laravel Pint                  |

---

## Architecture

### Multi-Tenant via Subdomain

The `ParseSubdomain` middleware resolves the store from the URL subdomain on every request. It also:

- Identifies or auto-creates anonymous customers via a 1-year cookie slug
- Creates/updates `ReputationSession` records for analytics
- Records `ReputationPageHit` page views with IP and cookie tracking

No authentication required — the consumer-facing app uses cookie-based identity.

### Inertia.js SPA

A single Blade template (`app.blade.php`) bootstraps the React app via Inertia. Server-side controllers pass data as props to React page components. No Livewire — purely React with server-driven routing.

### Shared Database

This repo connects to the **same MySQL database** as the main RipeMetrics backend (`ripemetrics-prod`). Models reference tables like `orders`, `campaigns`, `bi_*` that only exist in the main app's migrations. This is a read-heavy consumer frontend over a shared data layer.

---

## Core Features

### 1. Multi-Tenant Reputation Pages

Each store gets a branded landing page at their subdomain with:

- Personalized welcome messages (detects returning customers by cookie, including birthday greetings)
- Store narratives / brand story sections
- Product grids: recommended, featured offers, most popular, new arrivals
- Store hours accordion with live "Open/Closed" status
- "Shop Now" CTA linking to store's menu/ordering URL
- "Leave a Review" CTA linking to the reviews funnel

### 2. Survey Engine

Multi-question survey system supporting 5 question types:

- **Star ratings** (1-5) for NPS, service, and product ratings
- **NPS ratings** with descriptor labels
- **Free-text** (textarea) for open feedback
- **Radio select** for single-choice questions (≤6 options)
- **Attribution modal** for single-choice with search (>6 options)
- **Multi-choice grid** for multiple selections

Features:

- Conditional branching — skip logic based on response thresholds (80% of max value triggers different follow-up)
- Self-referential question dependencies (`dependent_on_minimum_value_from_question_id`)
- Survey delivery via unique URL links (`/survey/{unique_id}`)
- Completion tracking: `opened_at`, `completed_at`, `closed_at` timestamps
- Coupon reward display on completion

### 3. Review Funnel

Directs customers to leave reviews on external platforms with guided instructions:

- **Google** — Sign in → rate → post (3-step visual guide)
- **Weedmaps** — Write a Review → rate → post → authenticate (4-step guide)
- **Yelp** — Write a Review → rate/title/body → submit → authenticate (4-step guide)

Each platform has branded logos, example screenshots, and outbound CTA links. Click tracking via `data-track-*` attributes.

### 4. Customer Opt-In / Lead Capture

In-store loyalty rewards signup form collecting:

- First name, last name, phone, email
- Gender, date of birth
- Social handles (Twitter, Facebook, Instagram)
- Marketing consent

Creates `CustomerStore` records and `ConsumerOptIn` consent tracking.

### 5. Consumer Preferences (Self-Service)

3-tab preference management panel:

- **Communications tab** — Toggle purchase receipt emails and monthly marketing emails
- **Product tab** — Category preferences (Cartridges, Edibles, Flower, Pre-rolls, Topicals, Gear)
- **Info tab** — Edit name, email, phone, social handles

### 6. AI Chatbot

Two interaction modes:

- **Chip actions** (instant, no LLM) — Hours, location, specials, best sellers, new products, menu, recommendations, last order. Served directly from database queries.
- **Freeform questions** — Proxied to the main RipeMetrics backend's external chatbot API (`/api/v2/external_chatbot`) which uses GPT-4o-mini + Pinecone RAG

The chatbot UI is loaded as an external Preact island widget from `ripe.chat` (`<client-chat-button-island>` web component).

### 7. AI Agent Architecture

6 specialized agents in `app/Actions/AI/Agents/`:

| Agent                      | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `ContextAgent`             | Classifies user intent → routes to specialized agent |
| `DealsAgent`               | Answers deal/promotion questions from deal data      |
| `ProductsAgent`            | Answers product questions from catalog data          |
| `StoreAgent`               | Customer support using chat history + store context  |
| `SummaryAgent`             | Summarizes SMS conversations with sentiment/tags     |
| `QueryVectorDatabaseAgent` | Pinecone vector search (placeholder)                 |

Supporting AI actions:

- `AskInContext` — Main orchestrator for chip actions + external API proxy
- `AutoRespond` — Auto-responds to inbound SMS/email using OpenAI with store+customer context
- `GetSentiment` — Sentiment analysis via OpenAI completions
- `GetTone` — Tone classification (Positive/Neutral/Negative)
- `GetModeration` — Content moderation via OpenAI Moderations API

### 8. Stealth Messages

Store-to-customer personalized HTML content pages. When a customer visits their slug URL and a `StealthMessage` exists, it renders the promotional content (e.g., holiday campaigns, product promotions) with open tracking.

### 9. Omnichannel Webhook Processing

Inbound message processing for:

- **Twilio SMS** — Creates `TextMessage` records, handles blacklist/STOP keywords, media attachments
- **WhatsApp** — Inbound message processing via Twilio WhatsApp sandbox
- **SendGrid** — Inbound email parsing and delivery status callbacks
- **WebPush** — Browser push notification subscription management

### 10. Email Open Tracking

Logo images served with email tracking IDs (`/logo/{eid}`) — tracks which emails are opened by embedding a tracking pixel.

### 11. Session & Page Analytics

- `ReputationSession` — Tracks visitor sessions with token, visit count, IP, payload
- `ReputationPageHit` — Records every page view with URL, IP, cookie slug, store, and customer

---

## Data Model — 31 Eloquent Models

### Core Domain

| Model            | Purpose                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| `Organization`   | Top-level tenant (multi-store hierarchy)                               |
| `Store`          | Central entity — identified by subdomain `short_name`                  |
| `CustomerStore`  | Per-store customer record with UUID slug, product recs, prospect stage |
| `Product`        | Product catalog with price, image, units sold                          |
| `Brand`          | Product brand grouping                                                 |
| `Review`         | Customer reviews                                                       |
| `Narrative`      | Store brand stories (sequenced, toggleable)                            |
| `DealOfTheMonth` | Promotional deals (sequenced)                                          |
| `StorePage`      | Dynamic store pages with date-range activation                         |

### Survey System

| Model                     | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `Survey`                  | Survey definition with logo, image, active flag               |
| `SurveyQuestion`          | Questions with conditional branching and dependency logic     |
| `SurveyQuestionChoice`    | Answer choices ordered by ordinality                          |
| `SurveyQuestionType`      | Type lookup (text, radio, multi-choice, rating15, NPS)        |
| `SurveyAnswer`            | Submitted answers (soft-deletes)                              |
| `SentSurvey`              | Survey delivery tracking (unique_id, opened/completed/closed) |
| `SurveyCoupon`            | Reward coupons for survey completion                          |
| `CustomerAttributionType` | Attribution categories for analytics                          |

### Messaging & Marketing

| Model                  | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `TextMessage`          | SMS messages with AI analysis fields (sentiment, tone, moderation) |
| `ChatMessage`          | Chatbot conversation messages                                      |
| `StealthMessage`       | Personalized promotional HTML content pages                        |
| `Blacklist`            | Opt-out tracking (STOP keywords)                                   |
| `ConsumerOptIn`        | Consumer consent records                                           |
| `MarketingSource`      | Marketing attribution sources                                      |
| `MarketingSourceStore` | Per-store marketing source configuration                           |

### Analytics

| Model                           | Purpose                         |
| ------------------------------- | ------------------------------- |
| `ReputationSession`             | Visitor session tracking        |
| `ReputationPageHit`             | Page view analytics             |
| `CustomerProductRecommendation` | Product recommendation tracking |

---

## Traits (Domain Logic)

| Trait             | Used By         | Purpose                                                              |
| ----------------- | --------------- | -------------------------------------------------------------------- |
| `StoreIntents`    | `Store`         | Generates AI context: hours, address, specials, boundaries, persona  |
| `CustomerIntents` | `CustomerStore` | Generates customer context: personal details + last 10 chat messages |
| `OrderIntents`    | —               | Describes order items as text for AI context                         |
| `Sluggable`       | `CustomerStore` | Auto-generates ordered UUID slugs on creation                        |
| `RecordPageHit`   | Middleware      | Creates `ReputationPageHit` records from requests                    |
| `RecordSession`   | Middleware      | Session recording (stub)                                             |

---

## Frontend — React Pages & Components

### Inertia Pages (10)

| Page          | Features                                                           |
| ------------- | ------------------------------------------------------------------ |
| `Home`        | Sticky bar, header, reputation content, stealth messages, chatbot  |
| `Survey`      | Multi-step survey engine with 5 question types                     |
| `Reviews`     | Platform selection (Google/Weedmaps/Yelp) with guided instructions |
| `Preferences` | 3-tab panel: communications, product categories, personal info     |
| `StoreOptIn`  | Customer rewards loyalty signup form                               |
| `Message`     | Stealth message HTML content display                               |
| `Calendar`    | Scheduling page (stub)                                             |
| `Wedding`     | Personal wedding invitation page (Easter egg)                      |
| `ErrorPage`   | Error display                                                      |
| `Test`        | Dev test page                                                      |

### Key React Components

- **Reputation** — Main store page orchestrator (welcome, narratives, product grids, CTAs)
- **ProductGrid** — Reusable product card grid (recommended, featured, best sellers, new)
- **StickyBar** — Scroll-triggered fixed header with store branding (framer-motion)
- **StoreHours** — Accordion with live open/closed status
- **ReviewSelect/ReviewLayout** — Per-platform review flow with instructions
- **ConsumerPreferences** — 3-tab preference panel
- **StoreOptInForm** — Lead capture form
- **StealthMessage** — HTML content renderer
- **ClientChatButtonScript** — Injects external chatbot widget as web component island
- **SurveyAnswerService** — Client-side survey answer management

---

## API Routes

| Method | URI                                     | Purpose                                      |
| ------ | --------------------------------------- | -------------------------------------------- |
| GET    | `/`                                     | Main reputation/landing page                 |
| GET    | `/reviews`                              | Review platform selection                    |
| GET    | `/{slug}`                               | Dynamic slug (stealth msg / page / customer) |
| GET    | `/survey/{unique_id}`                   | Display survey                               |
| PUT    | `/survey/{unique_id}`                   | Submit survey answer                         |
| GET    | `/opt_in`                               | Lead capture form                            |
| POST   | `/opt_in/new_lead`                      | Submit new lead                              |
| GET    | `/preferences/{slug}`                   | Preference management                        |
| PUT    | `/preferences/{slug}`                   | Update preferences                           |
| PUT    | `/preferences/{slug}/purchase-receipts` | Toggle receipt emails                        |
| PUT    | `/preferences/{slug}/monthly-marketing` | Toggle marketing emails                      |
| PUT    | `/update/{slug}/chosen_categories`      | Update product preferences                   |
| POST   | `/api/ask`                              | AI chatbot question                          |
| GET    | `/api/chatbot`                          | Chatbot data                                 |
| POST   | `/v1/sendgrid/status`                   | SendGrid webhook                             |
| POST   | `/v1/sendgrid/incoming`                 | SendGrid inbound email                       |
| GET    | `/subscribe/{unique_id}`                | WebPush subscribe                            |
| GET    | `/unsubscribe/{unique_id}`              | WebPush unsubscribe                          |
| POST   | `/save-subscription/{unique_id}`        | Save push subscription                       |
| GET    | `/logo/{eid}`                           | Logo with email tracking                     |
| GET    | `/calendar/schedule`                    | Calendar page (stub)                         |

---

## Integrations

| Service         | Integration Type | Details                                                                       |
| --------------- | ---------------- | ----------------------------------------------------------------------------- |
| OpenAI          | Package + API    | GPT-3.5-turbo (chat), text-davinci-003 (completions), Moderations, embeddings |
| Pinecone        | Package + API    | Vector storage for store/product embeddings (index: `test-flowise`)           |
| Twilio          | Webhook receiver | Inbound SMS and WhatsApp processing, blacklist management                     |
| SendGrid        | Webhook receiver | Inbound email parsing, delivery status callbacks                              |
| RipeMetrics API | HTTP proxy       | Forwards freeform chatbot questions to main backend                           |
| Sentry          | Package          | Error monitoring                                                              |
| Laravel Reverb  | WebSocket server | Real-time chat and event broadcasting                                         |
| Typesense       | Search engine    | Full-text search (Docker service)                                             |

---

## Key Technical Achievements

1. **Subdomain-based multi-tenancy** — Middleware-driven store resolution with zero-auth cookie-based customer tracking across visits
2. **Survey engine with conditional branching** — Skip logic, threshold-based question dependencies, 5 question types, NPS scoring
3. **Review funnel optimization** — Platform-specific guided review flows (Google, Weedmaps, Yelp) with click tracking
4. **AI agent routing architecture** — Intent classification → specialized agent dispatch (context, deals, products, store, summary)
5. **Hybrid chatbot** — Instant chip actions from DB queries + freeform AI via external API proxy
6. **Consumer self-service** — Preference management, email opt-in/out, product category selection
7. **Stealth marketing messages** — Personalized HTML content pages with open tracking
8. **Session analytics** — Full visitor journey tracking (sessions, page hits, cookie persistence)
9. **Omnichannel webhook processing** — SMS, WhatsApp, email inbound handling with blacklist management
10. **Shared database architecture** — Consumer frontend reads from the same data layer as the admin backend

---

## Relationship to Other Repos

This repo is the **consumer-facing frontend** that complements the `ripemetrics-prod` admin backend:

| Repo                             | Role                                                                   |
| -------------------------------- | ---------------------------------------------------------------------- |
| `ripemetrics-prod`               | Admin backend (Laravel API, 170+ models, 160+ endpoints)               |
| **`ripemetrics-reputation`**     | **Consumer frontend (this repo) — surveys, reviews, chatbot, loyalty** |
| `ripemetrics-app-frontend`       | React SPA admin dashboard                                              |
| `ripemetrics-preact-islands`     | Embeddable chat/review widgets                                         |
| `ripemetrics-ripe-extractors`    | Content extraction pipelines                                           |
| `ripemetrics-ripe-wp-plugin`     | WordPress plugin for widget embedding                                  |
| `ripemetrics-marketing-frontend` | Marketing website                                                      |
| `ripemetrics-ripe-changelog`     | Product changelog (Next.js + MDX)                                      |
