function sanitizeBase(url: string) {
  if (url.length > 1 && url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
}

const rawPublicApiBase = process.env.NEXT_PUBLIC_API_BASE?.trim();
const defaultProxyBase = "/backend-api";
const isAbsolutePublicBase =
  rawPublicApiBase?.startsWith("http://") ||
  rawPublicApiBase?.startsWith("https://");

export const API_BASE = sanitizeBase(
  !rawPublicApiBase || isAbsolutePublicBase
    ? defaultProxyBase
    : rawPublicApiBase.length > 0
    ? rawPublicApiBase
    : defaultProxyBase,
);

const rawServerApiBase =
  process.env.BACKEND_API_BASE?.trim() ??
  (rawPublicApiBase && rawPublicApiBase.startsWith("http")
    ? rawPublicApiBase
    : undefined) ??
  "http://localhost:8000/api";

export const API_SERVER_BASE = sanitizeBase(rawServerApiBase);

export const SSE_HEARTBEAT_MS = Number(
  process.env.NEXT_PUBLIC_SSE_HEARTBEAT_MS ?? "15000",
);

export const AUTH_STORAGE_KEY = "chatfleet.auth.token";
export const BUILD_VERSION =
  process.env.NEXT_PUBLIC_CHATFLEET_BUILD_VERSION ?? "dev";
export const BUILD_COMMIT =
  process.env.NEXT_PUBLIC_CHATFLEET_BUILD_COMMIT ?? "local";

export const AGENT_META = {
  id: "frontend.chatfleet.integrator",
  version: BUILD_VERSION,
  mode: "incremental",
} as const;
