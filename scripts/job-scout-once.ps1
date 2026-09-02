# One-shot job scout runner for Windows — the daily entry point.
#
# Ensures the linkedin-mcp daemon is up, then runs `pnpm job:scout`.
# Stdout discipline mirrors MCRDSE: empty/[SILENT] = no delivery.
#
# Schedule via Task Scheduler (e.g. daily 6am):
#   powershell -ExecutionPolicy Bypass -File scripts/job-scout-once.ps1
#
# Also handles the daemon boot-time case (Task Scheduler may fire the scout
# before the logon-triggered daemon script).

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

# 0. Mutex — prevent overlapping runs (Task Scheduler can fire the scout
#    from both a logon trigger and a daily trigger, plus "run as soon as
#    possible after a missed start"). If another scout is running, exit
#    silently (no delivery) rather than double-persisting jobs.
$MutexName = "Global\ArndvsJobScout"
$Mutex = New-Object System.Threading.Mutex($false, $MutexName)
$Acquired = $false
try {
    $Acquired = $Mutex.WaitOne(0)  # non-blocking: fail fast if held
} catch {
    # Mutex creation can fail in odd session contexts; proceed without it.
    $Acquired = $true
}
if (-not $Acquired) {
    Write-Output "[SILENT] Another job scout run is in progress — exiting."
    exit 0
}

try {
    # 1. Ensure the daemon is running.
    & (Join-Path $RepoRoot "scripts\start-linkedin-mcp-daemon.ps1") | Out-Host
    $Port = if ($env:LINKEDIN_MCP_PORT) { $env:LINKEDIN_MCP_PORT } else { "8899" }
    $daemonUp = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $daemonUp) {
        Write-Output "linkedin-mcp daemon failed to start — aborting scout."
        exit 1
    }

    # 2. Run the scout.
    $Output = & pnpm job:scout 2>&1
    $ExitCode = $LASTEXITCODE
    if ($ExitCode -ne 0) {
        Write-Output "Job scout failed:"
        Write-Output $Output
        exit 1
    }

    # 3. Empty or [SILENT] output → no delivery.
    $OutputText = $Output -join "`n"
    if ([string]::IsNullOrWhiteSpace($OutputText) -or $OutputText.Contains("[SILENT]")) {
        exit 0
    }

    Write-Output "Job scout run:"
    Write-Output $OutputText
    Write-Output "Nothing was applied — job postings queued for human review."
}
finally {
    if ($Acquired) {
        $Mutex.ReleaseMutex()
    }
    $Mutex.Dispose()
}