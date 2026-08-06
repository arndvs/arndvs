# MCRDSE — Content & Community Platform Portfolio Report

> Deep codebase audit of the MCRDSE content and community ecosystem — a content approval-and-shipping worker, an educational community site, and human-gated outreach automation. This report is the source document for the `/projects/mcrdse-content` case study.

## Overview

MCRDSE runs three brands — the shop, the Microdose Movement educational community, and a founder's content channel. The content ecosystem spans **3 repos** on a Cloudflare edge stack:

| Repo                  | Purpose                                               | Stack                                               |
| --------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| `MCRDSE-Content-Ship` | Content approval/shipping worker (content.mcrdse.com) | Single Cloudflare Worker, D1, R2, Access JWT        |
| `mcrdsemovement-site` | Educational site (mcrdsemovement.com)                 | Astro 6 static, Preact quiz, D1, GHL                |
| `mcrdse-outreach`     | CRM/outreach automation                               | Python + GHL CLI, Reddit listening, email sequences |

## Architecture

### Content Ship (single Cloudflare Worker)

- **~40 routes** in a hand-rolled regex router, server-rendered views, ~1 runtime dependency (jose).
- **D1** — ~250 scripts, ~130 research entries. **R2** — media, ZIPs, brand guides.
- **Cloudflare Access JWT** verification (issuer + audience, fails closed).
- **Zernio** downstream scheduling (feature-gated), **Linear** issue auto-create.

### Movement site (pure-static Astro)

- **8 Zod-typed content collections** (56 articles across 6 pillars), validated at build time.
- **Preact quiz island** — branching archetype quiz, 7 archetypes, weighted scoring.
- **Pages Functions** — contact, quiz-submit, apply, health, GHL webhook.
- **D1 as source of truth**, GHL as best-effort sink.

## Key Features

### Cryptographic approval locking (Content Ship)

- Each approve action **SHA-256-hashes** the exact copy, ordered slide identities, and final ZIP into a versioned manifest.
- **Edits invalidate the approval** centrally — a rejected script can't ship from a stale package.
- **Preflight panel** checks ordered slides, caption, CTA, ZIP before approve (READY / BLOCKED).
- **Approved-package ZIP streaming** returns **409 if the hash no longer matches** (drift detection).
- **Media-bearing Zernio drafts** with per-slide **HMAC-signed R2 URLs (1hr expiry)**.

### AI-Search (GEO) strategy (Movement)

- **Content-Signal protocol**: `search=yes, ai-input=yes, ai-train=no` — allows AI citation/RAG while blocking training-only crawlers.
- **Rich Person/BlogPosting/speakable JSON-LD** — E-E-A-T signal for AI citation systems on YMYL health content.
- **Gated lead-magnet PDFs** — content-addressable, doubly excluded from search (robots.txt + X-Robots-Tag).

### Branching archetype quiz (Movement)

- **Pure, immutable state machine** — initialState, answerQuestion, computeResult, goBack, resetQuiz.
- **Branching**: Q1 → 4 clusters → Q2 narrows → Q3 confirms/branches → Q4 locks → Q5 tiebreaker → Q6 data signal.
- **Weighted scoring** for secondary archetype; session persistence (1hr TTL); non-blocking submit.

### Human-gated outreach automation (outreach)

- **Reddit listening pipeline** — discovers public discussions, scores, drafts replies, exports a human-review queue. Never authenticates or posts.
- **Gated transactional workflow audit (MCR-71)** — read-only snapshot + staged, never-sent rebuild of purchase/shipping emails.
- **Winback/reactivation email sequences** — markdown-as-source-of-truth, deliverability-engineered (SPF/DKIM/DMARC, ramp schedules, abort thresholds).

## Scale / Metrics

| Metric              | Count                              |
| ------------------- | ---------------------------------- |
| Content repos       | 3                                  |
| Worker routes       | 40+                                |
| Scripts in D1       | ~250                               |
| Research entries    | ~130                               |
| Articles            | 56                                 |
| Archetypes          | 7                                  |
| Migrations          | 30+ (28 content-ship + 2 movement) |
| GHL email templates | 35                                 |
| Test lines          | 500+                               |

## Caveats (accuracy guardrails)

- **Outreach sequences** (winback/reactivation) are **drafted/staged, not sent** — blocked on human send. Frame as "designed and staged."
- **MCR-71** is a **gated audit** that sent 0 messages by design. Frame as "safety-gated transactional automation audit."
- **Reddit campaign** is **research-only** (account restricted). Frame as "human-gated listening/discovery pipeline."
- **GHL CLI** is **vendored** (Lead Gen Jay's tool) — the original engineering is the audit scripts, Reddit campaign, and email builders that extend it.
- **Movement quiz engine** has **zero automated tests** — a "what I'd do next" talking point, not a strength.
