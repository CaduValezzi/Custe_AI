# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Force IPv4-first DNS resolution. Docker Desktop's NAT routes IPv4 but often
# leaves IPv6 broken; Node 17+ tries IPv6 first and the connection hangs/resets
# — surfacing as npm ECONNRESET even though the host installs fine.
ENV NODE_OPTIONS=--dns-result-order=ipv4first

# Copy package files (lockfile only — no yarn.lock so npm ci uses npm)
COPY package.json package-lock.json .npmrc ./

# Install dependencies.
# The mounted /root/.npm cache persists across builds (survives layer
# invalidation) AND across failed attempts within this loop — each `npm ci`
# that dies mid-download has already saved its finished tarballs to the cache,
# so the next iteration only fetches what's missing. This turns a flaky
# connection into a self-healing one instead of a hard failure.
RUN --mount=type=cache,target=/root/.npm \
    set -e; \
    for i in 1 2 3 4 5; do \
      echo "== npm ci attempt $i =="; \
      if npm ci --no-audit --no-fund; then exit 0; fi; \
      echo "attempt $i failed — retrying (cache preserves progress)..."; \
      sleep 5; \
    done; \
    exit 1

# Copy source code
COPY . .

# Build the application (webpack bundler — Turbopack has a UTF-8 panic on
# accented host paths, and the script is baked into package.json).
# `next build` also downloads the platform SWC binary to /root/.cache/next-swc;
# the same flaky connection that bit `npm ci` can drop that multi-10s download
# ("other side closed"). Mount a cache on /root/.cache so partial downloads
# survive, and retry exactly like the npm ci loop above.
RUN --mount=type=cache,target=/app/.next/cache \
    --mount=type=cache,target=/root/.cache \
    set -e; \
    for i in 1 2 3 4 5; do \
      echo "== next build attempt $i =="; \
      if npm run build; then exit 0; fi; \
      echo "build attempt $i failed — retrying (SWC cache preserves progress)..."; \
      sleep 5; \
    done; \
    exit 1

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone output (includes server.js, minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
