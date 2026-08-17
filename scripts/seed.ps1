# ==============================================================================
# AlgoCraft Platform - Database Seed Sync Script (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "🌱 [AlgoCraft] Syncing JSON problem files into SQLite database..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\server"
npx tsx src/db/seed-loader.ts
