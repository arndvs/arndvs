# Engine — LinkedIn Awareness

The engine module for the LinkedIn awareness system. Two systems share this code:

- **System A — Content Ship** (weekly): git commits → changelog → LinkedIn post draft → Halbert edit → Sanity `socialDraft`. Runs in **GitHub Actions** (`.github/workflows/content-ship.yml`).
- **System B — Comment Scout** (daily): discover LinkedIn conversations → score → draft comments → Sanity `socialDraft`. **Runs locally** (needs a logged-in browser session).

## Scripts

| Script                           | System | Host                     | Purpose                                             |
| -------------------------------- | ------ | ------------------------ | --------------------------------------------------- |
| `pnpm linkedin:draft`            | A      | GitHub Actions (weekly)  | Draft a LinkedIn post from the latest weekly digest |
| `pnpm comment:scout`             | B      | Local (daily)            | Discover + score + draft comments (research-only)   |
| `scripts/comment-scout-cron.sh`  | B      | Local cron (macOS/Linux) | Cron wrapper — empty stdout = no delivery           |
| `scripts/comment-scout-cron.ps1` | B      | Windows Task Scheduler   | Cron wrapper (Windows)                              |

## System B — local scheduler setup

The comment scout uses `linkedin-mcp-server` (stickerdaniel, Apache-2.0), which needs a **persistent logged-in browser session** (Patchright/Chromium). It cannot run in GitHub Actions CI — it must run on a machine with the LinkedIn session.

### Prerequisites

1. Install `uv` (https://docs.astral.sh/uv/) — the MCP server runs via `uvx mcp-server-linkedin@latest`.
2. Log in once: `uvx mcp-server-linkedin@latest --login` (opens a browser; the session persists under `~/.linkedin-mcp`).
3. Set `COMMENT_SCOUT_ENABLED=true` in the environment (kill-switch — when false, the cron exits silently).
4. Set `SANITY_API_TOKEN` + `OPENAI_API_KEY` (for persisting drafts).

### Windows (Task Scheduler)

1. Create a task: **Action** → Start a program → `powershell.exe` with args:
   `-ExecutionPolicy Bypass -File "C:\path\to\arndvs\scripts\comment-scout-cron.ps1"`
2. **Trigger** → Daily at 6:00 AM.
3. **Settings** → "Run task as soon as possible after a scheduled start is missed" (in case the machine was off).
4. Set the environment variables (COMMENT_SCOUT_ENABLED, SANITY_API_TOKEN, OPENAI_API_KEY) in the task's environment or a `.env.local` in the repo root.

### macOS / Linux (cron)

```cron
0 6 * * * cd /path/to/arndvs && COMMENT_SCOUT_ENABLED=true ./scripts/comment-scout-cron.sh
```

### Safety

- **Research-only**: the scout never posts. It discovers, scores, and drafts for human review in the ops console (`/ops`).
- **Kill switch**: `COMMENT_SCOUT_ENABLED != true` → the cron exits silently.
- **Empty stdout = no delivery**: nothing actionable → cron delivers nothing (mirrors MCRDSE's `reddit_cron.py` contract).

## Public / private boundary

- **Public**: all source code (the showcase).
- **Private**: Sanity data (Studio auth), secrets (env vars / GitHub Actions secrets).
- The engine never hardcodes credentials — everything comes from env.
