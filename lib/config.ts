export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ??
  "http://localhost:8000/api";

export const SSE_HEARTBEAT_MS = Number(
  process.env.NEXT_PUBLIC_SSE_HEARTBEAT_MS ?? "15000",
);

export const AUTH_STORAGE_KEY = "chatfleet.auth.token";

export const AGENT_META = {
  id: "frontend.chatfleet.integrator",
  version: "v0.1.1",
  mode: "incremental",
} as const;
