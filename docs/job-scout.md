# Job Scout — daily LinkedIn role search, save & apply pipeline

> Auto-discovers LinkedIn job postings against Aaron's role-fit collection,
> scores them, queues them in the `/ops` console for human review, and
> drafts application messages — **never auto-applies**.

## How it works

```
linkedin-mcp-server (streamable-http daemon, local)
  │  search_jobs (keyword + location + date-sorted)
  ▼
scripts/job-scout.ts (pnpm job:scout)
  │  discover → score (role-fit litmus) → dedupe by URL
  ▼
Sanity jobPosting docs (status: discovered)
  │
  ▼
/ops console → Jobs tab → Save / Skip / Expire → Draft application
  │
  ▼
socialDraft queue (sourceType: job) → human approves/edits → human applies
```

## Prerequisites (one-time setup)

1. **LinkedIn browser session**: run once interactively
   `uvx mcp-server-linkedin==4.22.0 --login` (saves to `~/.linkedin-mcp`).
2. **Daemon autostart**: register `scripts/start-linkedin-mcp-daemon.ps1`
   in Windows Task Scheduler (trigger: At logon, run whether logged in or
   not). This creates the pinned venv on first run and starts the daemon
   on `http://127.0.0.1:8899/mcp`.
3. **Daily scout**: register `scripts/job-scout-once.ps1` in Task Scheduler
   (trigger: daily 6:00 AM). It ensures the daemon, runs the scout, and
   prints nothing when there's nothing actionable (`[SILENT]`).
4. **Env**: set `JOB_SCOUT_ENABLED=true` in `.env.local` (kill switch, off
   by default). Requires `SANITY_API_TOKEN` + `OPENAI_API_KEY`.

## Version pin (critical)

```
mcp-server-linkedin==4.22.0
fastmcp==3.4.7
```

`@latest` (4.23.2) **crashes on boot** with
`FastMCP.tool() got an unexpected keyword argument 'exclude_args'`.
Newer fastmcp 4.x removed `exclude_args` — pinning `fastmcp==3.4.7` is
required. The venv is created once by the daemon script; do not let it
drift.

## The transport: streamable-http daemon (not stdio)

The server refuses to run with pipe-spawned stdio (`stdout is not a tty`
— it wants a real console). The proven pattern is:

```powershell
$env:TRANSPORT="streamable-http"
Start-Process $env:USERPROFILE\.linkedin-mcp\venv\Scripts\mcp-server-linkedin.exe `
  -ArgumentList "--daemon","--port","8899" -WindowStyle Hidden
```

`Start-Process` allocates a hidden but real console; `TRANSPORT` env
forces the HTTP transport (else it defaults to stdio and dies on
"Bad file descriptor" with no stdin).

## Role-fit profile

Hardcoded in `scripts/job-scout.ts` (the `PROFILE` const): titles
(Forward Deployed Engineer, Applied AI Engineer, Senior Full Stack,
AI Agent Engineer, Software Engineering Generalist, AI Solutions
Engineer), skills, locations (San Diego, Remote), and company tiers
(Anthropic/OpenAI +12, Adobe/Vercel/Linear/Sanity/Runway +8).

The score gates at 50 for `review`; jobs over 7 days old are rejected.

## Never-applies invariant

- `linkedin-jobs-client.ts` only calls `search_jobs` / `get_job_details`
  (read-only MCP tools).
- `jobPosting` status machine: `discovered → saved → applied | skip | expired`.
  You **cannot** go `discovered → applied` directly — must save first.
- Application drafts land in the `socialDraft` queue for human review;
  nothing is sent without a human.