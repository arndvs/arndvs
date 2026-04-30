# RipeMetrics Extractors — Portfolio Report

> Deep codebase audit of `ripemetrics-ripe-extractors-94405373c368` — an intelligent web scraping and content extraction pipeline built on Apify + Crawlee.

---

## Executive Summary

RipeMetrics Extractors is a **monorepo of independent Apify Actors** that form an intelligent website analysis pipeline. A master orchestrator validates URLs, detects website platforms (11 supported), selects optimal scraping strategies, and coordinates child extractors in parallel. Extractors analyze brand colors (via OpenAI Vision + algorithmic methods), discover legal policy links (with confidence scoring), scrape booking platform data, and crawl full-page content. Built in **TypeScript on Node.js 18** with Crawlee (Cheerio, Puppeteer, Playwright) and deployed as Docker containers on the Apify platform.

---

## Tech Stack

| Layer              | Technology                                                               |
| ------------------ | ------------------------------------------------------------------------ |
| Language           | TypeScript (ES2022, NodeNext modules)                                    |
| Runtime            | Node.js ≥18, Bun (orchestrator)                                          |
| Platform           | Apify (actor execution, datasets, key-value stores, proxies)             |
| Web Scraping       | Crawlee (CheerioCrawler, PuppeteerCrawler, PlaywrightCrawler)            |
| Browser Automation | Puppeteer (color-extractor), Playwright (orchestrator, policy-extractor) |
| HTML Parsing       | Cheerio                                                                  |
| HTTP Client        | got-scraping (anti-detection), axios (image download)                    |
| AI / LLM           | OpenAI GPT-4o Vision API (brand color analysis)                          |
| Image Processing   | Sharp, ColorThief, Canvas                                                |
| Build              | TypeScript compiler, tsx (dev runner)                                    |
| Containerization   | Docker (Apify base images)                                               |

---

## Architecture

### Monorepo of Independent Actors

Each actor is fully self-contained with its own `package.json`, `tsconfig.json`, Dockerfile, and `.actor/` config. They deploy independently via `apify push`.

```
ripemetrics-ripe-extractors/
├── orchestrator/           # Master orchestrator — coordinates all extractors
├── color-extractor/        # Brand color extraction via screenshot + AI
├── jane/                   # Jane App booking platform scraper
├── policy-extractor/       # Legal policy link detection
└── templates/              # 8 Apify actor starter templates
```

### Data Flow Pipeline

1. User provides a website URL to the **Master Orchestrator**
2. Orchestrator validates the URL and **detects the website platform** (WordPress, Shopify, React, Next.js, Wix, etc.)
3. Based on platform, it selects an optimal **scraping strategy** (Basic HTTP → got-scraping → Cheerio → Puppeteer → Playwright)
4. Orchestrator calls enabled child actors in **parallel by priority group** via `Actor.call()`
5. Each actor scrapes independently and stores results in **Apify Datasets**
6. Orchestrator **aggregates results** into a unified output and optionally fires a **webhook**

---

## Extractors

### Master Orchestrator

- **Actor ID**: `master-orchestrator`
- **Purpose**: Coordinates all extractors, validates websites, detects platforms
- **Key capabilities**:
    - URL validation and HTTP accessibility checking
    - Platform detection with confidence scoring (11 platforms)
    - Scraping strategy selection (6-tier escalation)
    - Priority-based parallel execution of child actors
    - Result aggregation into unified output
    - Webhook callback support
    - Proxy configuration (residential vs datacenter based on platform)
    - Cookie consent automation

### Color Extractor

- **Actor ID**: `arndvs/ripe-color-extractor`
- **Purpose**: Extracts brand colors from website header screenshots
- **How it works**:
    1. Launches headless Chrome via Puppeteer
    2. Navigates to URL, intercepts requests (allows only `document` + `image` resources)
    3. Takes a 1920×200px header screenshot (JPEG)
    4. Stores screenshot in Apify Key-Value Store
    5. **Dual extraction** (parallel):
        - **OpenAI GPT-4o Vision**: Sends screenshot to GPT-4o — "What is the most prominent brand color?" → returns hex code
        - **ColorThief**: Extracts dominant RGB color algorithmically → converts to hex
- **Output**: `{ url, screenshotUrl, brandColorOpenAI, brandColorColorThief }`

### Policy Extractor

- **Actor ID**: `arndvs/ripe-policy-extractor`
- **Purpose**: Finds legal policy links on any website
- **Detects 5 policy types**: Privacy Policy, Terms of Service, Cookie Policy, Return/Refund Policy, Disclaimer
- **How it works**:
    1. Uses CheerioCrawler (static) or PlaywrightCrawler (dynamic) based on strategy
    2. Searches common locations first (footer, header, `[role="contentinfo"]`, `.legal`)
    3. Falls back to scanning all `<a>` tags
    4. Pattern-matches link text and href against 15+ regex patterns
    5. Calculates **confidence score** per match (text match +0.6, href match +0.4, keyword bonus +0.2, penalties for blog/long text)
    6. Deduplicates by type, keeping highest-confidence match
    7. Resolves relative URLs to absolute
- **Output**: `{ sourceUrl, policies: [{ type, url, confidence, linkText, context }], metadata }`

### Jane App Scraper

- **Purpose**: Scrapes business data from Jane App booking platform (`*.janeapp.com`)
- **Uses**: CheerioCrawler with concurrency of 10
- **Extracts**: Phone numbers, email addresses, services (name, duration, price, description), team members (name, title, photo, bio), site domain, logo URL
- **Output**: `ScrapedData` with structured arrays for each data type

### Website Content Crawler

- **Actor ID**: `apify/website-content-crawler` (Apify's built-in actor)
- **Purpose**: Full-page content extraction with Markdown output
- **Config**: Fingerprinting, session pooling, memory management, post-navigation hooks (strip iframes/prefetch), cookie consent auto-acceptance

### Planned Extractors (Disabled)

| Extractor | Actor ID                          | Priority | Status   |
| --------- | --------------------------------- | -------- | -------- |
| Contact   | `arndvs/ripe-extractor---contact` | 1        | Disabled |
| FAQ       | `arndvs/ripe-extractor---faq`     | 2        | Disabled |
| Product   | `arndvs/ripe-extractor---product` | 2        | Disabled |

---

## Key Technical Patterns

### Platform-Aware Scraping Strategy Selection

6-tier strategy escalation based on detected platform requirements:

| Strategy       | When Used                                       |
| -------------- | ----------------------------------------------- |
| `BASIC_HTTP`   | Simple static sites                             |
| `GOT_SCRAPING` | Static sites with anti-bot measures             |
| `CHEERIO`      | Server-rendered HTML (WordPress, basic sites)   |
| `PUPPETEER`    | JavaScript-dependent sites                      |
| `PLAYWRIGHT`   | Anti-bot sites requiring browser fingerprinting |
| `TEST_RUNNER`  | Complex workflows with interaction              |

Requirements analysis considers: `needsJavaScript`, `isAntiBot`, `isDynamic`, `needsInteraction`, `complexWorkflow`.

### Platform Detection with Confidence Scoring

11 platform signatures detected:

| Platform    | Detection Method                                |
| ----------- | ----------------------------------------------- |
| WordPress   | `wp-content`, `wp-includes`, generator meta tag |
| Shopify     | `cdn.shopify.com`, `Shopify.` global            |
| Wix         | `wix.com`, `wixstatic.com`                      |
| Webflow     | `webflow.com` assets                            |
| Squarespace | `squarespace.com` assets                        |
| React       | `react`, `__REACT` globals                      |
| Next.js     | `__NEXT_DATA__`, `_next/` paths                 |
| Gatsby      | `gatsby`, `___gatsby` elements                  |
| Vue         | `__VUE__`, `vue.` scripts                       |
| Angular     | `ng-version`, `angular` scripts                 |
| Bubble      | `bubble.io` elements                            |

Confidence scoring: 40% match count + 60% unique indicators. Handles combo frameworks (e.g., Next.js + React → `nextjs_react`).

### Dual-Method Color Extraction

AI-powered (OpenAI Vision) + algorithmic (ColorThief) run in parallel for cross-validation. Screenshot cropped to header only (200px height) to focus on brand-relevant colors.

### Confidence-Based Policy Matching

Multi-factor scoring system with:

- Positive indicators: link text match (+0.6), href pattern match (+0.4), keyword bonus (+0.2)
- Negative indicators: blog content penalty, long text penalty
- Location-aware search: footer/header first, then full page fallback
- Deduplication keeps highest-confidence match per policy type

### Resource Optimization

- Request interception blocks non-essential resources (fonts, media, tracking)
- Post-navigation hooks strip iframes, prefetch links, prerender links
- Browser fingerprinting for anti-detection evasion
- Session pooling with domain-specific persistence
- Memory-conscious Chrome flags (`--max-old-space-size`)
- Proxy strategy per platform (residential for anti-bot sites, datacenter for JS-heavy)

---

## Input / Output Schemas

**Orchestrator Input** (JSON Schema):

- `url` (required) — Target website URL
- `maxTimeout` (1–300s, default 60) — Per-extractor timeout
- `retryCount` (0–5, default 3) — Retry attempts on failure
- `extractors` — Enable/disable individual extractors
- `webhookUrl` — POST aggregated results to callback URL
- `proxyConfiguration` — Proxy group selection

**Orchestrator Output**:

```
{
  url, extractedAt,
  websiteInfo: { validation, platform detection },
  results: { [extractorKey]: { success, data, error } },
  metadata: { successCount, totalCount }
}
```

---

## Templates (8 Starter Templates)

The repo includes 8 Apify actor starter templates for bootstrapping new extractors:

| Template                    | Crawler Type      | Runtime |
| --------------------------- | ----------------- | ------- |
| `ts-bun-cheerio`            | CheerioCrawler    | Bun     |
| `ts-cheerio`                | CheerioCrawler    | Node    |
| `ts-playwright`             | PlaywrightCrawler | Node    |
| `ts-puppeteer`              | PuppeteerCrawler  | Node    |
| `ts-bun-puppeteer`          | PuppeteerCrawler  | Bun     |
| `ts-crawlee-cheerio`        | CheerioCrawler    | Node    |
| `ts-standby-playwright`     | Standby mode      | Node    |
| `ts-test-runner-playwright` | Test runner       | Node    |

---

## Deployment & Infrastructure

- **Platform**: Apify Cloud — each actor deploys independently via `apify push`
- **Containers**: Docker using Apify base images (`apify/actor-node:18`, `apify/actor-node-puppeteer-chrome:18`)
- **No CI/CD pipeline** — manual deployment via Apify CLI
- **No test coverage** — all actors have placeholder test scripts

---

## Key Technical Achievements

1. **Intelligent scraping strategy selection** — 6-tier escalation from basic HTTP to full browser automation based on detected platform requirements
2. **Platform detection engine** — 11 platform signatures with weighted confidence scoring and combo framework handling
3. **AI-powered brand color extraction** — Dual-method approach: OpenAI GPT-4o Vision for semantic analysis + ColorThief for algorithmic extraction
4. **Confidence-based policy discovery** — Multi-factor scoring system with location-aware search, deduplication, and 15+ pattern matches across 5 policy types
5. **Orchestrator pattern** — Priority-based parallel actor execution with result aggregation and webhook callbacks
6. **Anti-detection engineering** — Request interception, browser fingerprinting, session pooling, resource blocking, proxy rotation
7. **Extensible architecture** — Monorepo of independent actors with shared templates for rapid extractor development

---

## Relationship to Other Repos

| Repo                              | Role                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| `ripemetrics-prod`                | Backend API — consumes extracted data for store onboarding |
| `ripemetrics-reputation`          | Consumer frontend — benefits from extracted brand colors   |
| `ripemetrics-ripe-changelog`      | Product changelog                                          |
| **`ripemetrics-ripe-extractors`** | **This repo — content extraction pipeline**                |
| `ripemetrics-app-frontend`        | Admin dashboard — may trigger extractions                  |
| `ripemetrics-preact-islands`      | Embeddable widgets                                         |
| `ripemetrics-ripe-wp-plugin`      | WordPress plugin                                           |
| `ripemetrics-marketing-frontend`  | Marketing website                                          |
