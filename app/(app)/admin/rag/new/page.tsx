"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { AdminSection } from "@/components/admin/admin-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createRag, uploadRagDocs } from "@/lib/apiClient";
import { ApiError } from "@/lib/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/--+/g, "-");
}

export default function AdminRagCreatePage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";
  const t = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<"idle" | "queued" | "running" | "done" | "error">("idle");
  const [jobProgress, setJobProgress] = useState<number | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobTotals, setJobTotals] = useState<{
    docs_total: number;
    docs_done: number;
    chunks_total: number;
    chunks_done: number;
  } | null>(null);
  const [jobPhase, setJobPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState<string | null>(null);

  const slug = useMemo(() => slugify(name), [name]);

  const createMutation = useMutation({
    mutationFn: async (payload: {
      slug: string;
      name: string;
      description: string;
      files: File[];
    }) => {
      if (!token) throw new Error("Missing token");
      setJobStatus("queued");
      setJobError(null);
      setJobProgress(null);
      setJobTotals(null);
      setJobPhase(null);
      const createResponse = await createRag(token, {
        slug: payload.slug,
        name: payload.name,
        description: payload.description,
      });

      if (payload.files.length > 0) {
        const uploadResponse = await uploadRagDocs(
          token,
          payload.slug,
          payload.files,
        );
        setJobId(uploadResponse.job_id);
        setJobStatus("queued");
      } else {
        setJobStatus("done");
      }

      return createResponse.rag;
    },
    onSuccess: (rag) => {
      setError(null);
      setDialogOpen(true);
      setSelectedFiles(null);
      setCreatedSlug(rag.slug);
      setCreatedName(rag.name);
      queryClient.invalidateQueries({ queryKey: ["admin-rags"] });
    },
    onError: (err) => {
      setJobStatus("error");
      const msg = err instanceof ApiError ? err.message : (err as Error).message;
      setJobError(msg);
      setError(msg);
    },
  });

  if (!isAdmin) {
    return null;
  }

  const pendingRagName = createdName ?? name.trim();
  const pendingRagSlug = createdSlug ?? slug;
  const showProcessing = dialogOpen && jobStatus !== "error" && jobStatus !== "done";
  const showSuccess = dialogOpen && jobStatus === "done";
  const showError = dialogOpen && jobStatus === "error";

  useEffect(() => {
    if (!jobId || jobStatus === "done" || jobStatus === "error") {
      return;
    }
    const id = setInterval(async () => {
      try {
        if (!token || !jobId) return;
        const res = await fetch(`/backend-api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const status = json.status as typeof jobStatus;
        const progress = typeof json.progress === "number" ? json.progress : null;
        const totals =
          json.totals && typeof json.totals === "object"
            ? {
                docs_total: Number(json.totals.docs_total ?? 0),
                docs_done: Number(json.totals.docs_done ?? 0),
                chunks_total: Number(json.totals.chunks_total ?? 0),
                chunks_done: Number(json.totals.chunks_done ?? 0),
              }
            : null;
        const phase = typeof json.phase === "string" ? json.phase : null;
        setJobStatus(status);
        setJobProgress(progress);
        setJobTotals(totals);
        setJobPhase(phase);
        if (status === "done" || status === "error") {
          setJobError(json.error || null);
        }
      } catch {
        // Ignore transient polling errors
      }
    }, 2500);
    return () => clearInterval(id);
  }, [jobId, jobStatus, token]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError(t("adminCreate.errors.missingName"));
      return;
    }
    if (!trimmedDescription) {
      setError(t("adminCreate.errors.missingDescription"));
      return;
    }
    if (!slug) {
      setError(t("adminCreate.errors.missingSlug"));
      return;
    }

    const files = selectedFiles ? Array.from(selectedFiles) : [];
    setError(null);
    setCreatedSlug(null);
    setCreatedName(null);
    setJobId(null);
    setJobStatus("idle");
    setJobProgress(null);
    setJobError(null);
    setJobTotals(null);
    setJobPhase(null);
    createMutation.mutate({
      slug,
      name: trimmedName,
      description: trimmedDescription,
      files,
    });
  }

  return (
    <>
      <div className="grid h-full grid-rows-[48px_1fr]">
        <div className="flex items-center gap-2 bg-background px-6 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.replace("/admin")}
            disabled={createMutation.isPending || dialogOpen}
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            <span>{t("common.backAdmin")}</span>
          </Button>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {t("adminCreate.overview")}
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              {t("adminCreate.heading")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("adminCreate.subtitle")}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
            <AdminSection
              title={t("adminCreate.sections.detailsTitle")}
              description={t("adminCreate.sections.detailsDescription")}
              defaultOpen
            >
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex flex-col gap-1 text-foreground">
                  <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {t("adminCreate.nameLabel")}
                  </label>
                  <Input
                    placeholder={t("adminCreate.namePlaceholder")}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={createMutation.isPending || dialogOpen}
                  />
                </div>
                <div className="flex flex-col gap-1 text-foreground">
                  <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {t("adminCreate.descriptionLabel")}
                  </label>
                  <textarea
                    placeholder={t("adminCreate.descriptionPlaceholder")}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={createMutation.isPending || dialogOpen}
                    className="min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("adminCreate.generatedSlug")}:{" "}
                  <code className="rounded bg-muted px-1 py-[1px] text-[11px]">
                    {slug || "—"}
                  </code>
                </p>
              </div>
            </AdminSection>

            <AdminSection
              title={t("adminCreate.sections.documentsTitle")}
              description={t("adminCreate.sections.documentsDescription")}
            >
              <div className="space-y-3 text-sm text-muted-foreground">
                <Input
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  multiple
                  onChange={(event) => setSelectedFiles(event.target.files)}
                  disabled={createMutation.isPending || dialogOpen}
                />
                <p className="text-xs text-muted-foreground">
                  {t("adminCreate.documentsHelp")}
                </p>
                {jobId ? (
                  <p className="text-xs text-muted-foreground">
                    {t("adminCreate.latestJob", { id: jobId })}
                  </p>
                ) : null}
              </div>
            </AdminSection>

            {error ? <p className="text-xs text-destructive">{error}</p> : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.replace("/admin")}
                disabled={createMutation.isPending || dialogOpen}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon aria-hidden="true" className="size-4" />
                <span>{t("common.cancel")}</span>
              </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || dialogOpen}
              className="flex items-center gap-2"
            >
              <PlusIcon aria-hidden="true" className="size-4" />
              <span>
                {createMutation.isPending
                  ? t("adminCreate.creating")
                  : t("common.createRag")}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setJobId(null);
            setJobStatus("idle");
            setJobProgress(null);
            setJobError(null);
            setJobTotals(null);
            setJobPhase(null);
            if (createdSlug) {
              router.replace(`/admin/rag/${createdSlug}`);
            } else {
              router.replace("/admin");
            }
          }
        }}
      >
        <DialogContent className="w-full max-w-lg">
          <DialogHeader className="space-y-4 text-center">
            <DialogTitle className="text-3xl font-semibold">
              {showSuccess
                ? t("adminCreate.successTitle")
                : showError
                ? t("adminCreate.errorTitle")
                : t("adminCreate.processingTitle")}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {showSuccess
                ? t("adminCreate.successBody", {
                    name: pendingRagName || pendingRagSlug,
                    slug: pendingRagSlug,
                  })
                : showError
                ? jobError || t("adminCreate.errorBody")
                : t("adminCreate.processingBody", {
                    name: pendingRagName || pendingRagSlug,
                    slug: pendingRagSlug,
                  })}
            </DialogDescription>
            {showProcessing ? (
              <p className="text-sm text-muted-foreground">
                {jobProgress !== null
                  ? t("adminCreate.processingProgress", {
                      progress: Math.round(jobProgress * 100),
                    })
                  : t("adminCreate.processingSubtitle")}
              </p>
            ) : null}
            {showProcessing && jobTotals ? (
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  {t("adminCreate.processingDocs", {
                    done: jobTotals.docs_done,
                    total: jobTotals.docs_total,
                  })}
                </p>
                {jobTotals.chunks_total > 0 ? (
                  <p>
                    {t("adminCreate.processingChunks", {
                      done: jobTotals.chunks_done,
                      total: jobTotals.chunks_total,
                    })}
                  </p>
                ) : null}
                {jobPhase ? (
                  <p>
                    {t("adminCreate.processingPhase", {
                      phase: jobPhase,
                    })}
                  </p>
                ) : null}
              </div>
            ) : null}
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3">
            {showProcessing ? (
              <Button type="button" className="w-full" disabled>
                {t("adminCreate.processingCta")}
              </Button>
            ) : showError ? (
              <Button
                type="button"
                className="w-full"
                onClick={() => setDialogOpen(false)}
              >
                {t("adminCreate.errorCta")}
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setDialogOpen(false);
                  if (createdSlug) {
                    router.replace(`/admin/rag/${createdSlug}`);
                  } else {
                    router.replace("/admin");
                  }
                }}
              >
                {t("adminCreate.successCta")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
