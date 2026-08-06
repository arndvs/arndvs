# Coding Standards

Project-specific coding standards for Sandcastle agents working in the arndvs portfolio repo.

## General

- Follow existing patterns in the codebase — read a sample file of the same type before creating new ones.
- Keep commits atomic and well-described (conventional commits: `feat`, `fix`, `refactor`, `chore`, `docs`).
- Work on `ai/*` feature branches → PR to `dev`. Never push directly to `main` or `dev`.
- Do not touch code outside the task. If you notice dead code or problems, mention them — don't fix them.
- Never print credentials or commit secrets.

## Architecture

- **Case studies** use the shared template: `src/app/projects/<slug>/` with `page.tsx`, `data.ts`, `components.tsx`, `diagrams.ts`, and a `<slug>-portfolio.md` source doc.
- Use the `PageData` type from `src/lib/types/case-study.ts` and `createCaseStudySections` from `src/components/case-study/sections.tsx`. Do not reinvent the case-study UI.
- Register new project slugs in `src/lib/data/projects.ts` (drives the sitemap).
- Generate metadata via `generateSiteMetadata` in `src/lib/metadata.ts`.
- Mermaid diagrams in `diagrams.ts` must validate before commit.
- Prefer Server Components; scope `"use client"` islands minimally.

## Testing

- Run `pnpm typecheck` and `pnpm test` before committing.
- Run `pnpm build` to verify pages compile.
- Run `pnpm format:check` (or `npx prettier --write` on changed files) to match repo formatting.
- The vendored Sandcastle engine has its own typecheck under `.sandcastle/engine` — run it when the engine changes.
