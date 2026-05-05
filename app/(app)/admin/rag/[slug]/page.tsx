"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeftIcon,
  UploadIcon,
  RefreshCwIcon,
  Undo2Icon,
  UserPlusIcon,
  Trash2Icon,
  SaveIcon,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/components/providers/language-provider";
import { AdminSection } from "@/components/admin/admin-section";
import {
  addRagUser,
  getAdminRag,
  getRagDocs,
  listAdminRags,
  listRagUsers,
  rebuildRag,
  removeRagUser,
  resetRag,
  updateAdminRag,
  uploadRagDocs,
  deleteRag,
} from "@/lib/apiClient";
import {
  DEFAULT_RAG_SYSTEM_PROMPT,
  RAG_SYSTEM_PROMPT_MAX_LENGTH,
} from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ACCEPTED_DOCUMENT_TYPES =
  ".pdf,.docx,.txt,.odt,.ods,.odp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet,application/vnd.oasis.opendocument.presentation";

export default function AdminRagDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const slug = useMemo(
    () => (Array.isArray(params.slug) ? params.slug[0] : params.slug),
    [params.slug],
  );
  const t = useTranslation();
  const { locale } = useLanguage();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace(`/rag/${slug}`);
    }
  }, [router, slug, user]);

  const ragListQuery = useQuery({
    queryKey: ["admin-rags"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return listAdminRags(token);
    },
    enabled: Boolean(token) && user?.role === "admin",
  });

  const ragSummary = ragListQuery.data?.items.find(
    (item) => item.slug === slug,
  );
  const canManage = Boolean(ragSummary);
  const isPublic = ragSummary?.visibility === "public";
  const publicUrl = useMemo(() => {
    if (!slug) return "";
    if (typeof window === "undefined") {
      return `/public/rag/${slug}`;
    }
    return `${window.location.origin}/public/rag/${slug}`;
  }, [slug]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [uploadJobId, setUploadJobId] = useState<string | null>(null);
  const [rebuildJobId, setRebuildJobId] = useState<string | null>(null);
  const [resetJobId, setResetJobId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [deleteInFlight, setDeleteInFlight] = useState(false);
  const [systemPromptDraft, setSystemPromptDraft] = useState("");
  const [systemPromptSavedMessage, setSystemPromptSavedMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    setDeleteConfirm("");
    setDeleteError(null);
    setDeleteSuccessOpen(false);
    setSystemPromptDraft("");
    setSystemPromptSavedMessage(null);
  }, [slug]);

  const docsQuery = useQuery({
    queryKey: ["rag-docs", slug, "admin"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return getRagDocs(token, slug);
    },
    enabled:
      Boolean(token) && user?.role === "admin" && canManage && !deleteInFlight,
    refetchInterval: 10_000,
  });

  const ragDetailQuery = useQuery({
    queryKey: ["admin-rag", slug],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return getAdminRag(token, slug);
    },
    enabled:
      Boolean(token) && user?.role === "admin" && canManage && !deleteInFlight,
  });

  const usersQuery = useQuery({
    queryKey: ["rag-users", slug],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return listRagUsers(token, slug);
    },
    enabled:
      Boolean(token) && user?.role === "admin" && canManage && !deleteInFlight,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token || !selectedFiles) {
        throw new Error(t("adminRag.errors.selectFiles"));
      }
      const files = Array.from(selectedFiles);
      return uploadRagDocs(token, slug, files);
    },
    onSuccess: (data) => {
      setUploadJobId(data.job_id);
      setSelectedFiles(null);
      docsQuery.refetch();
    },
  });

  const rebuildMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      return rebuildRag(token, slug);
    },
    onSuccess: (data) => setRebuildJobId(data.job_id),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      return resetRag(token, slug);
    },
    onSuccess: (data) => {
      setResetJobId(data.job_id);
      docsQuery.refetch();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      return addRagUser(token, { rag_slug: slug, email: inviteEmail });
    },
    onSuccess: () => {
      setInviteEmail("");
      usersQuery.refetch();
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      return removeRagUser(token, { rag_slug: slug, user_id: userId });
    },
    onSuccess: () => usersQuery.refetch(),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      setDeleteInFlight(true);
      await deleteRag(token, slug, deleteConfirm);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-rags"] }),
        queryClient.invalidateQueries({
          queryKey: ["rag-docs", slug, "admin"],
        }),
        queryClient.invalidateQueries({ queryKey: ["rag-users", slug] }),
      ]);
      setDeleteConfirm("");
      setDeleteError(null);
      setDeleteSuccessOpen(true);
    },
    onError: (err) => {
      setDeleteError((err as Error).message);
      setDeleteInFlight(false);
    },
    onSettled: () => {
      setDeleteInFlight(false);
    },
  });

  const promptMutation = useMutation({
    mutationFn: async () => {
      if (!canManage) {
        throw new Error(t("adminRag.errors.metadataUnavailable"));
      }
      if (!token) throw new Error("Missing token");
      return updateAdminRag(token, {
        rag_slug: slug,
        system_prompt: systemPromptDraft,
      });
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["admin-rag", slug], data);
      setSystemPromptDraft(data.rag.system_prompt);
      setSystemPromptSavedMessage(t("adminRag.prompt.saved"));
      await queryClient.invalidateQueries({ queryKey: ["admin-rags"] });
    },
    onError: () => {
      setSystemPromptSavedMessage(null);
    },
  });

  const currentSystemPrompt =
    ragDetailQuery.data?.rag.system_prompt ?? DEFAULT_RAG_SYSTEM_PROMPT;
  const promptTooLong = systemPromptDraft.length > RAG_SYSTEM_PROMPT_MAX_LENGTH;
  const promptDirty = systemPromptDraft !== currentSystemPrompt;

  useEffect(() => {
    if (ragDetailQuery.data?.rag.system_prompt !== undefined) {
      setSystemPromptDraft(ragDetailQuery.data.rag.system_prompt);
    }
  }, [ragDetailQuery.data?.rag.system_prompt, slug]);

  const metadataItems = useMemo(() => {
    if (!ragSummary)
      return [] as Array<{
        label: string;
        value: string | number;
        full?: boolean;
        monospace?: boolean;
      }>;
    return [
      { label: t("adminRag.metadata.slug"), value: ragSummary.slug },
      { label: t("adminRag.metadata.name"), value: ragSummary.name },
      {
        label: t("adminRag.visibility.label"),
        value:
          ragSummary.visibility === "public"
            ? t("adminRag.visibility.public")
            : t("adminRag.visibility.private"),
      },
      {
        label: t("adminRag.metadata.descriptionLabel"),
        value: ragSummary.description ?? "—",
        full: true,
      },
      {
        label: t("adminRag.metadata.indexedChunks"),
        value: ragSummary.chunks ?? 0,
      },
      {
        label: t("adminRag.metadata.lastUpdated"),
        value: ragSummary.last_updated
          ? new Date(ragSummary.last_updated).toLocaleString(locale)
          : "—",
      },
    ];
  }, [locale, ragSummary, t]);

  if (user?.role !== "admin") {
    return null;
  }

  const confirmationTarget = ragSummary?.slug ?? slug;
  return (
    <div className="grid h-full grid-rows-[48px_1fr]">
      <div className="flex items-center gap-2 bg-background px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => router.push("/admin")}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          <span>{t("common.backAdmin")}</span>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            {t("adminRag.manageHeading")}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            {ragSummary?.name ?? slug}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("adminRag.subtitle")}
          </p>
        </header>

        <AdminSection
          title={t("adminRag.metadata.title")}
          description={t("adminRag.sections.metadataDescription")}
          defaultOpen
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            {ragListQuery.isLoading ? (
              <p>{t("adminRag.metadata.loading")}</p>
            ) : ragSummary ? (
              <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {metadataItems.map((item) => (
                  <div
                    key={item.label}
                    className={cn(
                      "rounded-lg border border-border bg-muted/30 px-3 py-2",
                      item.full && "sm:col-span-2",
                    )}
                  >
                    <dt className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                      {item.label}
                    </dt>
                    <dd
                      className={cn(
                        "mt-1 text-sm font-medium break-words text-foreground",
                        item.full && "text-pretty",
                      )}
                    >
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-destructive">
                  {t("adminRag.metadata.description")}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin">{t("adminRag.metadata.return")}</Link>
                </Button>
              </div>
            )}
          </div>
        </AdminSection>
        <AdminSection
          title={t("adminRag.prompt.title")}
          description={t("adminRag.prompt.description")}
          defaultOpen
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.docs.unavailable")}
            </p>
          ) : ragDetailQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.prompt.loading")}
            </p>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex flex-col gap-2 text-foreground">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <label
                    className="text-xs tracking-[0.3em] text-muted-foreground uppercase"
                    htmlFor="rag-system-prompt"
                  >
                    {t("adminRag.prompt.label")}
                  </label>
                  <span
                    id="rag-system-prompt-count"
                    className={cn(
                      "text-xs text-muted-foreground",
                      promptTooLong && "text-destructive",
                    )}
                  >
                    {systemPromptDraft.length} / {RAG_SYSTEM_PROMPT_MAX_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="rag-system-prompt"
                  value={systemPromptDraft}
                  onChange={(event) => {
                    setSystemPromptDraft(event.target.value);
                    setSystemPromptSavedMessage(null);
                  }}
                  placeholder={DEFAULT_RAG_SYSTEM_PROMPT}
                  maxLength={RAG_SYSTEM_PROMPT_MAX_LENGTH}
                  aria-invalid={promptTooLong}
                  aria-describedby="rag-system-prompt-help rag-system-prompt-count rag-system-prompt-status"
                  disabled={promptMutation.isPending}
                  className="min-h-56 resize-y font-mono text-xs leading-5 text-foreground md:text-xs"
                />
                <p
                  id="rag-system-prompt-help"
                  className="text-xs text-muted-foreground"
                >
                  {t("adminRag.prompt.help")}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSystemPromptDraft(DEFAULT_RAG_SYSTEM_PROMPT);
                    setSystemPromptSavedMessage(null);
                  }}
                  disabled={
                    promptMutation.isPending ||
                    systemPromptDraft === DEFAULT_RAG_SYSTEM_PROMPT
                  }
                >
                  {t("adminRag.prompt.reset")}
                </Button>
                <Button
                  type="button"
                  onClick={() => promptMutation.mutate()}
                  disabled={
                    promptMutation.isPending || !promptDirty || promptTooLong
                  }
                  className="flex items-center gap-2"
                >
                  <SaveIcon aria-hidden="true" className="size-4" />
                  <span>
                    {promptMutation.isPending
                      ? t("common.saving")
                      : t("adminRag.prompt.save")}
                  </span>
                </Button>
              </div>
              <div id="rag-system-prompt-status" aria-live="polite">
                {promptMutation.isError ? (
                  <p className="text-xs text-destructive">
                    {(promptMutation.error as Error).message}
                  </p>
                ) : systemPromptSavedMessage ? (
                  <p className="text-xs text-muted-foreground">
                    {systemPromptSavedMessage}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </AdminSection>
        {isPublic ? (
          <AdminSection
            title="Public access"
            description="Anyone can chat without signing in. Share or open the public link below."
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
                {publicUrl || "—"}
              </code>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/public/rag/${slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open public page
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      if (publicUrl) {
                        await navigator.clipboard.writeText(publicUrl);
                      }
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Copy link
                </Button>
              </div>
            </div>
          </AdminSection>
        ) : null}
        <AdminSection
          title={t("adminRag.docs.title")}
          description={t("adminRag.sections.documentsDescription")}
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.docs.unavailable")}
            </p>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>{t("adminRag.docs.instructions")}</p>
              <Input
                type="file"
                accept={ACCEPTED_DOCUMENT_TYPES}
                multiple
                onChange={(event) => setSelectedFiles(event.target.files)}
              />
              <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!selectedFiles || uploadMutation.isPending}
                className="flex items-center gap-2"
              >
                <UploadIcon aria-hidden="true" className="size-4" />
                <span>
                  {uploadMutation.isPending
                    ? t("common.uploading")
                    : t("common.uploadAndIndex")}
                </span>
              </Button>
              {uploadMutation.isError ? (
                <p className="text-xs text-destructive">
                  {(uploadMutation.error as Error).message}
                </p>
              ) : null}
              {uploadJobId ? (
                <p className="text-xs text-muted-foreground">
                  {t("adminRag.docs.latestJob", { id: uploadJobId })}
                </p>
              ) : null}
            </div>
          )}
        </AdminSection>

        <AdminSection
          title={t("adminRag.index.title")}
          description={t("adminRag.sections.indexDescription")}
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.index.unavailable")}
            </p>
          ) : (
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Button
                variant="outline"
                onClick={() => rebuildMutation.mutate()}
                disabled={rebuildMutation.isPending}
                className="flex items-center gap-2"
              >
                <RefreshCwIcon aria-hidden="true" className="size-4" />
                <span>
                  {rebuildMutation.isPending
                    ? t("common.rebuilding")
                    : t("common.rebuildIndex")}
                </span>
              </Button>
              {rebuildJobId ? (
                <p className="text-xs text-muted-foreground">
                  {t("adminRag.index.latestRebuild", { id: rebuildJobId })}
                </p>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm(t("common.resetConfirm"))) {
                    resetMutation.mutate();
                  }
                }}
                disabled={resetMutation.isPending}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Undo2Icon aria-hidden="true" className="size-4" />
                <span>
                  {resetMutation.isPending
                    ? t("common.resetting")
                    : t("common.resetIndex")}
                </span>
              </Button>
              {resetJobId ? (
                <p className="text-xs text-muted-foreground">
                  {t("adminRag.index.latestReset", { id: resetJobId })}
                </p>
              ) : null}
            </div>
          )}
        </AdminSection>

        <AdminSection
          title={t("adminRag.users.title")}
          description={t("adminRag.sections.usersDescription")}
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.users.unavailable")}
            </p>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-col gap-2 md:flex-row">
                <Input
                  type="email"
                  placeholder={t("adminRag.users.placeholder")}
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  className="md:max-w-xs"
                />
                <Button
                  onClick={() => inviteMutation.mutate()}
                  disabled={!inviteEmail}
                  className="flex items-center gap-2"
                >
                  <UserPlusIcon aria-hidden="true" className="size-4" />
                  <span>{t("common.inviteUser")}</span>
                </Button>
              </div>
              {inviteMutation.isError ? (
                <p className="text-xs text-destructive">
                  {(inviteMutation.error as Error).message}
                </p>
              ) : null}
              <ul className="space-y-2">
                {usersQuery.data?.users.map((entry) => (
                  <li
                    key={entry._id}
                    className="flex items-center justify-between rounded border border-border px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-foreground">{entry.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.role} · {entry.name}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeMutation.mutate(entry._id)}
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2Icon aria-hidden="true" className="size-4" />
                      <span>{t("common.remove")}</span>
                    </Button>
                  </li>
                ))}
              </ul>
              {usersQuery.data && usersQuery.data.users.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  {t("adminRag.users.empty")}
                </p>
              ) : null}
              {revokeMutation.isError ? (
                <p className="text-xs text-destructive">
                  {(revokeMutation.error as Error).message}
                </p>
              ) : null}
            </div>
          )}
        </AdminSection>

        <AdminSection
          title={
            canManage
              ? t("adminRag.docs.count", {
                  count: docsQuery.data?.docs.length ?? 0,
                })
              : t("common.documents")
          }
          description={t("adminRag.sections.catalogDescription")}
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.docs.unavailable")}
            </p>
          ) : docsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">
              {t("common.loading")}
            </p>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm text-muted-foreground">
                  <thead className="bg-muted text-xs tracking-[0.3em] text-muted-foreground uppercase">
                    <tr>
                      <th className="px-4 py-2 text-left">
                        {t("adminRag.docs.filename")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("common.status")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("common.chunks")}
                      </th>
                      <th className="px-4 py-2 text-left">
                        {t("common.lastUpdated")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {docsQuery.data?.docs.map((doc) => (
                      <tr key={doc.doc_id}>
                        <td className="px-4 py-2">{doc.filename}</td>
                        <td className="px-4 py-2">{doc.status}</td>
                        <td className="px-4 py-2">{doc.chunk_count}</td>
                        <td className="px-4 py-2">
                          {doc.indexed_at
                            ? new Date(doc.indexed_at).toLocaleString(locale)
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {docsQuery.data?.docs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("adminRag.docs.empty")}
                </p>
              ) : null}
            </div>
          )}
        </AdminSection>

        <AdminSection
          title={t("adminRag.delete.title")}
          description={t("adminRag.delete.description")}
        >
          {!canManage ? (
            <p className="text-sm text-muted-foreground">
              {t("adminRag.docs.unavailable")}
            </p>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-sm text-destructive">
                {t("adminRag.delete.helper", { slug: confirmationTarget })}
              </p>
              <div className="flex flex-col gap-2 sm:max-w-sm">
                <label className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                  {t("adminRag.delete.confirmLabel")}
                </label>
                <Input
                  value={deleteConfirm}
                  onChange={(event) => {
                    setDeleteConfirm(event.target.value);
                    setDeleteError(null);
                  }}
                  placeholder={confirmationTarget}
                  className="text-foreground"
                />
              </div>
              {deleteError ? (
                <p className="text-xs text-destructive">{deleteError}</p>
              ) : null}
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate()}
                disabled={
                  deleteConfirm !== confirmationTarget ||
                  deleteMutation.isPending ||
                  deleteInFlight
                }
                className="w-full sm:w-auto"
              >
                {deleteMutation.isPending || deleteInFlight
                  ? t("adminRag.delete.buttonPending", {
                      defaultValue: "Deleting RAG in progress…",
                    })
                  : t("adminRag.delete.button")}
              </Button>
            </div>
          )}
        </AdminSection>

        <Dialog
          open={deleteSuccessOpen}
          onOpenChange={(open) => {
            setDeleteSuccessOpen(open);
            if (!open) {
              router.replace("/admin");
            }
          }}
        >
          <DialogContent className="w-full max-w-lg">
            <DialogHeader className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-semibold">
                {t("adminRag.delete.successTitle")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("adminRag.delete.successBody")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setDeleteSuccessOpen(false);
                  router.replace("/admin");
                }}
              >
                {t("adminRag.delete.successCta")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
