FROM node:20-bullseye-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:20-bullseye-slim AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE=/api
ARG NEXT_PUBLIC_SSE_HEARTBEAT_MS=15000
ARG BUILD_VERSION=dev
ARG BUILD_COMMIT=local
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
ENV NEXT_PUBLIC_SSE_HEARTBEAT_MS=${NEXT_PUBLIC_SSE_HEARTBEAT_MS}
ENV NEXT_PUBLIC_CHATFLEET_BUILD_VERSION=${BUILD_VERSION}
ENV NEXT_PUBLIC_CHATFLEET_BUILD_COMMIT=${BUILD_COMMIT}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-bullseye-slim AS runner
WORKDIR /app
ARG BUILD_VERSION=dev
ARG BUILD_COMMIT=local
ENV NODE_ENV=production
ENV CHATFLEET_BUILD_VERSION=${BUILD_VERSION}
ENV CHATFLEET_BUILD_COMMIT=${BUILD_COMMIT}
ENV NEXT_PUBLIC_CHATFLEET_BUILD_VERSION=${BUILD_VERSION}
ENV NEXT_PUBLIC_CHATFLEET_BUILD_COMMIT=${BUILD_COMMIT}
# non-root user
RUN useradd -m nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
