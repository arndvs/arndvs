# System B — comment scout local cron wrapper (Windows).
#
# Runs `pnpm comment:scout` and shapes output for Task Scheduler delivery:
#   - empty stdout / [SILENT]  → nothing actionable, deliver nothing
#   - normal output            → summary of what was queued
#   - failure                  → error message (Task Scheduler alerts)
#
# Mirrors MCRDSE's reddit_cron.py empty-stdout = no-delivery contract.
#
# Requires: local linkedin-mcp-server + logged-in browser session.
# Schedule via Task Scheduler (e.g. daily 6am).
#
# Usage: powershell -ExecutionPolicy Bypass -File scripts/comment-scout-cron.ps1

$ErrorActionPreference = "Stop"

# Kill switch — exit silently when disabled (mirrors MCRDSE research-only default).
if ($env:COMMENT_SCOUT_ENABLED -ne "true") {
    Write-Output "[SILENT] COMMENT_SCOUT_ENABLED != true — exiting."
    exit 0
}

# Resolve repo root (script lives in scripts/).
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$Output = & pnpm comment:scout 2>&1
$ExitCode = $LASTEXITCODE

if ($ExitCode -ne 0) {
    Write-Output "Comment scout failed:"
    Write-Output $Output
    exit 1
}

# Empty or [SILENT] output → no delivery.
$OutputText = $Output -join "`n"
if ([string]::IsNullOrWhiteSpace($OutputText) -or $OutputText.Contains("[SILENT]")) {
    exit 0
}

Write-Output "Comment scout run:"
Write-Output $OutputText
Write-Output "Nothing was posted to LinkedIn — drafts queued for human review."