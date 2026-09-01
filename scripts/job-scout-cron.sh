#!/usr/bin/env bash
# Job scout local cron wrapper.
#
# Runs `pnpm job:scout` and shapes output for cron delivery:
#   - empty stdout / [SILENT]  → nothing actionable, deliver nothing
#   - normal output            → summary of what was queued
#   - failure                  → error message (cron alerts)
#
# Mirrors MCRDSE's empty-stdout = no-delivery contract.
#
# Requires: linkedin-mcp-server daemon on http://127.0.0.1:8899/mcp
#           + logged-in browser session (~/.linkedin-mcp).
# Schedule via cron (e.g. daily 6am): 0 6 * * * /path/to/job-scout-cron.sh
set -euo pipefail

# Kill switch — exit silently when disabled (mirrors MCRDSE research-only default).
if [[ "${JOB_SCOUT_ENABLED:-false}" != "true" ]]; then
    echo "[SILENT] JOB_SCOUT_ENABLED != true — exiting."
    exit 0
fi

# Resolve repo root (script lives in scripts/).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

OUTPUT="$(pnpm job:scout 2>&1)" || {
    echo "Job scout failed:"
    echo "$OUTPUT"
    exit 1
}

# Empty or [SILENT] output → no delivery.
if [[ -z "$OUTPUT" || "$OUTPUT" == *"[SILENT]"* ]]; then
    exit 0
fi

echo "Job scout run:"
echo "$OUTPUT"
echo "Nothing was applied — job postings queued for human review."