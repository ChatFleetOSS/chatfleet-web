"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AdminSection } from "@/components/admin/admin-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PendingButton } from "@/components/ui/pending-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronDownIcon, InfoIcon, RotateCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  adminGetLLMConfig,
  adminSaveLLMConfig,
  adminTestLLMConfig,
  adminDiscoverLLMModels,
  adminTestEmbeddingConfig,
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

  type LLMProvider = "openai" | "vllm";
  type EmbedProvider = "openai" | "local";
  type RetrievalMode = "hybrid" | "semantic";
  type ProviderDraft = {
    baseUrl: string;
    apiKey: string;
    chatModel: string;
    embedModel: string;
  };

  const emptyDraft: ProviderDraft = {
    baseUrl: "",
    apiKey: "",
    chatModel: "",
    embedModel: "",
  };

  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [embedProvider, setEmbedProvider] = useState<EmbedProvider>("openai");
  const [providerDrafts, setProviderDrafts] = useState<Record<LLMProvider, ProviderDraft>>({
    openai: {
      baseUrl: "",
      apiKey: "",
      chatModel: "gpt-4o-mini",
      embedModel: "text-embedding-3-small",
    },
    vllm: { ...emptyDraft },
  });
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [chatModel, setChatModel] = useState("gpt-4o-mini");
  const [embedModel, setEmbedModel] = useState("text-embedding-3-small");
  const [temperature, setTemperature] = useState<number>(0.2);
  const [topK, setTopK] = useState("12");
  const [indexDir, setIndexDir] = useState("");
  const [uploadDir, setUploadDir] = useState("");
  const [maxUploadMb, setMaxUploadMb] = useState<number>(50);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [embedChanged, setEmbedChanged] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [chatOptions, setChatOptions] = useState<string[]>([]);
  const [embedOptions, setEmbedOptions] = useState<string[]>([]);
  const [embedTestResult, setEmbedTestResult] = useState<string | null>(null);
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>("hybrid");
  const [semanticMinScore, setSemanticMinScore] = useState("0.2");
  const [candidateMultiplier, setCandidateMultiplier] = useState("4");
  const [candidateMin, setCandidateMin] = useState("24");
  const [rrfK, setRrfK] = useState("60");
  const [semanticWeight, setSemanticWeight] = useState("1");
  const [lexicalWeight, setLexicalWeight] = useState("1");
  const [bm25K1, setBm25K1] = useState("1.5");
  const [bm25B, setBm25B] = useState("0.75");
  const [lexicalPrewarm, setLexicalPrewarm] = useState(false);
  const [advancedRetrievalOpen, setAdvancedRetrievalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const data = cfgQuery.data?.config;
    if (!data) return;
    const nextProvider = (data.provider as LLMProvider) ?? "openai";
    const hasVllmConfig = nextProvider === "vllm" && Boolean(data.base_url);
    const nextEmbedProvider = (data.embed_provider as EmbedProvider) ?? (nextProvider === "vllm" ? "local" : "openai");
    const defaultEmbedModel = nextEmbedProvider === "local"
      ? "sentence-transformers/all-MiniLM-L6-v2"
      : "text-embedding-3-small";
    const nextDraft: ProviderDraft = {
      baseUrl: data.base_url ?? "",
      apiKey: "",
      chatModel: nextProvider === "openai"
        ? data.chat_model ?? "gpt-4o-mini"
        : hasVllmConfig ? (data.chat_model ?? "") : "",
      embedModel: data.embed_model ?? defaultEmbedModel,
    };
    setProvider(nextProvider);
    setEmbedProvider(nextEmbedProvider);
    setProviderDrafts((prev) => ({
      ...prev,
      [nextProvider]: nextDraft,
    }));
    setBaseUrl(nextDraft.baseUrl);
    setChatModel(nextDraft.chatModel);
    setEmbedModel(nextDraft.embedModel);
    setEmbedChanged(false);
    if (data.temperature_default !== undefined) setTemperature(data.temperature_default);
    const retrieval = data.retrieval;
    if (retrieval?.top_k_default !== undefined) {
      setTopK(String(retrieval.top_k_default));
    } else if (data.top_k_default !== undefined) {
      setTopK(String(data.top_k_default));
    }
    if (retrieval) {
      setRetrievalMode((retrieval.mode as RetrievalMode) ?? "hybrid");
      setSemanticMinScore(String(retrieval.semantic_min_score ?? 0.2));
      setCandidateMultiplier(String(retrieval.candidate_multiplier ?? 4));
      setCandidateMin(String(retrieval.candidate_min ?? 24));
      setRrfK(String(retrieval.rrf_k ?? 60));
      setSemanticWeight(String(retrieval.semantic_weight ?? 1));
      setLexicalWeight(String(retrieval.lexical_weight ?? 1));
      setBm25K1(String(retrieval.bm25_k1 ?? 1.5));
      setBm25B(String(retrieval.bm25_b ?? 0.75));
      setLexicalPrewarm(Boolean(retrieval.lexical_prewarm));
    }
    if (data.index_dir) setIndexDir(data.index_dir);
    if (data.upload_dir) setUploadDir(data.upload_dir);
    if (data.max_upload_mb !== undefined) setMaxUploadMb(data.max_upload_mb);
  }, [cfgQuery.data]);

  const handleProviderChange = (next: LLMProvider) => {
    if (next === provider) return;
    const nextDraft = providerDrafts[next] ?? emptyDraft;
    setProviderDrafts((prev) => ({
      ...prev,
      [provider]: { baseUrl, apiKey, chatModel, embedModel },
    }));
    const nextChatModel = nextDraft.chatModel;
    const nextEmbedModel = nextDraft.embedModel;
    setProvider(next);
    if (next === "vllm") {
      setEmbedProvider("local");
    }
    setBaseUrl(nextDraft.baseUrl);
    setApiKey(nextDraft.apiKey);
    setChatModel(nextChatModel);
    setEmbedModel(nextEmbedModel);
    setShowKeyInput(false);
    setChatOptions([]);
    setEmbedOptions([]);
    setTestResult(null);
    setEmbedTestResult(null);
    setDiscoverError(null);
    setEmbedChanged(false);
  };

  const handleEmbedProviderChange = (next: EmbedProvider) => {
    if (next === embedProvider) return;
    setEmbedProvider(next);
    setEmbedOptions([]);
    setEmbedTestResult(null);
    setEmbedChanged(true);
    if (next === "local") {
      if (!embedModel || embedModel === "text-embedding-3-small") {
        setEmbedModel("sentence-transformers/all-MiniLM-L6-v2");
      }
    } else if (!embedModel || embedModel.startsWith("sentence-transformers/")) {
      setEmbedModel("text-embedding-3-small");
    }
  };

  const hasStoredKey = Boolean(cfgQuery.data?.config.has_api_key);
  const missingApiKey = (provider === "openai" || embedProvider === "openai") && !(hasStoredKey || apiKey);
  const missingBaseUrl = provider === "vllm" && !baseUrl;
  const missingModels = !chatModel || !embedModel;
  const retrievalError = getRetrievalValidationError({
    topK,
    semanticMinScore,
    candidateMultiplier,
    candidateMin,
    rrfK,
    semanticWeight,
    lexicalWeight,
    bm25K1,
    bm25B,
  });
  const canSave = !(missingApiKey || missingBaseUrl || missingModels || retrievalError);

  const resetRetrievalDefaults = () => {
    setRetrievalMode("hybrid");
    setTopK("12");
    setSemanticMinScore("0.2");
    setCandidateMultiplier("4");
    setCandidateMin("24");
    setRrfK("60");
    setSemanticWeight("1");
    setLexicalWeight("1");
    setBm25K1("1.5");
    setBm25B("0.75");
    setLexicalPrewarm(false);
    setSaveSuccess(false);
  };

  const testMutation = useMutation({
    retry: false,
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 15000);
      try {
        const res = await adminTestLLMConfig(token, {
          provider,
          base_url: baseUrl || undefined,
          api_key: apiKey || undefined,
          chat_model: chatModel,
          embed_model: embedModel,
          embed_provider: embedProvider,
        }, { signal: ac.signal });
        return res;
      } finally {
        clearTimeout(timer);
      }
    },
    onSuccess: (res) => {
      setSaveSuccess(false);
      setTestResult(res.ok ? t("adminSettings.test.ok") : res.message || t("adminSettings.test.fail"));
    },
    onError: (err) => {
      const msg = (err as Error).name === 'AbortError' ? 'TIMEOUT: provider did not respond' : (err as Error).message;
      setTestResult(msg);
    },
  });

  const saveMutation = useMutation({
    retry: false,
    mutationFn: async () => {
      if (!token) throw new Error("Missing token");
      const retrieval = buildRetrievalPayload({
        mode: retrievalMode,
        topK,
        semanticMinScore,
        candidateMultiplier,
        candidateMin,
        rrfK,
        semanticWeight,
        lexicalWeight,
        bm25K1,
        bm25B,
        lexicalPrewarm,
      });
      const res = await adminSaveLLMConfig(token, {
        provider,
        base_url: baseUrl || undefined,
        api_key: showKeyInput ? apiKey || undefined : undefined,
        chat_model: chatModel,
        embed_model: embedModel,
        embed_provider: embedProvider,
        temperature_default: temperature,
        top_k_default: retrieval.top_k_default,
        retrieval,
        index_dir: indexDir || undefined,
        upload_dir: uploadDir || undefined,
        max_upload_mb: maxUploadMb,
      });
      return res;
    },
    onSuccess: () => {
      setSavingError(null);
      setSaveSuccess(true);
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
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}><ArrowLeftIcon /> {t("common.backAdmin")}</Button>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.overview")}</p>
          <h1 className="text-2xl font-semibold text-foreground">{t("adminSettings.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("adminSettings.subtitle")}</p>
        </header>

        <AdminSection title={t("adminSettings.providerTitle")} description={t("adminSettings.providerDesc")} defaultOpen>
          <div className="grid gap-4">
            {cfgQuery.isLoading ? (
              <>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-9 w-full" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-9 w-36" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.provider")}</label>
                  <StatusChip cfg={cfgQuery.data?.config} t={t} />
                </div>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value as LLMProvider)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                >
                  <option value="openai">OpenAI</option>
                  <option value="vllm">vLLM (OpenAI-compatible)</option>
                </select>

                {provider === "vllm" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.baseUrl")}</label>
                    <Input placeholder="http://localhost:8001/v1" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
                    <p className="text-xs text-muted-foreground">{t("adminSettings.baseUrlHelp")}</p>
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
                  <p className="text-xs text-muted-foreground">
                    {provider === "openai" ? t("adminSettings.apiKeyHelpOpenai") : t("adminSettings.apiKeyHelpVllm")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Models</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={discovering} onClick={async () => {
                      if (!token) return;
                      setDiscoverError(null);
                      setDiscovering(true);
                      const ac = new AbortController();
                      const timer = setTimeout(() => ac.abort(), 15000);
                      try {
                        const res = await adminDiscoverLLMModels(token, {
                          provider,
                          base_url: baseUrl || undefined,
                          api_key: apiKey || undefined,
                        }, { signal: ac.signal });
                        if (!res.raw_models?.length) {
                          setChatOptions([]);
                          setEmbedOptions([]);
                          setDiscoverError(t("adminSettings.modelsEmpty"));
                        } else {
                          setChatOptions(res.chat_models || []);
                          setEmbedOptions(res.embed_models || []);
                        }
                        if (res.chat_models?.length) {
                          const next = res.chat_models[0];
                          setChatModel((prev) => prev || next);
                        }
                        if (embedProvider === "openai" && res.embed_models?.length) {
                          setEmbedModel((prev) => prev || res.embed_models[0]);
                        }
                      } catch (e: unknown) {
                        const message =
                          e && typeof e === "object" && "name" in e && (e as { name?: string }).name === "AbortError"
                            ? "Discovery timed out"
                            : (e as { message?: string }).message || "Discovery failed";
                        setDiscoverError(message);
                      } finally {
                        clearTimeout(timer);
                        setDiscovering(false);
                      }
                    }}>{discovering ? t("common.loading") : t("adminSettings.refreshModels")}</Button>
                  </div>
                </div>
                {provider === "vllm" ? (
                  <p className="text-xs text-muted-foreground">{t("adminSettings.modelsHintVllm")}</p>
                ) : null}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("admin.runtime.chatModel")}</span>
                    {chatOptions.length > 0 ? (
                      <select
                        value={chatModel}
                        onChange={(e) => {
                          const next = e.target.value;
                          setChatModel(next);
                        }}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                      >
                        {chatOptions.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="model-id"
                        value={chatModel}
                        onChange={(e) => {
                          const next = e.target.value;
                          setChatModel(next);
                        }}
                      />
                    )}
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("admin.runtime.embeddingModel")}</span>
                    {embedProvider === "local" ? (
                      <>
                        <Input value={embedModel} onChange={(e) => { setEmbedModel(e.target.value); setEmbedChanged(true); }} />
                        <p className="text-xs text-muted-foreground">{t("adminSettings.localEmbedHelp")}</p>
                      </>
                    ) : embedOptions.length > 0 ? (
                      <select value={embedModel} onChange={(e) => { setEmbedModel(e.target.value); setEmbedChanged(true); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm">
                        {embedOptions.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    ) : (
                      <Input placeholder="embedding-model-id" value={embedModel} onChange={(e) => { setEmbedModel(e.target.value); setEmbedChanged(true); }} />
                    )}
                  </label>
                </div>
                {discoverError ? <p className="text-xs text-destructive">{discoverError}</p> : null}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("adminSettings.embedProvider")}</span>
                    <select
                      value={embedProvider}
                      onChange={(e) => handleEmbedProviderChange(e.target.value as EmbedProvider)}
                      disabled={provider === "vllm"}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm"
                    >
                      <option value="openai">{t("adminSettings.embedProviderOpenai")}</option>
                      <option value="local">{t("adminSettings.embedProviderLocal")}</option>
                    </select>
                    <p className="text-xs text-muted-foreground">{t("adminSettings.embedProviderHelp")}</p>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Température par défaut</span>
                    <Input type="number" min={0} max={1} step={0.05} value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Répertoire d’index</span>
                    <Input value={indexDir} onChange={(e) => setIndexDir(e.target.value)} />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Répertoire de téléversement</span>
                    <Input value={uploadDir} onChange={(e) => setUploadDir(e.target.value)} />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Taille maximale de téléversement (MB)</span>
                    <Input type="number" min={1} step={1} value={maxUploadMb} onChange={(e) => setMaxUploadMb(parseInt(e.target.value || "50", 10))} />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <PendingButton type="button" variant="outline" onClick={() => testMutation.mutate()} isPending={testMutation.isPending} pendingLabel={t("adminSettings.testing")} disabled={!canSave}>
                    {t("adminSettings.testButton")}
                  </PendingButton>
                  <PendingButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!canSave) return;
                      if (!token) return;
                      setEmbedTestResult(null);
                      const ac = new AbortController();
                      const timer = setTimeout(() => ac.abort(), 15000);
                      (async () => {
                        try {
                          const res = await adminTestEmbeddingConfig(token, {
                            provider,
                            base_url: baseUrl || undefined,
                            api_key: apiKey || undefined,
                            embed_model: embedModel,
                            embed_provider: embedProvider,
                          }, { signal: ac.signal });
                          setEmbedTestResult(res.ok ? `${t("adminSettings.test.ok")} (${t("adminSettings.embeddingDim")}: ${res.dim ?? "?"})` : res.message || t("adminSettings.test.fail"));
                        } catch (e: unknown) {
                          const message =
                            e && typeof e === "object" && "name" in e && (e as { name?: string }).name === "AbortError"
                              ? "TIMEOUT: provider did not respond"
                              : (e as { message?: string }).message || "Test failed";
                          setEmbedTestResult(message);
                        } finally {
                          clearTimeout(timer);
                        }
                      })();
                    }}
                    isPending={false}
                    disabled={!canSave}
                    pendingLabel={t("adminSettings.testingEmbeddings")}
                  >
                    {t("adminSettings.testEmbeddings")}
                  </PendingButton>
                  <PendingButton type="button" onClick={() => saveMutation.mutate()} isPending={saveMutation.isPending} pendingLabel={t("common.saving")} disabled={!canSave}>
                    {t("common.save")}
                  </PendingButton>
                </div>
                {!canSave ? <p className="text-xs text-muted-foreground">{t("adminSettings.requiredFields")}</p> : null}
                {savingError ? <p className="text-xs text-destructive">{savingError}</p> : null}
                {testResult ? <p className="text-xs text-muted-foreground">{testResult}</p> : null}
                {embedTestResult ? <p className="text-xs text-muted-foreground">{embedTestResult}</p> : null}
                {embedChanged ? (
                  <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                    <div className="mb-2 font-medium text-foreground">{t("adminSettings.rebuildNotice")}</div>
                    <Button type="button" variant="outline" size="sm" onClick={() => router.push("/admin")}>{t("adminSettings.rebuildAll")}</Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </AdminSection>

        <AdminSection
          title="Recherche & retrieval"
          description="Paramètres globaux utilisés par le chat pour choisir les extraits RAG."
          defaultOpen
          actions={
            <Badge className="border-border bg-muted text-muted-foreground" variant="outline">
              {retrievalMode === "hybrid" ? "Hybride" : "Sémantique"}
            </Badge>
          }
        >
          <div className="grid gap-5">
            {cfgQuery.isLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-9 w-56" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ModeButton
                    active={retrievalMode === "hybrid"}
                    title="Hybride"
                    description="FAISS + BM25 + RRF pour combiner sens et références exactes."
                    onClick={() => setRetrievalMode("hybrid")}
                  />
                  <ModeButton
                    active={retrievalMode === "semantic"}
                    title="Sémantique uniquement"
                    description="Rollback rapide: FAISS seul, sans BM25 ni fusion RRF."
                    onClick={() => setRetrievalMode("semantic")}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberSetting
                    label="Top-K par défaut"
                    value={topK}
                    onChange={setTopK}
                    min={1}
                    max={200}
                    step={1}
                    help="Nombre final d'extraits envoyés au modèle quand la question ne précise pas de limite."
                  />
                  <NumberSetting
                    label="Score sémantique min."
                    value={semanticMinScore}
                    onChange={setSemanticMinScore}
                    min={0}
                    max={1}
                    step={0.05}
                    help="Filtre les résultats FAISS trop faibles avant fusion ou réponse."
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={resetRetrievalDefaults}>
                    <RotateCcwIcon />
                    Restaurer les valeurs recommandées
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAdvancedRetrievalOpen((prev) => !prev)}
                    aria-expanded={advancedRetrievalOpen}
                  >
                    <ChevronDownIcon className={cn("transition-transform", advancedRetrievalOpen && "rotate-180")} />
                    Paramètres avancés
                  </Button>
                </div>

                {advancedRetrievalOpen ? (
                  <div className="grid gap-4 rounded-md border border-border bg-muted/20 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <NumberSetting
                        label="Multiplicateur candidats"
                        value={candidateMultiplier}
                        onChange={setCandidateMultiplier}
                        min={1}
                        max={10}
                        step={1}
                        help="Élargit le vivier avant fusion. Plus haut = plus de candidats à comparer."
                      />
                      <NumberSetting
                        label="Minimum candidats"
                        value={candidateMin}
                        onChange={setCandidateMin}
                        min={1}
                        max={200}
                        step={1}
                        help="Garde un volume minimal de candidats même quand Top-K est bas."
                      />
                      <NumberSetting
                        label="RRF k"
                        value={rrfK}
                        onChange={setRrfK}
                        min={1}
                        max={200}
                        step={1}
                        help="Contrôle la force de fusion des rangs, plus haut = fusion plus douce."
                      />
                      <NumberSetting
                        label="Poids sémantique"
                        value={semanticWeight}
                        onChange={setSemanticWeight}
                        min={0}
                        max={5}
                        step={0.1}
                        help="Favorise les paraphrases et similarités de sens."
                      />
                      <NumberSetting
                        label="Poids lexical"
                        value={lexicalWeight}
                        onChange={setLexicalWeight}
                        min={0}
                        max={5}
                        step={0.1}
                        help="Favorise les références exactes, codes, dates, noms propres."
                      />
                      <NumberSetting
                        label="BM25 k1"
                        value={bm25K1}
                        onChange={setBm25K1}
                        min={0.1}
                        max={3}
                        step={0.1}
                        help="Ajuste l'intensité lexicale."
                      />
                      <NumberSetting
                        label="BM25 b"
                        value={bm25B}
                        onChange={setBm25B}
                        min={0}
                        max={1}
                        step={0.05}
                        help="Ajuste la normalisation par longueur de chunk."
                      />
                      <label className="flex min-h-20 flex-col justify-between gap-3 rounded-md border border-border bg-background p-3">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Préchauffage lexical</span>
                          <input
                            type="checkbox"
                            checked={lexicalPrewarm}
                            onChange={(e) => setLexicalPrewarm(e.target.checked)}
                            className="size-4 accent-primary"
                          />
                        </span>
                        <span className="text-xs leading-5 text-muted-foreground">
                          Construit le cache BM25 après rebuild pour réduire la première latence.
                        </span>
                      </label>
                    </div>
                  </div>
                ) : null}

                {retrievalError ? (
                  <p className="text-xs text-destructive">{retrievalError}</p>
                ) : null}
                {saveSuccess ? (
                  <p className="text-xs text-emerald-700">Paramètres sauvegardés.</p>
                ) : null}
              </>
            )}
          </div>
        </AdminSection>
      </div>
    </div>
  );
}

type RetrievalInputState = {
  topK: string;
  semanticMinScore: string;
  candidateMultiplier: string;
  candidateMin: string;
  rrfK: string;
  semanticWeight: string;
  lexicalWeight: string;
  bm25K1: string;
  bm25B: string;
};

function parseNumber(value: string): number {
  return Number(value.replace(",", "."));
}

function validateNumber(
  label: string,
  value: string,
  min: number,
  max: number,
  integer = false,
): string | null {
  const parsed = parseNumber(value);
  if (!Number.isFinite(parsed)) return `${label}: valeur numérique requise.`;
  if (integer && !Number.isInteger(parsed)) return `${label}: entier requis.`;
  if (parsed < min || parsed > max) return `${label}: valeur attendue entre ${min} et ${max}.`;
  return null;
}

function getRetrievalValidationError(state: RetrievalInputState): string | null {
  const checks: Array<[string, string, number, number, boolean]> = [
    ["Top-K", state.topK, 1, 200, true],
    ["Score sémantique min.", state.semanticMinScore, 0, 1, false],
    ["Multiplicateur candidats", state.candidateMultiplier, 1, 10, true],
    ["Minimum candidats", state.candidateMin, 1, 200, true],
    ["RRF k", state.rrfK, 1, 200, true],
    ["Poids sémantique", state.semanticWeight, 0, 5, false],
    ["Poids lexical", state.lexicalWeight, 0, 5, false],
    ["BM25 k1", state.bm25K1, 0.1, 3, false],
    ["BM25 b", state.bm25B, 0, 1, false],
  ];
  for (const [label, value, min, max, integer] of checks) {
    const error = validateNumber(label, value, min, max, integer);
    if (error) return error;
  }
  if (parseNumber(state.semanticWeight) <= 0 && parseNumber(state.lexicalWeight) <= 0) {
    return "Au moins un poids retrieval doit être supérieur à 0.";
  }
  return null;
}

function buildRetrievalPayload(
  state: RetrievalInputState & { mode: "hybrid" | "semantic"; lexicalPrewarm: boolean },
) {
  return {
    mode: state.mode,
    top_k_default: parseNumber(state.topK),
    semantic_min_score: parseNumber(state.semanticMinScore),
    candidate_multiplier: parseNumber(state.candidateMultiplier),
    candidate_min: parseNumber(state.candidateMin),
    rrf_k: parseNumber(state.rrfK),
    semantic_weight: parseNumber(state.semanticWeight),
    lexical_weight: parseNumber(state.lexicalWeight),
    bm25_k1: parseNumber(state.bm25K1),
    bm25_b: parseNumber(state.bm25B),
    lexical_prewarm: state.lexicalPrewarm,
  };
}

function ModeButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-primary/5" : "border-border bg-background hover:bg-muted/30",
      )}
    >
      <span className="block text-sm font-medium text-foreground">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
    </button>
  );
}

function NumberSetting({
  label,
  value,
  onChange,
  min,
  max,
  step,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
  help: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" className="rounded-full text-muted-foreground hover:text-foreground">
              <InfoIcon className="size-3.5" />
              <span className="sr-only">{help}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-64">
            {help}
          </TooltipContent>
        </Tooltip>
      </span>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(validateNumber(label, value, min, max, step >= 1))}
      />
      <span className="text-xs leading-5 text-muted-foreground">{help}</span>
    </label>
  );
}

type StatusCfg = {
  has_api_key?: boolean;
  verified_at?: string | null;
};

function StatusChip({ cfg, t }: { cfg?: StatusCfg | null; t: ReturnType<typeof useTranslation> }) {
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
