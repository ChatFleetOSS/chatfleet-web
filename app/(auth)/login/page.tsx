"use client";

import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { status, login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ email, password, name: email.split("@")[0] });
      }
      router.replace("/");
    } catch (err: unknown) {
      const message = err instanceof Error && err.message
        ? err.message
        : "Unable to authenticate";
      setError(message);
    }
  }

  const isLoading = status === "loading";
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-xl space-y-8 text-gray-900">
          <Image src="/logo.svg" alt="ChatFleet" width={160} height={40} className="h-10 w-auto" priority />

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold md:text-5xl">
              Operate smarter with ChatFleet
            </h1>
            <p className="text-lg text-gray-600">
              Turn your documents and tools into instant answers — wherever you work.
            </p>
            <p className="text-base text-blue-600">
              → Operate smarter. Respond faster. Keep your data yours.
            </p>
          </div>

          <div className="space-y-2 text-base text-gray-700">
            <ul className="list-disc space-y-2 pl-5">
              <li>🚀 Launch in minutes. Upload docs, connect your LLM, deploy to Slack/web.</li>
              <li>💬 Everywhere you are. Slack, WhatsApp, Telegram, Notion, web.</li>
              <li>📂 Unified admin console. One dashboard for every knowledge base.</li>
              <li>🔒 Enterprise-ready controls. Roles, invites, audit logs.</li>
              <li>
                ♾️ Unlimited chats, docs, assistants. Scale freely with open-source and self-hosted.
              </li>
            </ul>
          </div>

          <p className="pt-6 text-sm text-gray-500">
            © {year} ChatFleet — Open-source AI for business.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-[#f9fafb] px-8 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-600">Sign in to manage your RAG assistants.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-800">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="mt-2 h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="mt-2 h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </label>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-md bg-[#1E6FF8] text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 disabled:opacity-60"
            >
              {isLoading ? "Authenticating…" : mode === "login" ? "Sign in" : "Register & sign in"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Verified workspace • TLS secured</span>
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-medium text-blue-600 hover:underline"
            >
              {mode === "login" ? "Need an account?" : "Back to sign in"}
            </button>
          </div>

          <div className="mt-8 text-center text-[11px] leading-5 text-gray-500">
            <p>Powered by ChatFleet Frontend Integration Agent (Codex Edition).</p>
            <p>
              <Link href="https://chatfleet.io" className="underline">chatfleet.io</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
