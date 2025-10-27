"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listRags } from "@/lib/apiClient";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ShieldIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function DashboardPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const t = useTranslation();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rag-list"],
    queryFn: () => {
      if (!token) {
        throw new Error("Missing auth token");
      }
      return listRags(token);
    },
    enabled: Boolean(token),
  });

  const items = useMemo(() => data?.items ?? [], [data]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t("dashboard.workspaceOverview")}
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          {t("dashboard.welcome", { name: user?.name ?? t("dashboard.defaultName") })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("dashboard.intro")}
          <code className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">
            /api/rag/list
          </code>
          .
        </p>
      </header>

      {isError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {t("dashboard.error")}
          <Button
            variant="link"
            className="ml-2 px-0 text-destructive"
            onClick={() => refetch()}
          >
            {t("dashboard.retry")}
          </Button>
        </div>
      ) : null}

      <section className="flex flex-col gap-4 rounded-md border border-border bg-background">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-medium text-foreground">
            {t("dashboard.accessibleAssistants", {
              count: isLoading ? "…" : String(items.length),
            })}
          </h2>
          {user?.role === "admin" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2"
            >
              <ShieldIcon aria-hidden="true" className="size-4" />
              <span>{t("dashboard.openAdminConsole")}</span>
            </Button>
          ) : null}
        </header>

        {isLoading ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            {t("dashboard.loadingAssistants")}
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">
            {t("dashboard.emptyAssistants")}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((rag) => (
              <li key={rag.slug}>
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-sm font-medium text-foreground">
                      {rag.name}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {rag.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/rag/${rag.slug}`)}
                    className="flex items-center gap-2 bg-muted text-foreground hover:bg-muted/80"
                  >
                    <span>{t("dashboard.select")}</span>
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
