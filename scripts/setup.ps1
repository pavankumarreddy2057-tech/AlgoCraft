# ==============================================================================
# AlgoCraft Platform - Full Initial Setup Script (PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "🚀 [AlgoCraft] Setting up dependencies..." -ForegroundColor Cyan
npm install
npm --prefix server install
npm --prefix client install

Write-Host "📦 [AlgoCraft] Compiling backend and frontend bundles..." -ForegroundColor Cyan
npm run build

Write-Host "🌱 [AlgoCraft] Syncing 110+ problem definitions to SQLite database..." -ForegroundColor Cyan
npm run seed

Write-Host "🧪 [AlgoCraft] Running automated problem validator suite..." -ForegroundColor Cyan
npm run validate

Write-Host "✅ [AlgoCraft] Setup completed successfully!" -ForegroundColor Green
Write-Host "👉 Run 'npm run dev' to start development environment." -ForegroundColor Yellow
