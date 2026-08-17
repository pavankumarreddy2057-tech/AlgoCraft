#!/usr/bin/env bash
# ==============================================================================
# AlgoCraft Platform - Start Production Server (Bash)
# ==============================================================================
set -e

export NODE_ENV=production
export PORT=${PORT:-4000}

echo "🚀 [AlgoCraft] Starting Production Platform on port $PORT..."
cd "$(dirname "$0")/../server"
node dist/index.js
