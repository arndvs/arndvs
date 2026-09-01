# Job scout local cron wrapper (Windows).
#
# Runs `pnpm job:scout` and shapes output for Task Scheduler delivery:
#   - empty stdout / [SILENT]  → nothing actionable, deliver nothing
#   - normal output            → summary of what was queued
#   - failure                  → error message (Task Scheduler alerts)
#
# Mirrors MCRDSE's empty-stdout = no-delivery contract.
#
# Requires: linkedin-mcp-server daemon on http://127.0.0.1:8899/mcp
#           + logged-in browser session (~/.linkedin-mcp).
# Schedule via Task Scheduler (e.g. daily 6am).
#
# Usage: powershell -ExecutionPolicy Bypass -File scripts/job-scout-cron.ps1

$ErrorActionPreference = "Stop"

# Kill switch — exit silently when disabled (mirrors MCRDSE research-only default).
if ($env:JOB_SCOUT_ENABLED -ne "true") {
    Write-Output "[SILENT] JOB_SCOUT_ENABLED != true — exiting."
    exit 0
}

# Resolve repo root (script lives in scripts/).
$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

$Output = & pnpm job:scout 2>&1
$ExitCode = $LASTEXITCODE

if ($ExitCode -ne 0) {
    Write-Output "Job scout failed:"
    Write-Output $Output
    exit 1
}

# Empty or [SILENT] output → no delivery.
$OutputText = $Output -join "`n"
if ([string]::IsNullOrWhiteSpace($OutputText) -or $OutputText.Contains("[SILENT]")) {
    exit 0
}

Write-Output "Job scout run:"
Write-Output $OutputText
Write-Output "Nothing was applied — job postings queued for human review."