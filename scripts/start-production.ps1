# ==============================================================================
# AlgoCraft Platform - Start Production Server (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

$env:NODE_ENV = "production"
if (-not $env:PORT) { $env:PORT = "4000" }

Write-Host "🚀 [AlgoCraft] Starting Production Platform on port $env:PORT..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\server"
node dist/index.js
