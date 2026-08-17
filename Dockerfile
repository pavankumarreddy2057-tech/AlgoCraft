# ==============================================================================
# AlgoCraft Platform - Multi-Stage Production Dockerfile
# Full self-contained container with Node.js 22 + Python 3 + SQLite + Frontend SPA
# ==============================================================================

# Stage 1: Build Frontend SPA
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Backend Server
FROM node:22-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Final Production Runtime
FROM node:22-slim AS runner

# Install Python 3 for offline Python code execution sandbox
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=4000
ENV PYTHONUNBUFFERED=1

# Copy Root & Server package manifests
COPY package*.json ./
COPY server/package*.json ./server/

# Install production dependencies only
WORKDIR /app/server
RUN npm install --omit=dev

# Copy compiled backend dist and runtime files
COPY --from=server-builder /app/server/dist ./dist
COPY server/src/runner/wrappers ./dist/runner/wrappers
COPY server/src/runner/wrappers ./src/runner/wrappers
COPY server/src/db/schema.sql ./src/db/schema.sql
COPY server/data ./data

# Copy built frontend SPA assets
COPY --from=client-builder /app/client/dist /app/client/dist

# Copy problem definitions bank
WORKDIR /app
COPY problems ./problems

WORKDIR /app/server

# Expose HTTP Port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

# Start Server
CMD ["node", "dist/index.js"]
