#!/usr/bin/env bash
# ==============================================================================
# AlgoCraft Platform - Database Seed Sync Script (Bash)
# ==============================================================================
set -e

echo "🌱 [AlgoCraft] Syncing JSON problem files into SQLite database..."
cd "$(dirname "$0")/../server"
npx tsx src/db/seed-loader.ts
