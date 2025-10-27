import { API_BASE } from "@/lib/config";
import { ApiError, AuthError } from "@/lib/errors";
import type { ErrorEnvelope } from "@/schemas";
import type { ZodSchema } from "zod";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions<
  TSchema extends ZodSchema | undefined = ZodSchema | undefined,
> {
  path: string;
  method?: HttpMethod;
  token?: string | null;
  body?: unknown;
  schema?: TSchema;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function buildUrl(path: string) {
  const trimmed = path.startsWith("/")
    ? path
    : `/${path}`;
  return `${API_BASE}${trimmed}`;
}

async function parseError(res: Response): Promise<ErrorEnvelope | undefined> {
  try {
    const data = await res.clone().json();
    return data?.error ? (data as ErrorEnvelope) : undefined;
  } catch {
    return undefined;
  }
}

export async function request<TData>(
  opts: RequestOptions<ZodSchema<TData> | undefined>,
): Promise<TData> {
  const { path, method = "GET", body, schema, token, signal, headers } = opts;
  const url = buildUrl(path);

  const init: RequestInit = {
    method,
    headers: {
      ...jsonHeaders,
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  };

  if (body !== undefined) {
    init.body =
      body instanceof FormData ? body : JSON.stringify(body);
    if (body instanceof FormData) {
      delete (init.headers as Record<string, string>)["Content-Type"];
    }
  }

  const res = await fetch(url, init);

  if (res.status === 401) {
    throw new AuthError();
  }

  if (!res.ok) {
    const envelope = await parseError(res);
    throw new ApiError(
      envelope?.error.message ??
        `Request failed with status ${res.status}`,
      {
        status: res.status,
        envelope,
      },
    );
  }

  if (res.status === 204 || res.headers.get("Content-Length") === "0") {
    return undefined as TData;
  }

  const contentType = res.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new ApiError("Unexpected response content type", {
      status: res.status,
    });
  }

  const json = await res.json();
  if (!schema) {
    return json as TData;
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError("Response validation failed", {
      status: res.status,
    });
  }

  return parsed.data;
}
