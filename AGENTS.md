# ChatFleet Web — Agent Guide

This Next.js (app router) frontend targets the ChatFleet API.

## Project Notes
- Runtime: Next.js 14 standalone (Node 20). See `Dockerfile`.
- API base: proxied via Caddy to `/api`; in CI/edge builds we set `NEXT_PUBLIC_API_BASE=/api`.
- Auth: login/register pages under `app/(auth)/`; the register toggle is enabled in `app/(auth)/login/page.tsx`.

## Dev Scripts
- Install: `npm ci`
- Dev: `npm run dev`
- Build: `npm run build` (standalone output)

## Config & Env
- `next.config.ts` — ignores type/ESLint in CI builds to ease container builds.
- Public vars used by the app:
  - `NEXT_PUBLIC_API_BASE` — defaults to `/api` behind Caddy
  - `NEXT_PUBLIC_SSE_HEARTBEAT_MS` — default 15000

## Contracts & Schemas
- Zod schemas and client types: `schemas/index.ts`
- Pact (consumer) artifact: `pacts/ChatFleet-Frontend-ChatFleet-API.json`

## CI/CD
- GitHub Actions build/push: `.github/workflows/ci.yml`
  - Publishes `ghcr.io/chatfleetoss/chatfleet-web` on tags and an `:edge` image on main.

