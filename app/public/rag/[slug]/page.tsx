"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Globe2Icon } from "lucide-react";

import { listPublicRags } from "@/lib/apiClient";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Thread } from "@/components/assistant-ui/thread";
import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";
import type { Citation, ChatRequest } from "@/schemas";
import { streamChatPublic } from "@/lib/chat/streamPublic";

const normalizeSuggestions = (inputs: string[] | undefined): string[] => {
  if (!inputs || inputs.length === 0) return [];
  const out: string[] = [];
  const push = (val: string) => {
    const cleaned = val.trim().replace(/^[\[\"]+/, "").replace(/[\]\"]+$/, "").trim();
    if (cleaned && !out.includes(cleaned)) {
      out.push(cleaned);
    }
  };
  for (const item of inputs) {
    if (!item) continue;
    const text = String(item).trim();
    if (text.startsWith("[") && text.endsWith("]")) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          parsed.filter((p) => typeof p === "string").forEach((p) => push(p));
          continue;
        }
      } catch {
        // fall through
      }
    }
    push(text);
  }
  return out.slice(0, 6);
};

export default function PublicRagPage() {
  const params = useParams<{ slug: string }>();
  const slug = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );
  const router = useRouter();
  const t = useTranslation();

  const { data: ragList } = useQuery({
    queryKey: ["public-rag-list"],
    queryFn: () => listPublicRags(),
  });
  const summary = ragList?.items.find((item) => item.slug === slug);

  const [selectedRag] = useState(slug);

  const displayName = useMemo(() => {
    if (summary?.name) return summary.name;
    if (slug) {
      const spaced = slug
        .replace(/[-_]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .trim();
      const titled = spaced
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      return titled || slug;
    }
    throw new Error("Missing public assistant slug");
  }, [slug, summary?.name]);

  const description = summary?.description ?? t("publicRag.description.missing");

  const formatWithCitations = useCallback(
    (body: string, citations: Citation[]) => {
      const trimmed = body.trim();
      if (!trimmed && !citations.length) return "";
      if (!citations.length) return trimmed;
      const filtered = citations.filter((c) => {
        const name = (c.filename ?? "").trim().toLowerCase();
        const normalized = name.replace(/[.\s]+$/g, "");
        return normalized !== "sources indisponibles";
      });
      if (!filtered.length) return trimmed;
      const sources = filtered
        .map((citation, index) => `${index + 1}. ${citation.filename} · pages ${citation.pages.join(", ")}`)
        .join("\n");
      return `${trimmed}\n\n${t("assistant.sources")}:\n${sources}`.trim();
    },
    [t],
  );

  const chatAdapter = useMemo<ChatModelAdapter>(() => {
    return {
      async *run({ messages, abortSignal }) {
        if (!selectedRag) {
          throw new Error("No RAG selected");
        }
        const payload: ChatRequest = {
          rag_slug: selectedRag,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content
              .filter((piece) => piece.type === "text")
              .map((piece) => piece.text)
              .join(" ")
              .trim(),
          })),
        };

        let accumulated = "";
        let citations: Citation[] = [];

        for await (const event of streamChatPublic(payload, { signal: abortSignal })) {
          switch (event.type) {
            case "chunk":
              accumulated += event.delta ?? "";
              break;
            case "citations":
              citations = event.citations;
              break;
            case "done": {
              const text = formatWithCitations(accumulated, citations);
              if (text) {
                yield { content: [{ type: "text", text }] };
              }
              accumulated = "";
              citations = [];
              break;
            }
            case "error":
              yield {
                content: [
                  {
                    type: "text",
                    text: event.envelope.error?.message ?? t("assistant.error.noContext"),
                  },
                ],
              };
              accumulated = "";
              citations = [];
              break;
            default:
              break;
          }
        }
      },
    };
  }, [selectedRag, t, formatWithCitations]);

  const runtime = useLocalRuntime(chatAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-1 flex-col bg-background">
        <header className="border-b border-border bg-background px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/public")}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            <span>{t("publicRag.back")}</span>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-6">
            <section className="rounded-2xl border border-border bg-muted/50 p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                  <Globe2Icon className="size-4" />
                  {t("publicRag.visibility.public")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("publicRag.hero.subtitle")}
                </p>
              </div>
              <div className="mt-3 space-y-2">
                <h1 className="text-3xl font-semibold leading-tight text-foreground">
                  {displayName}
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </section>

            <section className="flex min-h-[60vh] flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <div className="text-sm font-semibold text-foreground">
                  {t("publicRag.prompt.title")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("publicRag.prompt.subtitle")}
                </p>
              </div>
              <div className="flex-1">
                <Thread
                  suggestions={normalizeSuggestions(summary?.suggestions).map((prompt) => ({ prompt }))}
                  suggestionsPlacement="welcome"
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}
