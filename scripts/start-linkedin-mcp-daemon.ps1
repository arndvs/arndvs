# Ensures the linkedin-mcp-server daemon is running (creates the venv on
# first run). This is the piece the OS scheduler runs at boot/login.
#
# Transport: streamable-http on http://127.0.0.1:8899/mcp
# Version: mcp-server-linkedin==4.22.0 + fastmcp==3.4.7 (pinned — newer
# fastmcp 4.x crashes with 'exclude_args').
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/start-linkedin-mcp-daemon.ps1
#
# Register in Task Scheduler (on logon) or run from job-scout-once.ps1.

$ErrorActionPreference = "Stop"

$Port = if ($env:LINKEDIN_MCP_PORT) { $env:LINKEDIN_MCP_PORT } else { "8899" }
$VenvDir = Join-Path $env:USERPROFILE ".linkedin-mcp\venv"
$ServerExe = Join-Path $VenvDir "Scripts\mcp-server-linkedin.exe"
$Python = if ($env:PYTHON) { $env:PYTHON } else { "python" }

# 1. Create the venv + install the pinned server on first run.
if (-not (Test-Path $ServerExe)) {
    Write-Output "Creating linkedin-mcp venv at $VenvDir (one-time)..."
    & $Python -m venv $VenvDir
    if ($LASTEXITCODE -ne 0) { throw "Failed to create venv" }
    & (Join-Path $VenvDir "Scripts\python.exe") -m pip install --quiet `
        "mcp-server-linkedin==4.22.0" `
        "fastmcp==3.4.7"
    if ($LASTEXITCODE -ne 0) { throw "Failed to install linkedin-mcp-server" }
}

# 2. If the daemon is already listening, we're done.
$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Write-Output "linkedin-mcp daemon already running on port $Port."
    exit 0
}

# 3. Start the daemon detached (hidden window, real console) with the
#    streamable-http transport.
$env:TRANSPORT = "streamable-http"
$logDir = Join-Path $env:USERPROFILE ".linkedin-mcp\logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stdout = Join-Path $logDir "daemon-out.log"
$stderr = Join-Path $logDir "daemon-err.log"

Start-Process -FilePath $ServerExe `
    -ArgumentList "--daemon", "--port", $Port `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr

Write-Output "Started linkedin-mcp daemon on http://127.0.0.1:$Port/mcp"
Write-Output "Logs: $stdout / $stderr"