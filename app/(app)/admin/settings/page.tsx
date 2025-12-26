"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AdminSection } from "@/components/admin/admin-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  adminGetLLMConfig,
  adminSaveLLMConfig,
  adminTestLLMConfig,
} from "@/lib/apiClient";

export default function AdminSettingsPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const t = useTranslation();
  const isAdmin = user?.role === "admin";
  const qc = useQueryClient();

  const cfgQuery = useQuery({
    queryKey: ["admin-llm-config"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return adminGetLLMConfig(token);
    },
    enabled: isAdmin && Boolean(token),
  });

  const [provider, setProvider] = useState<"openai" | "vllm">("openai");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [chatModel, setChatModel] = useState("gpt-4o-mini");
  const [embedModel, setEmbedModel] = useState("text-embedding-3-small");
  const [savingError, setSavingError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [embedChanged, setEmbedChanged] = useState(false);

  useEffect(() => {
    const data = cfgQuery.data?.config;
    if (!data) return;
    setProvider((data.provider as any) ?? "openai");
    setBaseUrl(data.base_url ?? "");
    setChatModel(data.chat_model ?? "gpt-4o-mini");
    setEmbedModel(data.embed_model ?? "text-embedding-3-small");
    setEmbedChanged(false);
  }, [cfgQuery.data]);

  const testMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      const res = await adminTestLLMConfig(token, {
        provider,
        base_url: baseUrl || undefined,
        api_key: apiKey || undefined,
        chat_model: chatModel,
        embed_model: embedModel,
      });
      return res;
    },
    onSuccess: (res) => {
      setTestResult(res.ok ? t("adminSettings.test.ok") : res.message || t("adminSettings.test.fail"));
    },
    onError: (err) => {
      setTestResult((err as Error).message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      const res = await adminSaveLLMConfig(token, {
        provider,
        base_url: baseUrl || undefined,
        api_key: showKeyInput ? apiKey || undefined : undefined,
        chat_model: chatModel,
        embed_model: embedModel,
      });
      return res;
    },
    onSuccess: () => {
      setSavingError(null);
      setApiKey("");
      setShowKeyInput(false);
      qc.invalidateQueries({ queryKey: ["admin-llm-config"] });
    },
    onError: (err) => {
      setSavingError((err as Error).message);
    },
  });

  if (!isAdmin) return null;

  return (
    <div className="grid h-full grid-rows-[48px_1fr]">
      <div className="flex items-center gap-2 bg-background px-6 py-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>⟵ {t("common.backAdmin")}</Button>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.overview")}</p>
          <h1 className="text-2xl font-semibold text-foreground">{t("adminSettings.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("adminSettings.subtitle")}</p>
        </header>

        <AdminSection title={t("adminSettings.providerTitle")} description={t("adminSettings.providerDesc")} defaultOpen>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.provider")}</label>
              <StatusChip cfg={cfgQuery.data?.config} t={t} />
            </div>
            <select value={provider} onChange={(e) => setProvider(e.target.value as any)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm">
              <option value="openai">OpenAI</option>
              <option value="vllm">vLLM (OpenAI-compatible)</option>
            </select>

            {provider === "vllm" ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.baseUrl")}</label>
                <Input placeholder="http://localhost:8001/v1" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
              </div>
            ) : null}

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.apiKey")}</label>
              {showKeyInput ? (
                <Input type="password" placeholder={t("adminSettings.apiKeyPlaceholder")!} value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              ) : (
                <div className="flex items-center gap-3">
                  <Input disabled value={cfgQuery.data?.config.has_api_key ? "•••• (set)" : t("adminSettings.status.notConfigured")!} />
                  <Button variant="outline" size="sm" onClick={() => { setShowKeyInput(true); setApiKey(""); }}>{t("adminSettings.replaceKey")}</Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">{t("adminSettings.apiKeyHelp")}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("admin.runtime.chatModel")}</span>
                <Input value={chatModel} onChange={(e) => setChatModel(e.target.value)} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("admin.runtime.embeddingModel")}</span>
                <Input value={embedModel} onChange={(e) => { setEmbedModel(e.target.value); setEmbedChanged(true); }} />
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => testMutation.mutate()} disabled={testMutation.isPending}>
                {testMutation.isPending ? t("adminSettings.testing") : t("adminSettings.testButton")}
              </Button>
              <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? t("common.saving") : t("common.save")}
              </Button>
            </div>
            {savingError ? <p className="text-xs text-destructive">{savingError}</p> : null}
            {testResult ? <p className="text-xs text-muted-foreground">{testResult}</p> : null}
            {embedChanged ? (
              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <div className="mb-2 font-medium text-foreground">{t("adminSettings.rebuildNotice")}</div>
                <Button type="button" variant="outline" size="sm" onClick={() => router.push("/admin")}>{t("adminSettings.rebuildAll")}</Button>
              </div>
            ) : null}
          </div>
        </AdminSection>
      </div>
    </div>
  );
}

function StatusChip({ cfg, t }: { cfg: any; t: ReturnType<typeof useTranslation> }) {
  const hasKey = !!cfg?.has_api_key;
  const verified = !!cfg?.verified_at;
  let label = t("adminSettings.status.notConfigured");
  let cls = "bg-amber-200 text-amber-900";
  if (hasKey && verified) {
    label = t("adminSettings.status.connected");
    cls = "bg-emerald-200 text-emerald-900";
  } else if (hasKey && !verified) {
    label = t("adminSettings.status.connected");
    cls = "bg-sky-200 text-sky-900";
  }
  return (
    <span className={cn("rounded px-2 py-[2px] text-xs", cls)}>{label}</span>
  );
}
