# ==============================================================================
# AlgoCraft Platform - Problem Validation Harness (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "🧪 [AlgoCraft] Executing automated problem validator..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\server"
npx tsx src/validator/problem-validator.ts
