# AlignSD — Wellness & Chiropractic Platform Portfolio Report

> Deep codebase audit of `arndvs/alignsd` — a production website for AlignSD Family Chiropractic, serving as a full-service marketing, booking, patient intake, and content platform.

---

## Executive Summary

AlignSD is a **production healthcare marketing and patient intake platform** built on **Next.js 16 (App Router) + React 19 + TypeScript**. It serves a chiropractic, massage therapy, and wellness clinic in Mission Valley, San Diego. The site combines 60+ static pages with hundreds of programmatic local SEO pages, an AI-powered insurance verification system with OpenAI Vision document analysis, 7-layer defense-in-depth spam protection, 26 React Email templates, a modular JSON-LD schema library (~40 files), CRM integration (GoHighLevel), and a comprehensive test suite (~50+ test files). ~50,000–70,000+ estimated LOC across ~500–600+ source files, deployed on Vercel.

---

## Tech Stack

| Layer             | Technology                                                         |
| ----------------- | ------------------------------------------------------------------ |
| Framework         | Next.js 16.1.4 (App Router, Turbopack)                             |
| UI Library        | React 19.2.3                                                       |
| Language          | TypeScript 5.8.2                                                   |
| CSS               | Tailwind CSS 4.1.10                                                |
| CMS               | Sanity 5.21.0 + next-sanity 12.2.2 (Visual Editing, live preview)  |
| Component Library | shadcn/ui (Radix primitives, 30+ packages)                         |
| Animation         | Framer Motion 12.18.1                                              |
| Forms             | React Hook Form 7.55 + Zod 3.24                                    |
| Email             | React Email 4.0.15 + Resend 6.9.3                                  |
| Payments          | Stripe 18.5.0                                                      |
| AI                | OpenAI 5.17.0 (GPT-5.4-mini text, GPT-4.1 vision)                  |
| Monitoring        | Sentry 10.38.0 (Next.js)                                           |
| Analytics         | PostHog (client + server), Vercel Analytics, Vercel Speed Insights |
| CRM               | GoHighLevel (custom MCP client)                                    |
| Rich Text         | Lexical Editor 0.44.0 + Portable Text                              |
| State             | Zustand 5.0.8                                                      |
| Build             | Nx 21.2.1 (monorepo task orchestration with caching)               |
| Package Manager   | pnpm (workspace)                                                   |
| Testing           | Vitest 3.2.4 + Testing Library + happy-dom/jsdom                   |
| Hosting           | Vercel Pro (SFO1 region, 60s functions)                            |
| SEO Indexing      | IndexNow (Bing auto-propagation)                                   |

---

## Architecture

### Route Structure

Uses Next.js App Router with route groups:

- `(frontend)/(main)/` — All public pages (header/footer/announcement bar wrapper)
- `studio/` — Embedded Sanity Studio at `/studio`
- `api/` — ~28 API route directories
- `blog/` — CMS-driven blog with author pages, feed.xml
- `llms.txt/` — Machine-readable LLM site index
- `draft-mode/` — Sanity live preview / Visual Editing

### Public Pages (~60+ static + hundreds programmatic)

| Section              | Routes                            | Notes                                                                                               |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| Homepage             | `/`                               | 16 sections, JSON-LD @graph schema                                                                  |
| Services Hub         | `/services` + 4 disciplines       | Chiropractic, massage, wellness, specialized care, ~20+ sub-pages                                   |
| Proprietary Programs | Branded methods                   | Aligned Kids Method, Aligned Mommy Method, Aligned Wellness System, Infant Cranial Oral Assessments |
| Massage Therapy      | 9 individual types                | e.g. prenatal wellness, deep tissue release                                                         |
| Conditions           | `/conditions` + 6 categories      | Back pain, headaches/migraines, neck/shoulder, sports/repetitive stress                             |
| Areas/SEO            | `/areas/[neighborhood]/[keyword]` | Dynamic geo pages: ~15 neighborhoods × ~15 keywords = hundreds of programmatic pages                |
| Blog                 | CMS-driven                        | Sanity-powered with streaming Suspense                                                              |
| Patient Journey      | 5 pages                           | New patients, first visit, our process, insurance, schedule                                         |
| Resources            | Guides + interactive tools        | Interactive spine health explorer                                                                   |
| Clinical Outcomes    | 5 research pages                  | Prenatal chiropractic labor duration, Webster technique breech success                              |

### API Routes (~28 directories)

| Route                           | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `insurance-verification/`       | Multi-step AI verification with OpenAI Vision document analysis |
| `newsletter/`                   | Newsletter signup → Resend segments                             |
| `lead-magnet/`                  | Lead magnet delivery system                                     |
| `webhooks/form-submission/`     | Unified CRM webhook (GoHighLevel sync)                          |
| `webhooks/sanity-event-status/` | Sanity webhook → event approval emails                          |
| `webhooks/sanity-indexnow/`     | Sanity → IndexNow instant indexing on publish                   |
| `revalidate/`                   | On-demand ISR cache invalidation                                |
| `enhance-event*/`               | AI-powered event content enhancement (4 variants)               |
| `enhance-post*/`                | AI-powered blog post SEO enhancement                            |
| `review-insights/`              | AI review analysis pipeline                                     |
| `cron/refresh-event-dates/`     | Daily Vercel cron job                                           |
| `careers/application/`          | Career application intake                                       |

---

## Key Systems

### 1. Insurance Verification (Most Complex Feature)

~500+ LOC API route with:

- **Multi-step form wizard** — 5 steps: service selection → insurance provider → document upload → contact info → review
- **AI document verification** — OpenAI Vision (GPT-4.1) analyzes uploaded insurance cards and driver's license
- **Intelligent routing** — AI confidence → auto-approve (→ biller), needs review (→ front desk), spam detected (→ bizops)
- **Dual email delivery** — Resend (primary) + Gmail API fallback for biller emails
- **Slack notifications** — Rich block-format for every outcome
- **PostHog analytics** — Server-side event capture on submissions
- **Sentry spans** — Full observability with request context
- **Rate limiting** — 2 per IP per 24 hours
- **Background processing** — Vercel `after()` with timeout guards

### 2. Spam Protection (7-Layer Defense in Depth)

1. **Honeypot fields** — Hidden CSS trap fields + timing validation (min 2s)
2. **Rate limiting** — In-memory store with configurable windows per form type
3. **IPHub proxy/VPN detection** — Blocks non-residential IPs, Apple Private Relay whitelist
4. **Geo-blocking** — Form submissions restricted to US IPs (configurable)
5. **Manual IP blocklist** — CIDR range support
6. **Email validation** — Suspicious email detection + recently-blocked tracking
7. **AI spam detection** — OpenAI-powered cleaning service pitch detection

### 3. SEO Infrastructure

- **JSON-LD @graph schemas** — Modular, composable schema system (~40 files): Organization, LocalBusiness, Physician, MassageTherapist, FAQ, Event, Product, Service, MedicalCondition, MedicalProcedure, AggregateRating
- **Programmatic local SEO** — `[neighborhood] × [service|condition]` matrix generating hundreds of unique pages with custom content, driving directions, POI data, testimonials, and rollout guards (`ProductionPageGuard`)
- **llms.txt** — Machine-readable site index for LLM crawlers
- **IndexNow** — Instant search engine notification on Sanity content publish
- **Dynamic sitemap** — Rollout-aware XML sitemap filtering

### 4. Email System (26 Templates)

React Email templates covering:

- Insurance verification (patient, staff, spam, review, blocked, submitted)
- Contact form confirmations
- Newsletter welcome
- Career application confirmations
- Event approval/rejection
- Lead magnet delivery (birth plans, postpartum recovery, nutrient checklists)
- Patient reactivation, referral, first-visit follow-up
- Form submission failure alerts

### 5. AI Content Enhancement

- **Blog post enhancement** — Auto-generates SEO metadata, categories, tags, TL;DR
- **Event enhancement** — AI categorization + SEO for community events (4 endpoint variants)
- **Review insights** — AI analysis of Google reviews → stored in Sanity
- **Document verification** — Vision API for insurance card validation
- **Spam detection** — AI-powered cleaning service pitch detection

### 6. CRM Integration (GoHighLevel)

Custom MCP client with contact search/create/upsert, deduplication, custom field mapping (urgency, referral source, service interests), tag management, and webhook-triggered sync for all form submissions.

---

## Component Architecture

### UI Components — 120+ files

Full shadcn/ui implementation plus custom domain components:

- Hero variants (base, green, animation, journey, single-image)
- Insurance verification (15 files — complete multi-step dialog system)
- Testimonials (13 files — carousels, grids, cards, triple sections)
- Service cards, pricing filters, category navigation
- Floating reviews widget, announcement bar
- FAQ sections, table of contents, breadcrumbs
- Portable text editor, rich text editor
- Appointment CTA system, booking dialogs
- Background shader effects (`@paper-design/shaders-react`)

### Custom Hooks — 23

### Data Layer — 30+ static data files

All business data (phone, email, hours, address, services, pricing, team, neighborhoods, reviews) centralized in `src/lib/data/` and `src/lib/json-ld/core/` — single source of truth.

---

## Sanity CMS Schema

11 document/object types:

| Type               | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `post`             | Blog posts with SEO, categories, tags, TL;DR |
| `communityEvent`   | Events with approval workflow                |
| `author`           | Blog authors                                 |
| `category` / `tag` | Blog taxonomy                                |
| `pdfResource`      | Downloadable PDF resources                   |
| `resourceOrder`    | Resource delivery tracking                   |
| `reviewInsights`   | AI-generated review analysis                 |
| `blockContent`     | Rich text Portable Text                      |
| `seoType`          | Reusable SEO fields                          |

---

## Testing (~50+ test files)

| Directory            | Count    | Focus                                                                                                                                                               |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/unit/`        | 30       | Insurance verification, email validation, rate limiting, career application, contact deduplication, geo-blocking, Slack, IPHub, PostHog, failure alerts, MCP client |
| `tests/integration/` | 10       | Webhook, rate limiting, insurance verification, career application, areas pages, form SOP compliance                                                                |
| `tests/seo/`         | 8        | Content uniqueness, linking, page generation, performance, rollout strategy, schema validation, visual regression                                                   |
| `tests/e2e/`         | ~2       | Integration health checks                                                                                                                                           |
| `src/**/__tests__/`  | Multiple | Co-located unit tests for JSON-LD, Sanity queries, form components, lead magnets                                                                                    |

---

## CI/CD & DevOps

### GitHub Actions — 4 workflows

1. `deploy-production.yml` — Production deployment
2. `pr-check.yml` — PR validation
3. `schema-validation.yml` — Sanity schema checks
4. `seo-tests.yml` — SEO test suite

### Performance Audit Scripts — 6 custom audits

Async waterfalls, bundle imports, client components, event listeners, Suspense boundaries, re-renders.

---

## Integration Points

| Service       | Purpose                                        |
| ------------- | ---------------------------------------------- |
| Sanity        | CMS, Visual Editing, webhooks                  |
| Vercel        | Hosting, Edge, Cron, Analytics, Speed Insights |
| OpenAI        | GPT-5.4-mini (text), GPT-4.1 (vision)          |
| Resend        | Transactional email, newsletter segments       |
| Gmail API     | Backup biller email via OAuth                  |
| GoHighLevel   | CRM contact management                         |
| Stripe        | Payment processing                             |
| Slack         | Notification webhooks                          |
| PostHog       | Product analytics, session replays             |
| Sentry        | Error monitoring, performance tracing          |
| IPHub         | Proxy/VPN detection                            |
| IndexNow/Bing | Instant search engine indexing                 |
| Jane App      | Appointment booking (external)                 |

---

## Key Engineering Highlights

1. **AI-powered insurance verification** with OpenAI Vision document analysis, intelligent routing, dual email delivery (Resend + Gmail fallback), and full observability (Sentry spans, PostHog events, Slack notifications).

2. **Programmatic local SEO at scale** — ~15 neighborhoods × ~15 keywords = hundreds of unique pages with custom content, driving directions, POI data, JSON-LD schemas, and rollout guards.

3. **JSON-LD schema library** — ~40 files producing modular, composable structured data including medical schemas (MedicalCondition, MedicalProcedure, Physician).

4. **7-layer spam protection** — honeypot, rate limiting, IPHub proxy detection, geo-blocking, email validation, AI spam detection, IP blocklist — with Apple Private Relay whitelisting.

5. **26 React Email templates** — production-quality transactional emails covering every form type and notification scenario.

6. **llms.txt endpoint** — forward-thinking LLM-readable site index dynamically generated from CMS content.

7. **Next.js 16 + React 19** — cutting-edge framework versions with server actions, `after()` background processing, streaming Suspense, and Turbopack.

8. **Custom performance audit suite** — 6 automated audits covering async waterfalls, bundle analysis, client components, event listeners, Suspense boundaries, and re-renders.

---

## Portfolio Relevance

| Dimension        | Detail                                                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| **Scale**        | ~50K–70K LOC, ~500–600+ source files, 120+ components, 28 API routes, 26 email templates       |
| **Architecture** | Next.js 16 App Router, programmatic SEO at scale, modular JSON-LD schema system                |
| **AI**           | OpenAI Vision document analysis, AI content enhancement, AI spam detection                     |
| **Full Stack**   | React 19 frontend, API routes, Sanity CMS, CRM integration, email delivery, payment processing |
| **DevOps**       | 4 GitHub Actions workflows, Vercel cron jobs, 6 performance audit scripts                      |
| **Testing**      | 50+ test files across unit, integration, SEO, and E2E                                          |
| **Security**     | 7-layer spam defense, rate limiting, geo-blocking, proxy detection, AI fraud detection         |
