# MCRDSE — E-Commerce & Loyalty Platform Portfolio Report

> Deep codebase audit of the MCRDSE commerce ecosystem — a 6-repo Cloudflare edge stack for a functional-mushroom supplement brand. This report is the source document for the `/projects/mcrdse-commerce` case study.

## Overview

MCRDSE (Treehouse Wellness Collective LLC) is a functional-mushroom supplement brand selling Focus Dose, Bliss Dose, Pure Dose, and Awaken products. The commerce ecosystem spans **6 repositories** (~1,400 commits, Mar 2026 – present) on a fully self-hosted Cloudflare edge stack:

| Repo                  | Purpose                               | Stack                                                    |
| --------------------- | ------------------------------------- | -------------------------------------------------------- |
| `mcrdse-site`         | Storefront (mcrdse.com)               | Astro 6 SSR, D1, Authorize.net, ShipStation, GHL, Resend |
| `mcrdse-ops`          | Ops dashboard (operations.mcrdse.com) | Astro 5 SSR, D1, R2, 4-system reconciliation             |
| `mcrdse-super-market` | Second storefront (mcrdse.shop)       | Cloudflare Pages + Functions, D1, member gate            |

## Architecture

```
Browser → Cloudflare Pages (Astro SSR + static HTML)
            → Pages Functions / API routes (cart intent, checkout, webhooks)
              → Authorize.net Accept Hosted (payments) + Stripe fallback
              → Cloudflare D1 (orders + subscriptions + loyalty ledger, source of truth)
              → ShipStation (fulfillment)  +  GoHighLevel (contacts / CRM / email)
```

- **D1 is the single source of truth.** All external systems (Authorize.net, GHL, ShipStation) are reconciled _against_ the `orders` table — never treated as authoritative.
- **Dual storefronts.** mcrdse.com (Astro) and mcrdse.shop (standalone HTML package) are fully isolated — separate D1, checkout, cart, webhooks, and `storefront` tags.
- **Dual payment processors.** Authorize.net Accept Hosted is primary, Stripe is a selectable fallback via `CARD_PROCESSOR`, with a Cash App/Venmo-only kill switch.

## Key Features

### Loyalty program (flagship)

- **Append-only `points_ledger`** — balance is always derived (SUM of deltas), never stored, so concurrent writes can't clobber it and every movement is auditable.
- **Earn ceremony** — `ensureAccount` → `computeEarnTxn` (pure, DB-free) → idempotent `recordLedger` → advance `lifetime_spend` → tier log → `maybePayReferral`.
- **Tier boundaries** — Spore ($0, 10 pts/$1) → Mycelium ($200, 15 pts/$1) → Fruiting Body ($500, 20 pts/$1), driven by lifetime spend.
- **Atomic redemptions** — `INSERT ... SELECT ... WHERE (SUM(delta)) >= cost` prevents double-spend under concurrency.
- **Idempotency keys** — `earn:<orderRef>`, `welcome:<email>`, `referral:<friend>`, `redeem:<redemptionId>` make webhook retries no-ops.
- **Passwordless auth** — magic-link tokens (256-bit, hashed, single-use, 15-min TTL) + HMAC-signed session cookies (90-day, Web Crypto).
- **Canonical economics** — generated `economics.ts` shared across both repos so they can't drift.

### Fail-closed fulfillment

- **Allow-list ship gate** — `SHIPPABLE_STATUSES` (authorizedPendingCapture, capturedPendingSettlement, settledSuccessfully). Anything else is not shippable. Fixed a real incident that shipped ~$381 to non-payers.
- **DB-as-gate verification** — alt-payment orders can't be pushed to GHL/ShipStation until `payment_verified = 1` in D1, enforced per-push.
- **Proof validation** — strict base64 JPEG-only, 6 MB cap, stored in R2.

### Idempotent reconciliation

- **Ingest ceremony** — the only authoritative way orders enter D1. Authenticated (X-Ingest-Secret), idempotent (payment reference or synthesized dedup key), migration-tolerant.
- **Adopt-don't-duplicate** — GHL looks up by email then phone; ShipStation upserts by orderNumber; renewals use transId-keyed order numbers.
- **Independent dispatch** — GHL and ShipStation dispatched independently so an outage in one doesn't starve the other; failures land in `audit_log`.
- **Dual-run fence** — EasyPost vs ShipStation atomic claim prevents double postage purchase.

## Scale / Metrics

| Metric                      | Count                                                   |
| --------------------------- | ------------------------------------------------------- |
| Repos                       | 6                                                       |
| Commits                     | 1,400+                                                  |
| Storefronts                 | 2                                                       |
| API routes                  | 100+ (49 site + 57 ops + 39 shop functions)             |
| D1 migrations               | 60+ (15 site + 46 ops + 11 shop)                        |
| Test files                  | 59+ (33 site + 26 ops + 37 shop)                        |
| External systems reconciled | 4 (Authorize.net, GHL, ShipStation, WooCommerce legacy) |

## Caveats (accuracy guardrails)

- **React Email + Resend** is a foundation only (deps + env vars landed, templates not built). Don't claim shipped email templates.
- **Pages → Workers migration** is in progress (S1 config done, S2 pending). Frame as active migration.
- **Subscription earn multiplier (2x)** is dormant pending a double-pay audit. Don't claim it's live.
- **Stripe** is a fallback, not the primary path; the shop's Stripe is deferred until safeguards pass.
