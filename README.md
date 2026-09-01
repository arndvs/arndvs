# Aaron Davis

Full-stack engineer in San Diego, 15+ years building for the web. Founded RipeMetrics in 2017 and spent 8 years leading product and AI engineering on a marketing automation, business intelligence, and customer support platform (8 repos, 50+ enterprise clients, production RAG across chat/SMS/email/voice) — which is where I learned how to ship AI features in production and what it actually takes to keep a SaaS product alive long term.

I'm currently going deep on **agentic engineering** — Claude Code, autonomous workflows, human-in-the-loop patterns, and the infrastructure that makes AI systems reliable rather than just impressive in a demo. This profile is the working surface for that: the repos below are the actual systems I use, organized by how they relate.

---

## What I'm working with

**Agentic engineering**
Claude Code · GitHub Copilot · autonomous loops · skills & instruction layers · MCP · LiteLLM gateway · sandboxed execution

**AI & LLMs**
Prompt engineering · RAG · LangChain · fine-tuning · LLM evaluation · Anthropic · OpenAI · local models (Ollama)

**Core stack**
TypeScript · React · Next.js · Sanity CMS · Python · FastAPI · Node.js · Express · PHP/Laravel

**Infrastructure**
Docker · AWS · CI/CD · GitHub Actions · PostgreSQL · SQLite · Vercel · Railway

---

## The agentic engineering stack

The core of what I'm working on: infrastructure that makes AI coding agents reproducible, context-aware, and safe across every machine.

### [ctrl+shft](https://github.com/arndvs/ctrlshft)

The system your AI agents are missing — synced instructions, workflow skills, hardened secrets, and autonomous loops across every machine. Progressive context detection (14 framework signatures) loads only the rules relevant to each stack. Includes a full planning pipeline (grill-me → write-a-prd → prd-to-issues → do-work) and an autonomous agent loop that picks GitHub issues, implements them, commits, and moves on while you're AFK.

- **Safety & observability built in:** a three-tier credential model so agents never see secrets, lifecycle hooks, and a real-time compliance HUD (WebSocket + HTTP) that surfaces rule loads, file reads, and compliance violations as they happen.
- **Companions:** [llm-gateway](https://github.com/arndvs/llm-gateway) — route Claude Code through a GitHub Copilot subscription via a secure LiteLLM proxy (no separate Anthropic API key); [advise-project-approach](https://github.com/arndvs/advise-project-approach) — a skill that makes agents research comparable projects and tradeoffs before advising; personal agent skills live in a private `skills` repo.

### [cmd](https://github.com/arndvs/cmd)

A markdown-first business operating system for solo operators and AI agents — the operational companion to ctrl+shft. Strategy, cadence, ventures, clients, and content living in plain files an agent can read and act on. (There's also a private instance, `cmd-private`, where my own business state lives.)

### [sandcastle-hub](https://github.com/arndvs/sandcastle-hub)

The single source of truth for the Sandcastle agent engine — composite actions, reusable workflows, templates, and the TypeScript engine. Consumers reference it remotely; nothing is vendored. Pairs with [sandcastle](https://github.com/arndvs/sandcastle) — orchestrate sandboxed coding agents with sandcastle.run().

### [orca](https://github.com/arndvs/orca)

An agent development environment for working with a fleet of parallel agents — run any coding agent with your own subscription, on desktop and mobile.

### [sheal](https://github.com/arndvs/sheal)

Your AI agent keeps making the same mistakes. sheal fixes that — closing the loop between what an agent did and what it should have done.

---

## Applied AI: the course work

Learning agentic coding in public, one module at a time.

### [agentic-nlq](https://github.com/arndvs/agentic-nlq)

Deterministic code orchestrating non-deterministic agents — an agentic engineering layer (specs, `.claude/commands`, ADWs) wrapped around a natural language to SQL app. The subject of my **Tactical Agentic Coding arc**: applying each course module to a real codebase and publishing what happens.

### [Tactical-Agentic-Coding](https://github.com/arndvs/Tactical-Agentic-Coding)

The course materials — the official Agentic Coding course by @IndyDevDan — mirrored for study. My progress is documented on [arndvs.com/blog](https://arndvs.com/blog) and this profile's agentic cluster.

---

## The RISE / PUSH universe

A fictional smart-bed company built as a sandbox for AI video generation via agentic workflows — short film, product teaser, and a working website.

- [PUSH](https://github.com/arndvs/PUSH) — _PUSH — a short film. One morning. One button. Push Mode cannot be manually interrupted once initiated. This is a feature, not a limitation._
- [riseawake.com](https://github.com/arndvs/riseawake.com) — the website for RISE Technologies, Inc. — makers of the RISE Push. Related to the PUSH film.
- [rise-co](https://github.com/arndvs/rise-co) _(private)_ — ongoing RISE company work.

### [cast](https://github.com/arndvs/cast)

Creative automation pipeline for generating localized social ad creatives at scale. Pairs with [cast-backend](https://github.com/arndvs/cast-backend) and [reel-decoder](https://github.com/arndvs/reel-decoder) — a local pipeline that decodes Instagram reels into structured Swipe Library rows with zero cloud APIs (local models via Ollama).

---

## Client & product work

### [Align San Diego Family Chiropractic](https://alignsd.com)

Website for a San Diego chiropractic clinic, built well beyond what the brief required. Next.js 16, Sanity CMS, 2,000+ TypeScript files. Five AI integrations: GPT-4o Vision insurance verification, OpenAI content enhancement pipeline, LLM review sentiment analysis, AI spam detection, and AEO endpoints. Custom JSON-LD composition architecture with 76 Schema.org types including medical schemas with ICD-10/SNOMED-CT codes. Programmatic SEO engine generating 203+ pages. 55 automated tests, 4 CI/CD pipelines. Credit on the footer.

### MCRDSE (functional mushroom brand)

Active client engineering — sales site, e-commerce, content operations, and agent infrastructure for MCRDSE, a functional mushroom company. (These live in the client's own GitHub orgs, `mcrdse` and `mcrdseorg`.)

The work is systems-with-guardrails: an AI editorial pipeline where "approved" is a SHA-256 fingerprint of copy + assets, a fact-check pass that caught 8 fabricated citations before publication, a human-in-the-loop reply assistant where every send is operator-approved, and an order pipeline rebuilt around "the database is the record of truth" after an incident shipped ~$381 of product to people who never paid. The work also included a from-scratch quality baseline (the main storefront went from no tests to 195) and a 284-item audit of things that "looked worked but didn't" — each closed with a fix or a written decision. The backlog now runs on a label-driven agent pipeline (Sandcastle, vendored + customized) through my own LiteLLM proxy.

- [mcrdse-site](https://github.com/mcrdse/mcrdse-site) — the main sales site
- [mcrdse-super-market](https://github.com/mcrdse/mcrdse-super-market) — e-commerce / storefront
- [MCRDSE-Content-Ship](https://github.com/mcrdse/MCRDSE-Content-Ship) — content production + shipping pipeline
- [mcrdse-outreach](https://github.com/mcrdse/mcrdse-outreach) — outreach automation
- [mcrdsemovement-site](https://github.com/mcrdse/mcrdsemovement-site) — movement/community site
- [mcrdse-command](https://github.com/mcrdse/mcrdse-command) — command-layer ops
- [mcrdse-ops](https://github.com/mcrdse/mcrdse-ops) — operations infrastructure
- [hermes-ops](https://github.com/mcrdseorg/hermes-ops) — agent ops (in the `mcrdseorg` org)

### Shared product foundation (private)

[launch](https://github.com/arndvs/launch) _(private)_ — a mobile-first monorepo starter I fork into client products: [foreword](https://github.com/arndvs/foreword) _(private)_ — from idea to development-ready spec; [scorpion](https://github.com/arndvs/scorpion) _(private)_ — Scorpion Percussion app; [aligned](https://github.com/arndvs/aligned) _(private)_ — healthcare-aligned products. These are private client codebases; the pattern is public in principle.

---

## Tools & libraries

Small, focused things I built because I needed them.

- [open-design](https://github.com/arndvs/open-design) — local-first, open-source alternative to Anthropic's Claude Design. 19 skills, 71 brand-grade design systems, sandboxed preview across web/desktop/mobile prototypes.
- [tailwind-indicator](https://github.com/arndvs/tailwind-indicator) — tiny zero-dep screen-size indicator for Tailwind CSS (breakpoint, dimensions, orientation, pixel ratio).
- [preact-chatbot](https://github.com/arndvs/preact-chatbot) _(private)_ — multi-tenant AI chatbot widget — embeddable Preact island with Shadow DOM isolation, Pusher streaming, per-site branding.
- [comedian-voices](https://github.com/arndvs/comedian-voices) — agent skills for writing in the voice of famous stand-up comedians — structural moves, rhetorical patterns, and anti-patterns.
- [voiceprint](https://github.com/arndvs/voiceprint) _(private)_ — voice style generator — turns raw source material into loadable writing-style skills (SKILL.md).
- [ha-aurora-calendar](https://github.com/arndvs/ha-aurora-calendar) — family calendar for Home Assistant (month/week/today views, weather overlay, per-person filters).
- [kitchen-skylight](https://github.com/arndvs/kitchen-skylight) — family kitchen skylight display — calendar, recipes, home automation hub (fork of OpenSkyLight).
- [dynacraft](https://github.com/arndvs/dynacraft) _(private)_ — dynamically craft customized CVs and cover letters for job applications.
- [kenesis-360-keyboard-layout](https://github.com/arndvs/kenesis-360-keyboard-layout) — alternative layouts for a split ergonomic keyboard.

---

## Earlier work

Learning projects and older experiments (mostly historical — kept for reference): the AI Engineering Bootcamp repo, LangChain/Chroma RAG experiments, React/Redux learning repos, Laravel courses, and assorted early web work. The current direction is the agentic engineering stack and applied AI above.

Notable from the RipeMetrics years (2017–2025, now wrapped): tenant-isolated RAG with OpenAI/Anthropic provider fallback so one vendor going down never took it offline, an AI onboarding pipeline that cut client setup from ~30 minutes to under 60 seconds, and a Laravel → React/Next.js migration (880 components, 85 routes) done behind feature flags without downtime.

---

## Background

- Building for the web since 2010 — HTML/CSS → Joomla → WordPress → Laravel → React/Next.js
- Founded RipeMetrics (2017–2025) — led product, frontend, and AI engineering across a team of up to 12
- Based in San Diego, open to remote

---

## Links

[arndvs.com](https://arndvs.com) · [linkedin.com/in/arndvs](https://linkedin.com/in/arndvs)

---

_Private repos are marked _(private)_ — they're client or personal code not shown publicly._
