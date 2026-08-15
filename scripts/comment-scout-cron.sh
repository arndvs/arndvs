#!/usr/bin/env bash
# System B — comment scout local cron wrapper.
#
# Runs `pnpm comment:scout` and shapes output for cron delivery:
#   - empty stdout / [SILENT]  → nothing actionable, deliver nothing
#   - normal output            → summary of what was queued
#   - failure                  → error message (cron alerts)
#
# Mirrors MCRDSE's reddit_cron.py empty-stdout = no-delivery contract.
#
# Requires: local linkedin-mcp-server + logged-in browser session.
# Schedule via cron (e.g. daily 6am): 0 6 * * * /path/to/comment-scout-cron.sh
set -euo pipefail

# Kill switch — exit silently when disabled (mirrors MCRDSE research-only default).
if [[ "${COMMENT_SCOUT_ENABLED:-false}" != "true" ]]; then
    echo "[SILENT] COMMENT_SCOUT_ENABLED != true — exiting."
    exit 0
fi

# Resolve repo root (script lives in scripts/).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

OUTPUT="$(pnpm comment:scout 2>&1)" || {
    echo "Comment scout failed:"
    echo "$OUTPUT"
    exit 1
}

# Empty or [SILENT] output → no delivery.
if [[ -z "$OUTPUT" || "$OUTPUT" == *"[SILENT]"* ]]; then
    exit 0
fi

echo "Comment scout run:"
echo "$OUTPUT"
echo "Nothing was posted to LinkedIn — drafts queued for human review."