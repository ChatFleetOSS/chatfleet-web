"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Globe2Icon } from "lucide-react";

import { getPublicRagDocs, listPublicRags } from "@/lib/apiClient";
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

  const docsQuery = useQuery({
    queryKey: ["public-rag-docs", slug],
    queryFn: () => getPublicRagDocs(slug),
    enabled: Boolean(slug),
  });

  const [selectedRag] = useState(slug);

  const formatWithCitations = useCallback(
    (body: string, citations: Citation[]) => {
      const trimmed = body.trim();
      if (!trimmed && !citations.length) return "";
      if (!citations.length) return trimmed;
      const sources = citations
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
      <div className="flex h-full flex-1 flex-col">
        <header className="border-b border-border bg-background px-6 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/public")} className="flex items-center gap-2">
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            <span>{t("publicRag.back")}</span>
          </Button>
        </header>

        <div className="border-b border-border bg-muted/30 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
              <Globe2Icon className="size-4" />
              {t("publicRag.visibility.public")}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("publicRag.hero.subtitle")}
            </p>
          </div>
          <div className="mt-3 space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">{summary?.name ?? slug}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {summary?.description || t("publicRag.hero.descriptionFallback")}
            </p>
          </div>
        </div>

        <div className="border-b border-border px-6 py-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("publicRag.docsTitle")}
          </div>
          <div className="mt-2 space-y-2">
            {docsQuery.data?.docs?.length ? (
              docsQuery.data.docs.map((doc) => (
                <div
                  key={doc.doc_id}
                  className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
                >
                  <span className="text-sm text-foreground">{doc.filename}</span>
                  <span className="text-xs text-muted-foreground">{doc.chunk_count} chunks</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">—</div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
}
