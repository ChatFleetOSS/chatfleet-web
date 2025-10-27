# syntax=docker/dockerfile:1.7

FROM node:20-bullseye-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-bullseye-slim AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE=/api
ARG NEXT_PUBLIC_SSE_HEARTBEAT_MS=15000
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_SSE_HEARTBEAT_MS=${NEXT_PUBLIC_SSE_HEARTBEAT_MS}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# non-root user
RUN useradd -m nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

