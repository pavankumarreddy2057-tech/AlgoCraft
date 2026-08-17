#!/usr/bin/env bash
# ==============================================================================
# AlgoCraft Platform - Full Initial Setup Script (Bash)
# ==============================================================================
set -e

echo "🚀 [AlgoCraft] Setting up dependencies..."
npm install
npm --prefix server install
npm --prefix client install

echo "📦 [AlgoCraft] Compiling backend and frontend bundles..."
npm run build

echo "🌱 [AlgoCraft] Syncing 110+ problem definitions to SQLite database..."
npm run seed

echo "🧪 [AlgoCraft] Running automated problem validator suite..."
npm run validate

echo "✅ [AlgoCraft] Setup completed successfully!"
echo "👉 Run 'npm run dev' to start development environment."
