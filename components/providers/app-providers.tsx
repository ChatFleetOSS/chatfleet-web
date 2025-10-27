"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import type { PropsWithChildren } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LanguageProvider } from "@/components/providers/language-provider";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools position="bottom-right" />
      ) : null}
    </QueryClientProvider>
  );
}
