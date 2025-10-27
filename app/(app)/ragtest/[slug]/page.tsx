"use client";

import { Assistant } from "@/app/assistant";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { listRags } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useTranslation } from "@/hooks/use-translation";

export default function RagTestPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const t = useTranslation();

  const slug = useMemo(() => {
    const raw = params.slug;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params.slug]);

  const listQuery = useQuery({
    queryKey: ["rag-list"],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return listRags(token);
    },
    enabled: Boolean(token),
    staleTime: 60_000,
  });

  const summary = listQuery.data?.items.find((rag) => rag.slug === slug);

  if (!slug) {
    return null;
  }

  if (listQuery.isLoading || !summary) {
    if (!listQuery.isLoading && !summary) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-sm text-slate-400">
            {t("ragDetail.notAvailable", { slug })}
          </p>
          <Button onClick={() => router.push("/")}>
            {t("adminAccess.backToDashboard")}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="size-10 animate-spin rounded-full border-b-2 border-white/60" />
        <p className="text-sm text-slate-400">
          {t("ragDetail.loading", { slug })}
        </p>
      </div>
    );
  }

  return (
    <Assistant ragSlug={slug} />
  );
}
