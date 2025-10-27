"use client";

import Link from "next/link";
import { useMemo, useId } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { adminConfig, adminListUsers, listAdminRags } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLanguage, type Locale } from "@/components/providers/language-provider";
import { useTranslation } from "@/hooks/use-translation";
import { AdminSection } from "@/components/admin/admin-section";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";
  const { locale, setLocale } = useLanguage();
  const t = useTranslation();
  const languageSelectId = useId();

  const ragQuery = useQuery({
    queryKey: ["admin-rags"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return listAdminRags(token);
    },
    enabled: isAdmin && Boolean(token),
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return adminListUsers(token);
    },
    enabled: isAdmin && Boolean(token),
  });

  const configQuery = useQuery({
    queryKey: ["admin-config"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return adminConfig(token);
    },
    enabled: isAdmin && Boolean(token),
  });

  const configItems = useMemo(() => {
    const data = configQuery.data;
    if (!data) return [] as Array<{ label: string; value: string; monospace?: boolean }>;
    return [
      {
        label: t("admin.runtime.chatModel"),
        value: data.chat_model ?? "—",
      },
      {
        label: t("admin.runtime.embeddingModel"),
        value: data.embed_model ?? "—",
      },
      {
        label: t("admin.runtime.indexDir"),
        value: data.index_dir ?? "—",
        monospace: true,
      },
      {
        label: t("admin.runtime.uploadDir"),
        value: data.upload_dir ?? "—",
        monospace: true,
      },
      {
        label: t("admin.runtime.maxUpload"),
        value: data.max_upload_mb ? `${data.max_upload_mb} MB` : "—",
      },
    ];
  }, [configQuery.data, t]);

  const userStats = useMemo(() => {
    const data = usersQuery.data;
    if (!data) return [] as Array<{ label: string; value: number }>;
    return [
      {
        label: t("admin.users.total"),
        value: data.items.length ?? 0,
      },
      {
        label: t("admin.users.admins"),
        value: data.items.filter((item) => item.role === "admin").length ?? 0,
      },
    ];
  }, [usersQuery.data, t]);

  if (!isAdmin) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          {t("adminAccess.needsAdmin")}
        </p>
        <Button variant="outline" asChild>
          <Link href="/">{t("adminAccess.backToDashboard")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-rows-[48px_1fr]">
      <div className="flex items-center gap-2 bg-background px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push("/")}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          <span>{t("common.backHome")}</span>
        </Button>
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t("admin.header.overview")}
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              {t("admin.header.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("admin.header.subtitle")}
            </p>
          </div>
        </header>

        <AdminSection
          title={t("admin.language.label")}
          description={t("admin.language.description")}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("admin.language.helper")}
            </p>
            <label
              htmlFor={languageSelectId}
              className="flex w-full flex-col gap-2 text-sm text-foreground sm:max-w-xs"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {t("admin.language.label")}
              </span>
              <LanguageSelector
                id={languageSelectId}
                locale={locale}
                onChange={setLocale}
              />
            </label>
          </div>
        </AdminSection>

        <AdminSection
          title={t("admin.runtime.title")}
          description={t("admin.runtime.description")}
        >
          {configQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("admin.runtime.loading")}
            </p>
          ) : (
            <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {configItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1 text-sm font-medium text-foreground break-words",
                      item.monospace && "font-mono text-xs",
                    )}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </AdminSection>

        <AdminSection
          title={t("admin.users.title")}
          description={t("admin.users.subtitle")}
        >
          {usersQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("admin.users.loading")}
            </p>
          ) : (
            <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              {userStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-muted/30 px-3 py-2"
                >
                  <dt className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </AdminSection>

        <AdminSection
          title={t("admin.ragSection.title")}
          description={t("admin.ragSection.subtitle")}
          actions={
            <Button variant="default" size="sm" asChild>
              <Link href="/admin/rag/new" className="flex items-center gap-2">
                <PlusIcon aria-hidden="true" className="size-4" />
                <span>{t("common.createRag")}</span>
              </Link>
            </Button>
          }
        >
          <div className="divide-y divide-border text-sm text-muted-foreground">
            {ragQuery.isLoading ? (
              <p className="py-3">{t("admin.ragSection.loading")}</p>
            ) : ragQuery.data?.items.length ? (
              ragQuery.data.items.map((rag) => (
                <div
                  key={rag.slug}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{rag.name}</p>
                    <p>{rag.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start bg-muted text-foreground hover:bg-muted/80 sm:self-auto"
                    asChild
                  >
                    <Link href={`/admin/rag/${rag.slug}`}>{t("admin.manage")}</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="py-3">{t("admin.ragSection.empty")}</p>
            )}
          </div>
        </AdminSection>
      </div>
    </div>
  );
}

const LanguageSelector = ({
  locale,
  onChange,
  id,
}: {
  locale: Locale;
  onChange: (next: Locale) => void;
  id?: string;
}) => {
  const t = useTranslation();

  return (
    <select
      value={locale}
      id={id}
      aria-label={t("admin.language.label")}
      onChange={(event) => onChange(event.target.value as Locale)}
      className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <option value="en">{t("admin.language.english")}</option>
      <option value="fr">{t("admin.language.french")}</option>
    </select>
  );
};
