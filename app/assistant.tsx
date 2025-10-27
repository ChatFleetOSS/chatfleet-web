"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AssistantRuntimeProvider,
  type ChatModelAdapter,
  useLocalRuntime,
} from "@assistant-ui/react";

import { Thread } from "@/components/assistant-ui/thread";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/auth-provider";
import { streamChat } from "@/lib/chat/stream";
import type { ChatRequest, Citation } from "@/schemas";
import { useTranslation } from "@/hooks/use-translation";

const API_BASE = process.env.NEXT_PUBLIC_RAG_API || "http://localhost:8000";

type AssistantProps = {
  ragSlug?: string;
};

export const Assistant = ({ ragSlug }: AssistantProps) => {
  const { token } = useAuth();
  const [rags, setRags] = useState<string[]>(ragSlug ? [ragSlug] : []);
  const [selectedRag, setSelectedRag] = useState(
    ragSlug ?? (ragSlug ? "" : rags[0] ?? ""),
  );
  const t = useTranslation();

  useEffect(() => {
    if (!token || ragSlug) return;

    fetch(`${API_BASE}/api/rag/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data.items) ? data.items : [];
        const slugs = items.map((item: { slug: string }) => item.slug);
        setRags(slugs);
        if (!selectedRag && slugs.length) {
          setSelectedRag(slugs[0]!);
        }
      })
      .catch(console.error);
  }, [token, ragSlug, selectedRag]);

  useEffect(() => {
    if (ragSlug) {
      setSelectedRag(ragSlug);
    }
  }, [ragSlug]);

  const formatWithCitations = useCallback(
    (body: string, citations: Citation[]) => {
      const trimmed = body.trim();
      if (!trimmed && !citations.length) {
        return "";
      }

      if (!citations.length) {
        return trimmed;
      }

      const sources = citations
        .map((citation, index) =>
          t("assistant.sourcesEntry", {
            position: index + 1,
            filename: citation.filename,
            pages: citation.pages.join(", "),
          }),
        )
        .join("\n");

      return `${trimmed}\n\n${t("assistant.sources")}:\n${sources}`.trim();
    },
    [t],
  );

  const chatAdapter = useMemo<ChatModelAdapter>(() => {
    return {
      async *run({ messages, abortSignal }) {
        if (!token) {
          throw new Error("Not authenticated");
        }
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

        for await (const event of streamChat(token, payload, {
          signal: abortSignal,
        })) {
          switch (event.type) {
            case "chunk":
              if (event.delta) {
                accumulated += event.delta;
              }
              break;
            case "citations":
              citations = event.citations;
              break;
            case "done": {
              const text = formatWithCitations(accumulated, citations);
              if (text) {
                yield {
                  content: [
                    {
                      type: "text",
                      text,
                    },
                  ],
                };
              }
              accumulated = "";
              citations = [];
              break;
            }
            case "error":
              throw new Error(
                event.envelope.error?.message ?? "Chat stream error",
              );
            default:
              break;
          }
        }
      },
    };
  }, [formatWithCitations, selectedRag, token]);

  const runtime = useLocalRuntime(chatAdapter);
  const showHeader = !ragSlug;

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-full flex-1 flex-col">
        {showHeader ? (
          <header className="flex items-center gap-4 border-b border-border px-6 py-4">
            <h1 className="text-lg font-semibold text-foreground">ChatFleet</h1>
            <Separator orientation="vertical" className="h-6" />
            <select
              value={selectedRag}
              onChange={(e) => setSelectedRag(e.target.value)}
              className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
              aria-label={t("assistant.selector.label")}
            >
              {rags.length === 0 ? (
                <option value="">{t("assistant.selector.placeholder")}</option>
              ) : null}
              {rags.map((rag) => (
                <option key={rag} value={rag}>
                  {rag}
                </option>
              ))}
            </select>
          </header>
        ) : null}
        <div className="flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>
    </AssistantRuntimeProvider>
  );
};
