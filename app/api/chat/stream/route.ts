// app/api/chat/stream/route.ts
import { NextRequest } from "next/server";
const PY = process.env.NEXT_PUBLIC_RAG_API ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const up = await fetch(`${PY}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!up.ok || !up.body) {
    const t = await up.text().catch(() => "");
    return new Response(t || "Upstream error", { status: up.status || 502 });
  }
  return new Response(up.body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
