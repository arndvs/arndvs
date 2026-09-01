# Aaron Davis

Full-stack engineer in San Diego, 15+ years building for the web. Founded RipeMetrics in 2017 and spent 8 years leading product and AI engineering on a marketing automation, business intelligence, and customer support platform — which is where I learned how to ship AI features in production and what it actually takes to keep a SaaS product alive long term.

I'm currently going deep on **agentic engineering** — Claude Code, autonomous workflows, human-in-the-loop patterns, and the infrastructure that makes AI systems reliable rather than just impressive in a demo. This profile is the working surface for that: the repos below are the actual systems I use, organized by how they relate.

---

## Tech stack

**Agentic engineering:** Claude Code · MCP · GitHub Copilot · autonomous loops · skills & instruction layers · LiteLLM gateway · sandboxed execution
**AI & LLMs:** OpenAI · Anthropic · Azure OpenAI · RAG · embeddings · vector search · tool calling · structured output (Zod) · prompt engineering · LangChain · Pinecone · Chroma · pgvector · fal.ai · Ollama
**Frontend:** TypeScript · React · Next.js · Astro · Redux · RTK Query · Tailwind · shadcn/ui · Zod
**Backend:** Node.js · Python · FastAPI · Express · Laravel · PHP · Koa · tRPC
**Data:** PostgreSQL (+pgvector) · MySQL · Redis · SQLite · Drizzle · Cloudflare D1 · Supabase
**Cloud & DevOps:** Azure (OpenAI · Blob Storage · Functions) · Cloudflare (Workers · D1 · R2 · KV) · AWS (in progress) · Docker · GitHub Actions · CI/CD · Vercel · Railway
**Integrations:** GoHighLevel · WooCommerce · Stripe · Authorize.net · PayPal · Twilio · ElevenLabs · Shopify · ShipStation · Sanity · Resend · SendGrid · PostHog · Sentry

**Currently studying:** Azure AI Foundry · OpenAI Agents SDK · Google ADK · Vertex AI · AWS Solutions Architect Associate

---

## Course work

IndyDevDan's agentic engineering track — [Tactical Agentic Coding](https://github.com/arndvs/Tactical-Agentic-Coding), Principled AI Coding, Agentic Horizon · [Claude Code for Real Engineers (Matt Pocock)](https://github.com/arndvs/claude-coding-for-real-engineers) · [Model Context Protocol](https://github.com/arndvs/mcp-fundamentals) ([fundamentals](https://github.com/arndvs/mcp-fundamentals) · [advanced](https://github.com/arndvs/Advanced-MCP-Features) · [server UI](https://github.com/arndvs/MCP-UI) · [auth](https://github.com/arndvs/mcp-auth)) · AI Engineering Bootcamp (Maven) · LLM Engineering: Foundations to SLMs (AI Makerspace) · Cursor AI Bootcamp · Frontend Masters (React · Next.js · TypeScript · Redux) · AWS Solutions Architect Associate (in progress)

---

## The agentic engineering stack

The core of what I'm working on: infrastructure that makes AI coding agents reproducible, context-aware, and safe across every machine.

- [ctrl+shft](https://github.com/arndvs/ctrlshft) — the system your AI agents are missing: synced instructions, workflow skills, hardened secrets, and an autonomous loop that picks GitHub issues, implements them, and commits while you're AFK. Planning pipeline (grill-me → write-a-prd → prd-to-issues → do-work) and a compliance HUD included.
- [llm-gateway](https://github.com/arndvs/llm-gateway) — route Claude Code through a GitHub Copilot subscription via a secure LiteLLM proxy.
- [cmd](https://github.com/arndvs/cmd) — a markdown-first business operating system for solo operators and AI agents; strategy and clients in plain files an agent can act on.
- [ctrlshft-hub](https://github.com/arndvs/ctrlshft-hub) — the single source of truth for the ctrl+shft agent layer — composite actions, reusable workflows, and the TypeScript engine that bootstraps consumer repos (evolved from [sandcastle](https://github.com/mattpocock/sandcastle)).

---

## Applied AI

Learning agentic coding in public, one module at a time.

- [agentic-nlq](https://github.com/arndvs/agentic-nlq) — deterministic code orchestrating non-deterministic agents: an agentic layer (specs, `.claude/commands`, ADWs) around a natural-language-to-SQL app. The Tactical Agentic Coding arc subject.
- [Tactical-Agentic-Coding](https://github.com/arndvs/Tactical-Agentic-Coding) — the official Agentic Coding course by @IndyDevDan, mirrored for study; progress on [arndvs.com/blog](https://arndvs.com/blog).

---

## The RISE / PUSH universe

A fictional smart-bed company built as a sandbox for AI video generation via agentic workflows — short film, product teaser, and a working website.

- [PUSH](https://github.com/arndvs/PUSH) — _PUSH — a short film. One morning. One button. Push Mode cannot be manually interrupted once initiated. This is a feature, not a limitation._
- [riseawake.com](https://github.com/arndvs/riseawake.com) — the website for RISE Technologies, Inc. — makers of the RISE Push.
- [rise-co](https://github.com/arndvs/rise-co) _(private)_ — ongoing RISE company work.
- [cast](https://github.com/arndvs/cast) — creative automation pipeline for generating localized social ad creatives at scale.
- [cast-backend](https://github.com/arndvs/cast-backend) — backend pair for cast.
- [reel-decoder](https://github.com/arndvs/reel-decoder) — decodes Instagram reels into structured Swipe Library rows locally (Ollama, zero cloud APIs).

---

## Client & product work

### [Align San Diego Family Chiropractic](https://alignsd.com)

Website for a San Diego chiropractic clinic, built well beyond what the brief required. Next.js 16, Sanity CMS, 2,000+ TypeScript files. Five AI integrations: GPT-4o Vision insurance verification, OpenAI content enhancement pipeline, LLM review sentiment analysis, AI spam detection, and AEO endpoints. Custom JSON-LD composition architecture with 76 Schema.org types including medical schemas with ICD-10/SNOMED-CT codes. Programmatic SEO engine generating 203+ pages. 55 automated tests, 4 CI/CD pipelines.

### MCRDSE (functional mushroom brand)

Active client engineering — sales site, e-commerce, content operations, and agent infrastructure. Systems-with-guardrails: an AI editorial pipeline where "approved" is a SHA-256 fingerprint of copy + assets, a fact-check pass that caught 8 fabricated citations before publication, a human-in-the-loop reply assistant where every send is operator-approved, and an order pipeline rebuilt around "the database is the record of truth" after an incident shipped ~$381 of product to people who never paid. From-scratch quality baseline (storefront went from no tests to 195) and a 284-item audit of things that "looked worked but didn't" — each closed with a fix or a written decision. The backlog runs on a label-driven agent pipeline through my own LiteLLM proxy.

- [mcrdse-site](https://github.com/mcrdseorg/mcrdse-site) — the main sales site
- [mcrdse-super-market](https://github.com/mcrdseorg/mcrdse-super-market) — e-commerce / storefront
- [MCRDSE-Content-Ship](https://github.com/mcrdseorg/MCRDSE-Content-Ship) — content production + shipping pipeline
- [mcrdse-outreach](https://github.com/mcrdseorg/mcrdse-outreach) — outreach automation
- [mcrdsemovement-site](https://github.com/mcrdseorg/mcrdsemovement-site) — movement/community site
- [mcrdse-command](https://github.com/mcrdseorg/mcrdse-command) — command-layer ops
- [mcrdse-ops](https://github.com/mcrdseorg/mcrdse-ops) — operations infrastructure
- [hermes-ops](https://github.com/mcrdseorg/hermes-ops) — agent ops

### Shared product foundation (private)

- [launch](https://github.com/arndvs/launch) _(private)_ — mobile-first monorepo starter I fork into client products
- [foreword](https://github.com/arndvs/foreword) _(private)_ — idea to development-ready spec
- [scorpion](https://github.com/arndvs/scorpion) _(private)_ — Scorpion Percussion app
- [aligned](https://github.com/arndvs/aligned) _(private)_ — healthcare-aligned products

Private client codebases; the pattern is public in principle.

---

## Tools & libraries

Small, focused things I built because I needed them.

- [tailwind-indicator](https://github.com/arndvs/tailwind-indicator) — zero-dep screen-size indicator for Tailwind CSS (breakpoint, dimensions, orientation, pixel ratio).
- [preact-chatbot](https://github.com/arndvs/preact-chatbot) _(private)_ — multi-tenant AI chatbot widget — Preact island, Shadow DOM isolation, Pusher streaming.
- [comedian-voices](https://github.com/arndvs/comedian-voices) — agent skills for writing in famous stand-up voices — structural moves, rhetorical patterns.
- [voiceprint](https://github.com/arndvs/voiceprint) _(private)_ — voice style generator — turns raw material into loadable SKILL.md writing skills.
- [kitchen-skylight](https://github.com/arndvs/kitchen-skylight) — family kitchen skylight display — calendar, recipes, home automation hub (OpenSkyLight-based).
- [dynacraft](https://github.com/arndvs/dynacraft) _(private)_ — dynamically craft customized CVs and cover letters for job applications.
- [kenesis-360-keyboard-layout](https://github.com/arndvs/kenesis-360-keyboard-layout) — alternative layouts for a split ergonomic keyboard.
- [arndvs-py-api](https://github.com/arndvs/arndvs-py-api) — generic Python API backend — FastAPI on Railway, powering arndvs.com services.

---

## Earlier work

Learning projects and older experiments (mostly historical — kept for reference): the AI Engineering Bootcamp repo, LangChain/Chroma RAG experiments, React/Redux learning repos, Laravel courses, and assorted early web work. The current direction is the agentic engineering stack and applied AI above.

Notable from the RipeMetrics years (2017–2025, now wrapped): tenant-isolated RAG with OpenAI/Anthropic provider fallback so one vendor going down never took it offline, an AI onboarding pipeline that cut client setup from ~30 minutes to under 60 seconds, and a Laravel → React/Next.js migration (880 components, 85 routes) done behind feature flags without downtime.

---

## A note on platforms

Everything here exists because I needed it and I use all of it — on my own setup: Windows and Android, plus the readers and tablets I own. None of it has been tested on macOS, iOS, Linux, or other platforms. If you want to run one of these somewhere I have not, the quickest route is to hand the repo to Claude Code, Codex, or whatever agent you use and have it adapt the project to your environment.

---

## Background

- Building for the web since 2010 — HTML/CSS → Joomla → WordPress → Laravel → React/Next.js
- Founded RipeMetrics (2017–2025) — led product, frontend, and AI engineering across a team of up to 12
- Based in San Diego, open to remote

---

## Links

[arndvs.com](https://arndvs.com) · [linkedin.com/in/arndvs](https://linkedin.com/in/arndvs)

---

_These are personal projects. The views and work here are my own and unrelated to my past, present, and future employers._

_Private repos are marked _(private)_ — they're client or personal code not shown publicly._
