# ctrl+shft — Dotfiles for AI Coding Agents Portfolio Report

> Deep codebase audit of `arndvs/ctrlshft` — an infrastructure system that makes AI coding agents reproducible, context-aware, and secure across every machine.

---

## Executive Summary

ctrl+shft is a **single-repo infrastructure system** for AI coding agents (Claude Code, GitHub Copilot). It provides reproducible configuration via symlinks, progressive context loading, three-tier secret isolation, lifecycle hooks, 39 reusable skills (including a complete 7-phase UX design process), named subagents, and a real-time observability HUD — all cross-platform from day one (Windows Git Bash, Linux, macOS). The system has two halves: **ctrl** (the structure — rules, skills, context) and **shft** (the autonomous execution loop — picks GitHub issues, implements, commits, repeats). ~150+ tracked files, ~8,000–10,000 LOC across Bash, Node.js, Python, and HTML.

---

## Tech Stack

| Layer              | Technology                                                                      |
| ------------------ | ------------------------------------------------------------------------------- |
| Shell Scripts      | Bash (POSIX-ish, cross-platform: Git Bash, Linux, macOS)                        |
| HUD Daemon         | Node.js (zero required npm deps), raw WebSocket implementation, optional SQLite |
| Token Minting      | Python 3.10+ (PyJWT, requests) in isolated venv                                 |
| HUD Frontend       | Vanilla HTML/CSS/JS — single-file, no build step                                |
| Landing Page       | Vanilla HTML/CSS/JS — single-file, GitHub Pages at ctrlshft.dev                 |
| CI                 | GitHub Actions (2 workflows: integrity checks, skill linting)                   |
| Container Runtime  | Docker + Anthropic Sandbox Runtime (`srt`) for AFK mode                         |
| Package Management | npm (optional), pip (venv)                                                      |

---

## Architecture

### Source of Truth Model

`~/dotfiles/` is the single source of truth. `~/.claude/`, `~/.copilot/`, and `~/.agents/` are consumer targets populated via symlinks/copies during bootstrap. CLAUDE.md is **generated** from CLAUDE.base.md — bootstrap appends local `@`-refs to keep the git-tracked file clean.

### Progressive Context Loading

`detect-context.sh` scans the current workspace for file signatures across 11 stacks (Next.js, React, React Native, Node, TypeScript, PHP, Sanity, Prisma, Docker, Python, Laravel). Exports `ACTIVE_CONTEXTS` so only matching instruction files load. `detect-client.sh` runs on every `cd()`, matches against `.projects` mapping files, and dynamically writes `active-client.md` with `@`-refs for client/project context.

### Three-Tier Secret Isolation

1. `.env.agent` — non-sensitive config, shell-visible
2. `.env.secrets` — API keys, process-scoped only via `run-with-secrets.sh` (secrets vanish on exit)
3. AFK tokens — minted per iteration via GitHub App with ~1hr TTL, structurally blocks PAT fallback

### Key Architecture Decisions

| Decision                                            | Rationale                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------- |
| Single source of truth in `~/dotfiles/`             | Consumer targets are symlinks, never edited directly                  |
| CLAUDE.md is generated, CLAUDE.base.md is edited    | Bootstrap appends local `@`-refs, keeping git-tracked file clean      |
| Progressive context loading                         | Only load instructions matching detected workspace stack              |
| Three-tier secret isolation                         | Mechanical enforcement at tool-use, process, and token levels         |
| Skills are universal, domain skills go to `_local/` | ADR-001 codifies the vendor boundary                                  |
| Prefer fresh context over compaction                | Compaction guard hook blocks auto-compaction, forces handoff protocol |
| Atomic commits on `ai/*` branches                   | Never commit to main/dev directly; one logical change per commit      |
| Named pipe → HTTP → JSONL transport cascade         | HUD events use fastest available transport, never block               |

---

## Module Inventory

### `bin/` — 24 files (~2,600 LOC)

The engine room. All scripts source `_lib.sh` for shared utilities.

| File                       | LOC (est.) | Purpose                                                                                                                                                                                                                                                                  |
| -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bootstrap.sh`             | ~460       | **Core script.** 13-step idempotent setup: secrets, CLAUDE.md gen, symlinks (skills/agents/rules/commands/hooks), shell wiring, CLI install, Python venv, supply chain hardening. Modes: `--adopt`, `--minimal`, `--check`, `--force`                                    |
| `ctrl`                     | ~480       | **CLI entry point.** 20+ subcommands: check, bootstrap, sync, status, context, hud (10 sub-subcommands), sync-settings, new-client, migrate, uninstall, verify-token, retro, digest, cost, ask, learn                                                                    |
| `hud-daemon.js`            | ~880       | **HUD HTTP + WebSocket server.** Zero required npm deps. Named pipe listener, JSONL file watcher, HTTP POST ingestion. Optional SQLite persistence. Raw WebSocket protocol implementation — handles upgrade handshake, frame encoding/decoding, ping/pong, close opcodes |
| `_lib.sh`                  | ~130       | Shared library: colored output, OS detection, Python finder, symlink 4-way fallback (correct → fix stale → replace real dir → Windows copy)                                                                                                                              |
| `detect-context.sh`        | ~110       | Scans CWD for file signatures (11 stacks). Exports `ACTIVE_CONTEXTS`. Emits HUD context event                                                                                                                                                                            |
| `detect-client.sh`         | ~115       | Scans `clients/*/.projects` mappings against CWD. Writes `working/active-client.md` with `@`-refs to client/project instructions                                                                                                                                         |
| `new-client.sh`            | ~120       | Interactive client scaffolding: slug validation, template copy, project directory mapping                                                                                                                                                                                |
| `write-hud-state.sh`       | ~150       | Non-blocking event emitter. Transport cascade: pipe → HTTP → JSONL                                                                                                                                                                                                       |
| `start-hud.sh`             | ~90        | Daemon lifecycle manager: start/stop/status/restart/foreground                                                                                                                                                                                                           |
| `load-secrets.sh`          | ~50        | Sources `.env.agent` into shell. Handles Windows `\r` stripping, `gh` PATH fix                                                                                                                                                                                           |
| `run-with-secrets.sh`      | ~50        | Process-scoped secret injection — secrets vanish on exit                                                                                                                                                                                                                 |
| `mint_github_app_token.py` | —          | Mints short-lived GitHub App installation tokens using PyJWT                                                                                                                                                                                                             |

### `skills/` — 39 directories

Each skill is a `SKILL.md` file in its own directory. Auto-discovered by Claude Code, Copilot, and agent frameworks.

**Core workflow skills (18):**

| Skill                   | Purpose                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| `do-work`               | Core execution loop: Understand → Plan → Implement → Validate → Commit       |
| `architect`             | Vertical slices, dependency graphs, acceptance criteria                      |
| `grill-me`              | Interrogation protocol until shared understanding                            |
| `write-a-prd`           | Explore codebase → interview → write PRD → submit as GitHub issue            |
| `prd-to-issues`         | Break PRD into independently grabbable GitHub issues                         |
| `atomic-commits`        | Branch-isolated commits. Two modes: Commit (checkpoint) and Ship (push + PR) |
| `explore`               | Spawn parallel sub-agents for deep codebase exploration                      |
| `research`              | Cache exploration into research.md with staleness checks                     |
| `tdd`                   | Red-green refactor. Backend only. One test at a time                         |
| `systematic-debugging`  | Root-cause-first investigation protocol                                      |
| `codebase-audit`        | Ruthless audit — real problems only, grouped by severity                     |
| `improve-architecture`  | Find shallow modules, spawn design agents, file RFC                          |
| `code-review`           | Focused review of staged/recent changes                                      |
| `document`              | Write, update, or audit documentation                                        |
| `compliance-audit`      | Auto-invoked after do-work/tdd/debugging. Rule-by-rule review                |
| `stress-test`           | Adversarial 19-scenario protocol across 6 categories                         |
| `skill-scaffolder`      | Meta-skill for creating new skills                                           |
| `sanity-best-practices` | Sanity CMS schema design, GROQ, TypeGen                                      |

**UX/UI design skills (20+):** A complete 7-phase design process from user stories through tested interfaces — `sketch-the-solution` orchestrates: `ux-user-stories` → `ux-system-map` → `ux-flow-diagram` → `ux-model-attributes` → `ux-screen-requirements` → `ux-interface-design` → `ux-test-driven-design`, each with sub-steps.

### `agents/` — 6 named subagents

Specialized personas with YAML frontmatter for model selection, tool restrictions, and memory.

| Agent                | Model  | Purpose                                            |
| -------------------- | ------ | -------------------------------------------------- |
| `researcher`         | Sonnet | Deep codebase exploration and architecture mapping |
| `researcher-opus`    | Opus   | Complex cross-system analysis                      |
| `researcher-haiku`   | Haiku  | Quick lookups, bulk scanning                       |
| `code-reviewer`      | Sonnet | PR reviews: bugs, logic errors, security           |
| `code-reviewer-opus` | Opus   | Security-critical reviews                          |
| `security-auditor`   | Sonnet | OWASP Top 10, secrets exposure, config hardening   |

### `hooks/` — 10 lifecycle hooks

Claude Code lifecycle hooks. Exit 0 = allow, Exit 2 = block.

| Hook                  | Event             | Purpose                                                                     |
| --------------------- | ----------------- | --------------------------------------------------------------------------- |
| `secret-guard.sh`     | PreToolUse        | Blocks `echo $TOKEN`, bare `env`/`printenv`, `cat secrets/`, piped installs |
| `migration-guard.sh`  | PreToolUse        | Blocks migration commands targeting non-test databases                      |
| `compaction-guard.sh` | PreCompact        | Blocks auto-compaction at ~95% context, forces handoff protocol             |
| `context-warning.sh`  | UserPromptSubmit  | Graduated warnings at 40%/70% context                                       |
| `format-check.sh`     | Stop              | Auto-formats modified files via Biome/Prettier/ESLint                       |
| `typecheck.sh`        | Stop              | Runs `tsc --noEmit` before session end                                      |
| `hud-session.sh`      | SessionStart/Stop | Emits session lifecycle events to HUD daemon                                |
| `hud-reads.sh`        | PostToolUse       | Emits read events for loaded files                                          |

### `rules/` — 4 path-scoped rules

Convention enforcement files that load only when matching files are touched.

| Rule                      | Scoped To                                       |
| ------------------------- | ----------------------------------------------- |
| `test-conventions.md`     | `**/*.test.*`, `**/*.spec.*`, `**/__tests__/**` |
| `migration-safety.md`     | `**/migrations/**`, `**/prisma/migrations/**`   |
| `env-security.md`         | `**/.env*`, `**/secrets/**`, `**/credentials*`  |
| `terminal-workarounds.md` | Terminal sessions                               |

### `commands/` — 7 slash commands

Thin launchers. Each loads a skill with `$ARGUMENTS` passthrough.

`/work`, `/audit`, `/explore`, `/plan`, `/review`, `/test`, `/document`

### `instructions/` — 8 public + 2 local

Stack-specific instruction files loaded conditionally based on `ACTIVE_CONTEXTS`.

Next.js, PHP/Laravel, Sanity, UX prototyping, CSS, Sentry, Google Docs, handoff (always loaded), plus private local instructions for copywriting and session learnings.

### `shft/` — Autonomous execution loop (~600 LOC)

| File               | Purpose                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `shft`             | **CLI entry point.** 15+ subcommands: run (HITL), afk, status, stop, log, issues, next, done, plan, validate, mint, prompt, context |
| `prompt.md`        | Shared agent prompt: task selection priority, exploration, skills loading, git commit conventions                                   |
| `once.sh`          | HITL single-run with `--permission-mode acceptEdits`                                                                                |
| `afk.sh`           | AFK autonomous loop in Docker sandbox with iteration guard                                                                          |
| `_build_prompt.sh` | Prompt assembly with sanitized issue injection                                                                                      |

### `hud/` — Real-time observability dashboard (~2,000 LOC)

Single-file HUD UI with dark theme (IBM Plex Mono + Bebas Neue), WebSocket real-time updates with HTTP polling fallback. Project tabs, file inventory sidebar, session log, compliance history chart, violation detail cards, stat sparklines, search, and shutdown dialog.

### `site/` — Landing page (~1,500 LOC)

Marketing page at ctrlshft.dev. Interactive terminal hero, problem/solution grid, pipeline diagram, skill table, CLI reference, FAQ accordion, contributor grid via GitHub API.

### `clients/` — Per-client isolation system

Template-based client scaffolding with `.projects` directory mapping files. `detect-client.sh` auto-loads client/project context on `cd()`.

---

## CI/CD

Two GitHub Actions workflows:

1. **`integrity.yml`** — Validates source-of-truth language in key files, checks for deprecated skill flags, static integrity checks
2. **`skill-lint.yml`** — Validates skill file structure (frontmatter, name/description fields) on PR

---

## Key Engineering Highlights

1. **Raw WebSocket implementation** — `hud-daemon.js` implements the WebSocket protocol from scratch using Node.js `crypto` and `net` — no `ws` dependency. Handles upgrade handshake, frame encoding/decoding, ping/pong, close opcodes.

2. **Mechanical secret enforcement** — hooks block credential exposure at the Claude Code tool-use level, `run-with-secrets.sh` injects into child process only, AFK mode uses ephemeral GitHub App tokens with ~1hr TTL.

3. **Compaction guard** — mechanically prevents auto-compaction (which degrades context quality) and forces the handoff protocol. Context management as infrastructure.

4. **39 skills including a complete 7-phase UX process** — from user stories through tested interfaces, all executable by an AI agent.

5. **Self-learning loop** — after any task, the agent evaluates whether a skill needs updating and patches it inline. Sheal integration promotes human-reviewed session learnings into persistent instructions.

6. **Cross-platform from day one** — `ensure_symlink()` implements a 4-way fallback (correct symlink → fix stale → replace real dir → Windows copy).

7. **Supply chain hardening** — bootstrap auto-configures `~/.npmrc` (7-day package release age gate) and `uv.toml` (`exclude-newer`) for dependency confusion protection.

8. **Client isolation** — `detect-client.sh` runs on every `cd()`, auto-loads matching client/project instructions via `@`-refs.

---

## Portfolio Relevance

| Dimension          | Detail                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **Scale**          | ~150+ tracked files, ~8K–10K LOC, 39 skills, 6 agents, 10 hooks, 4 rules                               |
| **Architecture**   | Single source of truth with symlink distribution, progressive context loading, three-tier secret model |
| **Infrastructure** | Raw WebSocket server, named pipe transport, JSONL persistence, GitHub App token minting                |
| **DevOps**         | Cross-platform Bash, Docker sandboxing, GitHub Actions CI, supply chain hardening                      |
| **Product Design** | Complete 7-phase UX methodology encoded as executable AI skills                                        |
| **Security**       | OWASP-aware hook system, process-scoped secrets, ephemeral token architecture                          |
| **Open Source**    | MIT licensed, CONTRIBUTING.md, issue/PR templates, skill contribution spec                             |
