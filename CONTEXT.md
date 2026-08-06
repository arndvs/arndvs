# Context

The arndvs.com portfolio site — a Next.js 16 (App Router) + Sanity CMS v5 + Tailwind v4 application that serves as Aaron Davis's personal portfolio, blog, changelog, and "shipped" digest.

## Stack

| Layer           | Technology                                        |
| --------------- | ------------------------------------------------- |
| Framework       | Next.js 16 (App Router, React 19)                 |
| CMS             | Sanity v5 (Studio, GROQ, TypeGen, Visual Editing) |
| Styling         | Tailwind v4, shadcn/ui, Framer Motion             |
| Hosting         | Vercel                                            |
| Email           | React Email + Resend                              |
| Testing         | Vitest                                            |
| Package manager | pnpm                                              |

## What's here

- **Homepage** — editorial full-viewport hero with featured projects
- **Projects** — case-study pages (alignsd, ctrlshft, mcrdse-commerce, mcrdse-content, push, ripemetrics, rise-awake) using a shared `createCaseStudySections` template
- **Blog** — Sanity-driven posts with AI content enhancement
- **Changelog** — Sanity-driven changelog entries
- **Shipped** — weekly digest of shipped work
- **Work With Me** — services/offer page
- **Studio** — Sanity Studio at `/studio`

## Key conventions

- **Case studies** live in `src/app/projects/<slug>/` with `page.tsx`, `data.ts`, `components.tsx`, `diagrams.ts`, and a `<slug>-portfolio.md` source doc. They use the shared `PageData` type from `src/lib/types/case-study.ts` and `createCaseStudySections` from `src/components/case-study/sections.tsx`.
- **Project slugs** are registered in `src/lib/data/projects.ts` (drives sitemap).
- **Metadata** is generated via `generateSiteMetadata` in `src/lib/metadata.ts`.
- **JSON-LD** lives in `src/lib/data/json-ld.ts` and per-page `@graph` blocks.
- **Design tokens** use the site's CSS variables; case-study accents are `orange | cyan | green | purple`.

## Branch strategy

- Work happens on `ai/*` feature branches → PR to `dev` → human merges `dev → main`.
- Never push directly to `main` or `dev`.
