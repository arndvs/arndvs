# Aaron Davis

**I build AI features and the systems around them.**

Applied AI full-stack engineer in San Diego, 15+ years building for the web. I co-founded RipeMetrics in 2017 and spent 8 years building its marketing automation, CRM, and AI customer service platform. That is where I learned to ship AI features in production and what it takes to keep a SaaS product running long term.

My work runs along three lines:

- **Applied AI and agentic engineering**: LLM features with guardrails, Claude Code, autonomous workflows, human-in-the-loop review, and the infrastructure that makes AI systems reliable rather than just impressive in a demo.
- **Full-stack product engineering**: TypeScript, React, Next.js, Node, and Python, from the database to the deploy.
- **Lifecycle and marketing automation**: the events, attributes, and code that get the right data onto a customer profile so journeys, segments, and tests work.

Open to full-time and contract roles, San Diego or remote · [arndvs.com](https://arndvs.com) · [LinkedIn](https://linkedin.com/in/arndvs)

---

## Selected work

### RipeMetrics · 2017–2025

Co-founded. CEO, then President of Product & Engineering, with a team of up to 12. Marketing automation, CRM, and AI customer service across chat, SMS, email, and voice.

- Tenant-isolated RAG with OpenAI/Anthropic provider fallback, so one vendor going down never took it offline.
- An AI onboarding pipeline that replaced about 30 minutes of manual client setup with an automated process under 60 seconds.
- A Laravel → React/Next.js migration (880 components, 85 routes) done behind feature flags, without downtime for paying clients.

[Case study](https://arndvs.com/projects/ripemetrics)

### MCRDSE · functional mushroom brand

Active client engineering: sales site, e-commerce, content operations, and agent infrastructure.

- An AI editorial pipeline where "approved" is a SHA-256 fingerprint of copy and assets, with a fact-check pass that caught 8 fabricated citations before publication.
- A human-in-the-loop reply assistant: every send is approved by an operator.
- An order pipeline rebuilt around "the database is the record of truth" after an incident shipped about $381 of product to people who never paid.
- A quality baseline from scratch (the storefront went from no tests to 195) and a 284-item audit of things that looked like they worked but didn't, each closed with a fix or a written decision.

The backlog runs on a label-driven agent pipeline through my own LiteLLM proxy. Client code is private. Case studies: [commerce](https://arndvs.com/projects/mcrdse-commerce) · [content](https://arndvs.com/projects/mcrdse-content)

### Align San Diego Family Chiropractic

A clinic website with a CMS one non-technical editor runs on her own. Next.js 16 and Sanity, 203 pages, 76 JSON-LD schema files (medical schemas carry ICD-10 and SNOMED-CT codes), and programmatic area pages. Five AI integrations: GPT-4o Vision insurance verification, a content enhancement pipeline, review sentiment analysis, spam detection, and AEO endpoints.

[alignsd.com](https://alignsd.com) · [Case study](https://arndvs.com/projects/align-san-diego-family-chiropractic)

### inKind first-reward journey · work sample

A Braze first-reward journey built end to end: a Snowflake data contract, Liquid that aborts the send when the data is wrong, a Braze trial, and a Rails outbox, with a decision log and a gap register. Fictional data, not affiliated with inKind.

[Repo](https://github.com/arndvs/inkind-first-reward-journey) · [Case study](https://arndvs.com/projects/inkind-first-reward-journey)

Braze: certified, with this public work sample; not yet run in a production role. My production lifecycle work was on the engagement platform I built at RipeMetrics and on GoHighLevel for clients.

---

## ctrl+shft: one system, four repos

The infrastructure I use to make AI coding agents reproducible, context-aware, and safe on every machine. [Case study](https://arndvs.com/projects/ctrlshft)

- [ctrlshft](https://github.com/arndvs/ctrlshft) (**the mechanism**): synced instructions, workflow skills, hardened secrets, and a loop that picks up GitHub issues, implements them, and commits. Includes a planning pipeline (grill-me → write-a-prd → prd-to-issues → do-work) and a compliance HUD.
- [ctrlshft-hub](https://github.com/arndvs/ctrlshft-hub) (**the engine**): composite actions, reusable workflows, and the TypeScript engine that bootstraps consumer repos. Evolved from [sandcastle](https://github.com/mattpocock/sandcastle).
- [cmd](https://github.com/arndvs/cmd) (**the context**): a markdown-first business operating system. Strategy, clients, and decisions in plain files an agent can read and act on.
- [llm-gateway](https://github.com/arndvs/llm-gateway) (**the model routing**): a LiteLLM proxy that serves Claude Code through OpenRouter, with GitHub Copilot as the automatic fallback.

---

## Learning in public

- [Why This](https://github.com/arndvs/system-design-lab) (repo: system-design-lab): system design with the reason for every component. Pick a system's requirements and it builds the architecture and says why each piece is there. I'm building it alongside Educative's system design courses, after an AWS Solutions Architect course taught me the services before I understood the design behind them.
- [agentic-nlq](https://github.com/arndvs/agentic-nlq): deterministic code orchestrating non-deterministic agents. An agentic layer (specs, `.claude/commands`, AI developer workflows) around a natural-language-to-SQL app.

---

## Tech stack

**Agentic engineering:** Claude Code · MCP · GitHub Copilot · LiteLLM · skills & instruction layers · sandboxed execution<br>
**AI & LLMs:** OpenAI · Anthropic · Azure OpenAI · RAG · embeddings · pgvector · tool calling · structured output (Zod) · Ollama<br>
**Frontend:** TypeScript · React · Next.js · Astro · Redux / RTK Query · Tailwind · shadcn/ui<br>
**Backend:** Node.js · Python · FastAPI · Express · tRPC · Laravel / PHP<br>
**Data:** PostgreSQL · Snowflake · MySQL · Redis · SQLite · Drizzle · Supabase · Cloudflare D1<br>
**Marketing automation:** Braze · Liquid · GoHighLevel · journey design · segmentation · RFM/lifecycle modeling · deliverability · A2P 10DLC consent<br>
**Cloud & DevOps:** Azure · Cloudflare (Workers · D1 · R2 · KV) · Docker · GitHub Actions · Vercel · Railway<br>
**Integrations:** Stripe · Authorize.net · Twilio · ElevenLabs · Shopify · WooCommerce · ShipStation · Sanity · Resend · PostHog · Sentry

---

## Certifications

Braze Certified Marketing Specialist · Braze Certified Practitioner · Snowflake Data Engineering Professional Certificate · Snowflake Generative AI Professional Certificate (all 2026)

## Course work

Claude Code for Real Engineers, AI Hero (2026) · Master the Model Context Protocol, EpicAI (2025) · AI Engineering Bootcamp, Maven (2025) · LLM Engineering: Foundations to SLMs, AI Makerspace (2024) · IndyDevDan's agentic engineering track · AWS Solutions Architect Associate course · Educative system design (in progress)

---

## Tools

Small things I built because I needed them.

- [tailwind-indicator](https://github.com/arndvs/tailwind-indicator): a zero-dependency screen-size indicator for Tailwind CSS (breakpoint, dimensions, orientation, pixel ratio).
- [preact-chatbot](https://github.com/arndvs/preact-chatbot): a multi-tenant AI chatbot widget. Preact island, Shadow DOM isolation, Pusher streaming.
- [voiceprint](https://github.com/arndvs/voiceprint): turns raw writing into loadable SKILL.md writing-style skills.
- [reel-decoder](https://github.com/arndvs/reel-decoder): decodes Instagram reels into structured rows locally with Ollama, no cloud APIs.
- [arndvs-py-api](https://github.com/arndvs/arndvs-py-api): the FastAPI backend on Railway behind arndvs.com services.

## Side projects

**RISE / PUSH**: a fictional smart-bed company built as a sandbox for AI video generation with agentic workflows: a short film ([PUSH](https://github.com/arndvs/PUSH)), the company website ([riseawake.com](https://github.com/arndvs/riseawake.com)), and [cast](https://github.com/arndvs/cast), a pipeline for localized social ad creatives.

---

## Background

- Paying web clients since 2010: HTML/CSS → Joomla → WordPress → Laravel → React/Next.js.
- Before and alongside that, a decade in payments and restaurant loyalty programs, including lifecycle segmentation and win-back campaigns.
- Based in San Diego, open to remote.

Older repos are learning projects, kept for reference.

---

_These are personal projects. The views and work here are my own and unrelated to my past, present, and future employers._
