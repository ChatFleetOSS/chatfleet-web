"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { listPublicRags } from "@/lib/apiClient";
import { NavButton } from "@/components/ui/nav-button";

export default function PublicRagListPage() {
  const t = useTranslation();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-rag-list"],
    queryFn: () => listPublicRags(),
  });

  const items = data?.items ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("publicRag.list.title")}
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("publicRag.list.subtitle")}
        </h1>
        {isError ? (
          <button
            onClick={() => refetch()}
            className="text-sm text-destructive underline"
          >
            Retry
          </button>
        ) : null}
      </header>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          {t("publicRag.list.empty")}
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border bg-background">
          {items.map((rag) => (
            <li key={rag.slug}>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-sm font-medium text-foreground">
                    {rag.name}
                  </span>
                  <p className="text-sm text-muted-foreground">{rag.description}</p>
                </div>
                <NavButton
                  href={`/public/rag/${rag.slug}`}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80"
                >
                  <span>{t("publicRag.open")}</span>
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </NavButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
