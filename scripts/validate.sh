#!/usr/bin/env bash
# ==============================================================================
# AlgoCraft Platform - Problem Validation Harness (Bash)
# ==============================================================================
set -e

echo "🧪 [AlgoCraft] Executing automated problem validator..."
cd "$(dirname "$0")/../server"
npx tsx src/validator/problem-validator.ts
