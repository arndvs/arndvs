# RISE Awake — Production Next.js Application Portfolio Report

> Deep audit of `arndvs/rise-awake` — a production Next.js 16 corporate website for a fictional smart bed company, serving as the companion transmedia piece to the PUSH short film.

---

## Executive Summary

RISE Awake is a **41-route Next.js 16 application** operating as the fully realized corporate web presence of RISE Technologies, Inc. — a fictional company that manufactures autonomous push beds. The site plays the fiction completely straight: product pages with 3-tier pricing, investor relations with dynamic financials, 6 legal documents that reward reading the fine print, a 12-stage product activation configurator, a careers section with functional application forms backed by Convex, an internal document system hiding 22 corporate documents behind zero authentication, and a real AI image generation tool ("RISE Render") for producing the PUSH short film's visual assets.

**~44,000 lines of TypeScript/TSX** across 230 files. **276 commits** over 22 days (April 7–28, 2026). Solo developer. The stack is production-grade: Next.js 16, React 19, TypeScript, Tailwind v4, Sanity v5 CMS, Convex real-time backend, Clerk authentication, ImageKit CDN, OpenAI image generation, Resend transactional email, Recharts data visualization, and a 5-layer anti-spam system ported from the AlignSD project.

The comedy is never in the writing being funny. It's in the writing being perfectly earnest about something absurd.

---

## Project Statistics

| Metric               | Value                      |
| -------------------- | -------------------------- |
| Total Lines of Code  | ~44,000                    |
| TypeScript/TSX Files | 230                        |
| Commits              | 276                        |
| Timeline             | April 7–28, 2026 (22 days) |
| Contributors         | 1 (Aaron Davis)            |
| Public Routes        | 33                         |
| Internal Routes      | 8                          |
| API Routes           | 6                          |
| React Components     | 70                         |
| Sanity Schema Types  | 4                          |
| Convex Tables        | 5                          |
| Email Templates      | 5                          |
| Easter Eggs          | 4+                         |

---

## Code Distribution

| Directory           | Lines  | Purpose                             |
| ------------------- | ------ | ----------------------------------- |
| `src/app/(site)/`   | 14,003 | Public-facing pages (33 routes)     |
| `src/app/internal/` | 9,668  | Internal document system (8 routes) |
| `src/components/`   | 11,517 | Shared components (70 files)        |
| `src/lib/`          | 3,406  | Utilities, data, and business logic |
| `src/app/(studio)/` | ~2,000 | RISE Render AI image generator      |
| `convex/`           | 1,116  | Real-time backend (schema + CRUD)   |
| `src/sanity/`       | 972    | CMS configuration and queries       |
| `src/emails/`       | 785    | Transactional email templates       |
| `src/app/api/`      | 653    | API routes                          |
| `src/styles/`       | 308    | Tailwind design system              |

---

## Tech Stack

### Frontend

- **Next.js 16** with App Router, React 19, Server Components
- **Tailwind CSS v4** — custom design system with adaptive semantic colors (teal primary, coral accent)
- **shadcn/ui** — 22 UI primitives (dialog, command palette, sidebar, etc.)
- **DM Sans** (body) + **DM Serif Display** (headlines) — brand typography
- **Recharts** — interactive charts on the financials page
- **Custom SVGs** — hand-drawn bed illustrations, remote illustrations, bed silhouettes per product

### Backend

- **Convex** — real-time database for media assets, comments, projects, prompt categories, job applications
- **Sanity v5** — CMS for blog (posts, authors, categories, blockContent)
- **Clerk** — authentication for RISE Render (studio area)
- **OpenAI** — DALL-E 3 and gpt-image-1 for AI image generation
- **ImageKit** — CDN with URL-based image transformations (background removal, upscale, crop)
- **Resend** — transactional email (referral, application confirmation, spam alerts)

### Infrastructure & Security

- **5-layer anti-spam** — rate limiting, honeypot fields, IPHub VPN/proxy detection, suspicious email detection, banned word filter
- **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Slack webhooks** — real-time alerts for blocked submissions and successful form completions
- **Content moderation** — banned word filter for AI prompts (~30 terms with word-boundary matching)

---

## Site Architecture

### Route Map

#### Public Pages (33 routes)

```
/                           Homepage — hero, product grid, referral
/about                      Company history timeline (2009–present), 4 principles
/products/push              Product page — 3 tiers, waitlist, specs, PM-1 remote
/products/nudge             Discontinued first-gen product
/move                       RISE Move teaser (vertical navigation)
/activate                   12-stage activation configurator
/blog                       CMS-powered blog (Sanity)
/blog/[slug]                Individual blog posts
/blog/feed.xml              RSS feed
/careers                    6 job openings with custom form fields
/careers/apply              Full application form (Convex + resume upload)
/help                       FAQ, warranty, contact form
/press                      4 press releases
/enterprise                 Corporate sales with 3 case studies
/sdk                        DataKit SDK portal (3 tiers)
/status                     System status with 14 services + incident history
/changelog                  Firmware changelog (v3.x–v4.x)
/data-request               10-step Kafkaesque data access process
/index-score                RISE Index scoring system
/investors                  IR hub with metrics and announcements
/investors/shareholder-letter   CEO letter (Dr. Eleanor Voss)
/investors/annual-report    FY2024 annual report with risk factors
/investors/financials       Interactive charts (Recharts)
/investors/meeting-minutes  AGM minutes with Q&A
/investors/vision           Vision 2045 (5/10/20 year horizons)
/investors/press            10 press quotes
/legal                      Legal hub (6 documents)
/legal/terms                25-section Terms of Service
/legal/privacy              31-section Privacy Policy
/legal/push-mode-eula       19-section Push Mode EULA
/legal/sleep-data-policy    14-section Sleep & Environmental Data Policy
/legal/autonomous-navigation 11-section Autonomous Navigation Disclosure
/legal/disclaimer           8-section General Disclaimer
/security                   Security posture with certifications
/security/trust-center      Trust Center (coming soon)
/remote                     Interactive PM-1 remote simulator
/sitemap.xml                Dynamic sitemap
/robots.txt                 Dynamic robots
```

#### Internal Pages (8 routes, intentionally unprotected)

```
/internal                   Dashboard with breach tracker
/internal/documents         Document index with classification badges
/internal/docs/[slug]       22 individual documents with breach tracking
/internal/applications      Job application review (fictional entries only)
/internal/dataroom          Virtual due diligence data room (3 documents)
/internal/incidents         Push Mode incident tracker (6 incidents)
/internal/users             3 hardcoded users (Voss, Park, Arvin)
/internal/settings          Settings page where every toggle reverts after 1 second
/internal/waitlist          340,847 entries, 47-year estimated wait time
/internal/media             Real media review gallery (Convex-backed)
```

#### API Routes (6)

```
POST /api/generate          AI image generation (OpenAI, Clerk auth)
POST /api/careers/application   Job application submission (Convex + Resend)
POST /api/refer             Referral email (5-layer spam prevention)
GET  /api/identity          Anonymous reviewer ID (SHA-256 hashed IP)
GET  /api/ip                Raw visitor IP for breach tracker
GET  /api/upload-auth       ImageKit upload authentication tokens
```

---

## The Fictional Universe

### RISE Technologies, Inc.

| Fact                 | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| Founded              | 2009                                                      |
| CEO                  | Dr. Eleanor Voss (PhD Behavioral Sleep Science, Stanford) |
| General Counsel      | James Park (ex-FTC)                                       |
| CPO                  | Dr. Mara Chen (11 of 23 patents)                          |
| CFO                  | Thomas Ellery (ex-Goldman)                                |
| CTO                  | Vacant since December 14, 2020                            |
| Employees            | 312                                                       |
| HQ                   | San Francisco                                             |
| FY2024 Revenue       | $89.4M (+134% YoY)                                        |
| Gross Margin         | 68%                                                       |
| Waitlist             | 340,000+                                                  |
| Push Mode Compliance | 98% (vs Nudge 74%)                                        |
| IPO                  | S-1 filed April 2025, anticipated Q3 2026                 |
| Series C             | $120M (November 2024)                                     |
| Sensor Array         | 2,048 sensors, 64×32 grid, 2.5cm spacing                  |
| Audio Pickup         | 8-meter radius, 4-second buffer, retained 7+ years        |
| Active Markets       | 14 countries + 75 planned                                 |
| Company Motto        | "This is a feature, not a limitation."                    |

### Product Line

| Product            | Gen | Price   | Status         | Compliance | Off Switch               |
| ------------------ | --- | ------- | -------------- | ---------- | ------------------------ |
| RISE Nudge (RN-01) | 1st | $2,499  | Discontinued   | 74%        | Yes (later reconsidered) |
| The PUSH           | 2nd | $4,999  | Sold Out       | 98%        | No                       |
| The PUSH+ Select   | 2nd | $7,499  | Sold Out       | 98%        | No                       |
| The PUSH+          | 2nd | $12,999 | Sold Out       | 98%        | No                       |
| RISE Move          | 3rd | TBD     | In Development | TBD        | No                       |

### Product History (About page timeline, 2009–2021)

The About page traces a decade of failed products — 12 named products across 10 years — each with a deadpan "Outcome:" line that makes the failure feel clinically observed:

- **RISE Ambient** (2011) — played nature sounds → 0% compliance
- **RISE Alarm** (2012) — industrial decibels → 94% failure rate
- **RISE NudgeTone** (2014) — made the problem _worse_ (+23min additional sleep)
- **NudgeBar** (2016) — horizontal bar across the lower third → 74% compliance, cult following
- **RISE Nudge** (2019) — consolidated, included an off switch
- **RISE Push** (2021) — removed the off switch → 98% compliance

### Key Characters (narrative-relevant)

| Character            | Details                                                                                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dr. Eleanor Voss** | Founder. 31.2% voting control (Class B, 10x). Uses Push Mode daily. Hasn't taken a photo since 2019. 4 feedback modes. Wrote shareholder letter at 6:47am. |
| **James Park**       | General Counsel. Ex-FTC. Last login: "Yesterday."                                                                                                          |
| **Arvin Reyes**      | Former developer. Departed August 12, 2024. Session token still active. Auth middleware 80% complete. Every admin page references his unfinished work.     |
| **Karen**            | Referenced across site. "Had the Nudge. It made her a VP."                                                                                                 |
| **Dave**             | The PUSH film protagonist. "Did not consent to this film. Arrived at work on time. Results typical."                                                       |

---

## Technical Deep Dives

### 1. The Internal Document System (~9,700 lines)

The most technically ambitious narrative feature. `/internal/` is an 8-route admin panel that's intentionally unprotected — the joke is that Arvin never finished the auth middleware.

**Document Architecture:**

- 22 hardcoded documents in `internal-docs.ts` (650 lines) with full metadata: ID, title, classification, author, department, dates, status, related docs, summaries, word counts
- 4 classification levels: INTERNAL (7), CONFIDENTIAL (8), RESTRICTED (4), DR. VOSS EYES ONLY (1)
- Dynamic access logs — staff access times computed from current time with seeded PRNG (mulberry32) for deterministic-per-hour randomness; visitor's real IP shown alongside fictional staff entries

**Breach Tracker (`internal-tracker.ts`, 175 lines):**

- Persistent visitor tracking via localStorage — records every document accessed (id, slug, title, firstSeen, lastSeen)
- Escalating narrative prose based on access count:
    - 1 doc: factual notification
    - 2–3 docs: lists accessed document IDs
    - 4–5 docs: "IT security has been aware for some time"
    - 6+ docs: "They have always been accessible"
- Session name in sessionStorage (ephemeral), tracking in localStorage (permanent) — "The asymmetry IS the joke."

**Dynamic Time System (`internal-time.ts`, 160 lines):**

- `daysSinceArvin()` / `sprintsSinceArvin()`: computed live from Aug 12, 2024
- `vossLoginTime()`: "Today, [1–4h ago]" — makes her feel present
- Seeded PRNG ensures consistent values within each hour but different across hours

**Notable Pages:**

- **Settings** — every toggle reverts after 1 second. 2FA enables then disables. Access control always reverts to "public."
- **Users** — Arvin's account: "Active (should be Inactive)", session token active, no expiry, "The function that would check it was never written."
- **Waitlist** — 340,847 entries. Export CSV: "File: waitlist_340847_entries.csv (0 bytes). — arvin"
- **Data Room** — Certificate of Incorporation showing CTO position made optional same day as CTO separation agreement. Cap table showing $143K operating balance (6 days of runway) before bridge round.

### 2. The Activation Configurator (12 stages, /activate)

A single-page interactive flow with ~300 lines of custom UI:

- **Stages:** The Person → The Household → The Bedroom → The Morning Sequence → Environment Mapping → Departure Configuration → The Closet → The Kitchen → Habits & Tendencies → Scheduling → Emergency Protocols → Review & Activate
- **Custom components:** `IntensityDial` slider (Gentle → Standard → Committed → Non-Negotiable), `BedSilhouette` SVG that rotates with intensity, drag-and-drop morning sequence ordering
- **8 acknowledgments** required at final stage
- The bed "cannot see your outfit. It infers correctness from time and behavior."

### 3. RISE Render — AI Image Generation Tool (~2,000 lines)

A real, functional tool embedded in the studio area for producing PUSH film visual assets.

**Architecture:**

```
User (Clerk auth) → Prompt Builder (categories + options)
    → POST /api/generate (OpenAI DALL-E 3 / gpt-image-1)
    → Save to ImageKit CDN → Save metadata to Convex
    → Gallery view with grid/table toggle
    → Quick-edit panel (URL-based transforms: crop, upscale, bg-remove)
    → Status workflow: draft → ready_for_review → approved/rejected
    → Anonymous review system (SHA-256 hashed IP identity)
    → Comment threads per asset
```

**Features:**

- Prompt builder with 9 seeded categories (39 styles, 32 genres, 21 places, 18 camera settings, 17 artists, etc.)
- Character sheet mode for structured multi-angle reference prompts
- Size/quality selectors, batch generation (up to 4 images)
- Daily allocation tracking (localStorage, resets at UTC midnight)
- Banned word filter (~30 terms) for content moderation
- Anonymous media review at `/internal/media` — reviewers can approve/reject without auth

### 4. Legal Document System (6 documents, 108 sections)

| Document              | Sections | Highlights                                                                          |
| --------------------- | -------- | ----------------------------------------------------------------------------------- |
| Terms of Service      | 25       | §20 Free Will Acknowledgment, §23 The Off Switch                                    |
| Privacy Policy        | 31       | 2,048-sensor array, 8m audio pickup, relationship status inference                  |
| Push Mode EULA        | 19       | 4 separate acknowledgment sections, "no version will ever have an off switch"       |
| Sleep Data Policy     | 14       | Movement taxonomy, relationship inference, Appendix C (NDA-restricted)              |
| Autonomous Navigation | 11       | Solo return commute, 0.3s elevator detection, "Dogs have been observed to interact" |
| Disclaimer            | 8        | Liability cap: lesser of purchase price OR (Index score × hourly wage)              |

### 5. Investor Relations (7 pages + interactive charts)

A complete IR suite with internally consistent financials:

- **Revenue trajectory:** $2.1M (FY2020) → $38.2M (FY2023) → $89.4M (FY2024)
- **Dynamic financials:** `temporal.ts` generates fiscal year labels from the current date so numbers never feel stale
- **Interactive Recharts:** revenue bars, waitlist vs. units shipped, NPS trend, compliance comparison, unit economics
- **8 risk factors** in the annual report (regulatory, single mode dependency, audio data, autonomous navigation incidents, occupancy data, waitlist concentration)
- **Leadership:** 4 C-level execs with bios, CTO position vacant with backstory
- **AGM minutes:** 5 resolutions including "Proposal to Add Push Mode Override" — defeated (3% in favour). Q&A including "My wife says our Push is following her to work. Is that expected behavior?" → "Yes. Next question."
- **Vision 2045:** 20-year roadmap where snooze becomes "historical" and Push Mode is defended in court in 7 jurisdictions

### 6. Anti-Spam Architecture (5 layers, ported from AlignSD)

```
Request → Rate Limiter (sliding window, 5/24h)
    → Honeypot Validator (4 hidden fields + timing check ≥3s)
    → IPHub VPN/Proxy Detection (iCloud Private Relay whitelisted)
    → Suspicious Email Detection (dot-stuffing, vowel ratio, disposable domains)
    → Banned Word Filter (word-boundary matching)
    → Accept / Silent Reject
    → Slack notification + spam alert email on block
```

### 7. The PM-1 Remote Simulator (/remote)

A full-screen interactive remote rendered in CSS:

- Single glowing button on a matte black body with etched RISE wordmark
- State machine: idle → activating → routing → complete
- 11-step timed routing sequence with deadpan status messages ("Calibrating nudge force...", "Coffee detected. Vessel: unknown.", "Push Mode complete. Have a productive day.")
- `beforeunload` handler during active state: "Push Mode cannot be interrupted once initiated."
- Film grain texture overlay, idle glow pulse animation

---

## Easter Eggs

| Trigger                    | Effect                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Konami code (↑↑↓↓←→←→BA)   | Grayscale + grain overlay + banner: "Push Mode override requested. Override not available. _This is a feature, not a limitation._" |
| Typing "push" in any input | Document title flashes "Push Mode: Active" for 2 seconds                                                                           |
| 404 page (internal)        | Nearly invisible link (opacity 0.04, 1px font) to `/internal/docs/arvin-final-commit`                                              |
| Breach tracker             | Escalating narrative prose as you access more internal documents                                                                   |

---

## Design System

### Typography

- **DM Serif Display** — headlines, display text
- **DM Sans** — body, UI text
- **Inter** — fallback

### Color Palette

- **Primary (brand):** Teal
- **Accent:** Coral CTA buttons
- **Foreground hierarchy:** strong → default → secondary → muted (4 levels)
- **Surfaces:** page, surface, card (3 levels)
- **Adaptive:** full light/dark mode support via CSS custom properties

### Component Library

- 22 shadcn/ui primitives (dialog, command, sidebar, tooltip, etc.)
- 11 CMS admin components (shell, sidebar, topbar, data table, stat cards, etc.)
- 3 layout components (InvestorLayout, LegalLayout, CmsShell)
- Custom SVGs: bed illustrations, remote, bed silhouette (per-product variants)

---

## Narrative Architecture

### The Three Layers

1. **Public Layer** (33 routes) — Corporate website playing the fiction straight. A visitor could browse every page and never be sure it's satire. Product pages, pricing, investor relations, legal documents — all real enough to be real.

2. **Internal Layer** (8 routes) — The accidental exposure. "Arvin deployed without auth." Documents reveal the company from the inside: marketing playbooks based on StoryBrand and Halbert Method, incident logs of beds following users, resignation letters, engineering headcount changes. The breach tracker watches you watching them.

3. **Production Layer** (RISE Render) — The real tool. Not fictional. Generates AI images for the PUSH short film, manages assets in Convex, enables anonymous review. The boundary between the fiction and the production tool that makes the fiction is deliberately blurred.

### Narrative Consistency

Every page contributes to a single coherent fiction. Details introduced on one page are referenced on others:

- The **CTO vacancy** (December 14, 2020) appears in: annual report leadership section, job listings (ENG-003 references Arvin's unfinished auth), data room (Certificate of Incorporation Amendment 4), users page (Arvin's active session), settings page ("Auth Middleware: Not implemented")
- **Karen** appears in: about page ("Had the Nudge. Made her a VP"), shareholder letter, meeting minutes
- **Arvin** appears in: every internal page (comments, timestamps, unfinished features), careers ENG-003, users page, settings page, the 404 easter egg
- **Appendix C** (contents unknown, NDA-restricted) is referenced across: legal hub, privacy policy, sleep data policy, meeting minutes, data request process
- **340,000 waitlist** is referenced across: homepage, investor hub, shareholder letter, annual report, financials, waitlist admin, careers page, enterprise page

---

## CMS & Content Management

### Sanity v5 (Blog)

- 4 schema types: post, author, category, blockContent
- Blog queries via `defineQuery` + `sanityFetch`
- Featured posts system (max 3, custom validation)
- RSS feed generation
- Studio at `/cms`

### Convex (Application Data)

- 5 tables: media, mediaComments, projects, promptCategories, applications
- Status workflow engine for media assets
- Creator-only mutations with Clerk auth
- Anonymous reviewer support via hashed IP identity
- Fictional flag on applications (public queries only return fictional=true)
- Seed scripts for prompt categories (160+ options across 9 categories) and project data

---

## Security Posture

### Real Security (implemented)

- Clerk authentication for RISE Render
- Rate limiting (sliding window, in-memory)
- Honeypot anti-bot system (4 hidden fields + timing validation)
- IPHub VPN/proxy detection (iCloud Private Relay whitelisted, fails open)
- Banned word content moderation
- Security headers (X-Content-Type-Options, X-Frame-Options, CSP-adjacent)
- Upload validation (type + size limits for resumes)
- Convex `generateUploadUrl` requires shared secret

### Fictional Security (the joke)

- SOC 2: "Pending" (submitted Q3 2023)
- ISO 27001: 14/93 controls implemented
- GDPR: "Acknowledged"
- CCPA: "Noted"
- Access control default: Public
- Incident response: 91% resolution rate. "Remaining 9% monitored since Q3 2022."
- RBAC tiers include "Dr. Voss Eyes Only"
- Pen testing schedule: "As needed"

---

## Careers System

6 fictional job openings with deeply crafted descriptions, each contributing to the lore:

| ID        | Title                                | Key Detail                                                                          |
| --------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| ENG-001   | Staff Engineer, Staircase Navigation | "The problem is the stairs." Starting from approximately zero.                      |
| ENG-002   | Senior Data Engineer                 | 47K devices, 2,048 sensors each, audio classification "Other" category under review |
| ENG-003   | Platform Engineer, CMS               | Arvin's 80%-complete auth middleware, data room publicly accessible                 |
| LEGAL-001 | Associate General Counsel            | Autonomous vehicle classification, audio data class action                          |
| MKTG-001  | Marketing Manager                    | Blog from pest control template, 340K waitlist with 0 unsubscribes                  |
| OPS-001   | EA to CEO                            | Fixed morning commitment (Push Mode), no photos since 2019                          |

Each role has custom form fields (multiselect, boolean, scale, textarea) plus a functional application flow: form validation → honeypot check → resume upload to Convex → confirmation email → internal notification email → Slack alert.

---

## Research & Typography Audit

A 130-line `research.md` documents a typography and readability audit comparing RISE against AI Hero (aihero.dev) and Rize Home (rizehome.com). Key findings:

- 163 instances of `text-sm` (14px) vs only 18 of `text-base` (16px) — body copy too small
- No emphasis hierarchy in dark mode (body and headings near-identical brightness)
- Cold neutral grays (pure gray, no warmth)
- 4 proposed slices: body text size, emphasis hierarchy, warm grays, content width

---

## Email Templates (5)

| Template                       | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `referral-to-friend.tsx`       | Referral invitation to friend            |
| `referral-confirmation.tsx`    | Confirmation to referrer                 |
| `application-confirmation.tsx` | Job application receipt                  |
| `application-notification.tsx` | Internal notification of new application |
| `spam-alert.tsx`               | Alert for blocked spam submissions       |

---

## Deployment & Build

- **Hosting:** Vercel (inferred from Next.js 16 + Convex integration)
- **CMS:** Sanity hosted (project ID in env)
- **Database:** Convex Cloud
- **CDN:** ImageKit for generated images
- **Email:** Resend
- **Auth:** Clerk
- **Monitoring:** Slack webhooks for form submissions and spam alerts

---

## Relationship to PUSH

RISE Awake is the companion transmedia piece to the PUSH short film (`arndvs/push` repo). The relationship:

- **The film** is a marketing video "produced by" RISE Technologies
- **The website** is RISE Technologies' corporate presence — it exists to make the film's world feel real
- **RISE Render** is the actual production tool — generates AI images/video assets for the film
- **The internal documents** are the company's actual documents that got accidentally exposed
- **The legal documents** are the real terms of the product from the film
- The two repos share consistent lore: product specs, character details, financial numbers, timeline dates

The boundary between fiction and production tool is deliberately blurred — the same app that sells the fictional bed also generates the assets for the film about the bed.

---

## What This Demonstrates

1. **Full-stack architecture** — Next.js 16 App Router, React 19, 3 backend services (Sanity + Convex + Clerk), 6 API routes, 5 email templates, real-time data
2. **Product thinking** — 41 routes of internally consistent fiction maintaining corporate sincerity
3. **Security engineering** — 5-layer anti-spam, content moderation, auth workflows, safe anonymous access patterns
4. **Narrative design** — 22 internal documents, escalating breach tracker, dynamic time system, lore consistency across every page
5. **Design system** — Adaptive semantic color tokens, dark/light mode, custom SVGs, component library
6. **Creative technology** — AI image generation pipeline, URL-based image transforms, anonymous review workflow
7. **Attention to detail** — Every toggle that reverts after 1 second, every "— arvin" comment, every fiscal year that auto-updates, every FAQ answer that plays it straight
