import { API_BASE, SSE_HEARTBEAT_MS } from "@/lib/config";
import { ApiError } from "@/lib/errors";
import type { ChatRequest, Citation, Usage } from "@/schemas";
import { Citation as CitationSchema, Usage as UsageSchema, UUID } from "@/schemas";
import { z } from "zod";

const ReadyEvent = z.object({ corr_id: UUID });
const ChunkEvent = z.object({ delta: z.string() });
const CitationsEvent = z.array(CitationSchema);
const DoneEvent = z.object({ usage: UsageSchema });
const ErrorEvent = z.object({ error: z.any(), corr_id: UUID }).passthrough();

export type ChatStreamEvent =
  | { type: "ready"; corrId: string }
  | { type: "chunk"; delta: string }
  | { type: "citations"; citations: Citation[] }
  | { type: "done"; usage: Usage }
  | { type: "ping" }
  | { type: "error"; envelope: z.infer<typeof ErrorEvent> };

const RETRY_MS = SSE_HEARTBEAT_MS;

function decodeEvent(raw: string): { event?: string; data?: string } {
  const lines = raw.split(/\r?\n/);
  let eventName: string | undefined;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith("event:") && line.includes("data:")) {
      const [eventPart, dataPart] = line.split("data:");
      eventName = eventPart.slice(6).trim();
      dataLines.push(dataPart.trim());
      continue;
    }

    if (line.includes("event:") && line.includes("data:")) {
      const eventIndex = line.indexOf("event:");
      const dataIndex = line.indexOf("data:");
      if (eventIndex !== -1) {
        eventName = line.slice(eventIndex + 6, dataIndex).trim();
        dataLines.push(line.slice(dataIndex + 5).trim());
      }
      continue;
    }

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  return {
    event: eventName,
    data: dataLines.length ? dataLines.join("\n") : undefined,
  };
}

async function* parseSSE(stream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          yield buffer;
        }
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const chunk = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 2);
        if (chunk) {
          yield chunk;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function* streamChat(
  token: string,
  payload: ChatRequest,
  opts: { signal?: AbortSignal } = {},
): AsyncGenerator<ChatStreamEvent> {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text();
    throw new ApiError(
      text || `Chat stream failed with status ${res.status}`,
      {
        status: res.status,
      },
    );
  }

  const retryHeader = res.headers.get("retry") ?? res.headers.get("Retry-After");
  if (retryHeader) {
    // Future: hook retry interval from server
  }

  for await (const raw of parseSSE(res.body)) {
    const { event, data } = decodeEvent(raw);
    if (!event) continue;

    switch (event) {
      case "ready": {
        if (!data) continue;
        const parsed = ReadyEvent.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        yield { type: "ready", corrId: parsed.data.corr_id };
        break;
      }
      case "chunk": {
        if (!data) continue;
        const parsed = ChunkEvent.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        yield { type: "chunk", delta: parsed.data.delta };
        break;
      }
      case "citations": {
        if (!data) continue;
        const parsed = CitationsEvent.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        yield { type: "citations", citations: parsed.data };
        break;
      }
      case "done": {
        if (!data) continue;
        const parsed = DoneEvent.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        yield { type: "done", usage: parsed.data.usage };
        break;
      }
      case "ping": {
        yield { type: "ping" };
        break;
      }
      case "error": {
        if (!data) continue;
        const parsed = ErrorEvent.safeParse(JSON.parse(data));
        if (!parsed.success) continue;
        yield { type: "error", envelope: parsed.data };
        break;
      }
      default:
        break;
    }
  }

  // ensure heartbeat expectation is documented even if stream ends quietly
  await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
}
