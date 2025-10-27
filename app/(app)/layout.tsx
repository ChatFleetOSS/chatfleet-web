"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Logo } from "@/components/branding/logo";
import LoadingScreen from "@/components/layout/loading-screen";

export default function ApplicationLayout({ children }: PropsWithChildren) {
  const { status, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation();
  const heartbeat = process.env.NEXT_PUBLIC_SSE_HEARTBEAT_MS ?? "15000";
  const year = new Date().getFullYear();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "idle" || status === "loading") {
    return (
      <LoadingScreen message={t("layout.loadingWorkspace")} />
    );
  }

  return (
    <div className="grid min-h-dvh grid-rows-[72px_1fr_auto] bg-background text-foreground">
      <header className="z-30 flex items-center justify-between border-b border-border bg-background px-6">
        <Logo />
        <UserMenu
          name={user?.name ?? "User"}
          role={user?.role ?? "user"}
          avatarUrl={user?.avatarUrl}
          isAdmin={user?.role === "admin"}
          onAdmin={() => router.push("/admin")}
          onProfile={() => router.push("/settings/profile")}
          onSignOut={() => {
            logout();
            router.replace("/login");
          }}
        />
      </header>
      <main className="flex min-h-0 flex-col overflow-hidden">
        {children}
      </main>
      <footer className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{t("layout.footer.build", { build: heartbeat, year })}</span>
          <span className="uppercase tracking-[0.3em]">{pathname}</span>
        </div>
      </footer>
    </div>
  );
}

type UserMenuProps = {
  name: string;
  role: string;
  avatarUrl?: string | null;
  isAdmin?: boolean;
  onAdmin: () => void;
  onProfile: () => void;
  onSignOut: () => void;
};

const UserMenu = ({
  name,
  role,
  avatarUrl,
  isAdmin,
  onAdmin,
  onProfile,
  onSignOut,
}: UserMenuProps) => {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground transition hover:bg-muted"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar className="size-8">
          <AvatarImage src={avatarUrl ?? ""} alt={name} />
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
        <span>{name}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover p-2 text-sm text-popover-foreground shadow-lg"
        >
          <div className="border-b border-border px-2 pb-2">
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {role}
            </p>
          </div>
          <div className="mt-2 flex flex-col">
            {isAdmin ? (
              <button
                type="button"
                className="rounded-md px-2 py-1.5 text-left transition hover:bg-muted"
                onClick={() => {
                  setOpen(false);
                  onAdmin();
                }}
              >
                {t("layout.userMenu.adminConsole")}
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-md px-2 py-1.5 text-left transition hover:bg-muted"
              onClick={() => {
                setOpen(false);
                onProfile();
              }}
            >
              {t("layout.userMenu.userProfile")}
            </button>
            <button
              type="button"
              className="mt-2 rounded-md px-2 py-1.5 text-left text-destructive transition hover:bg-destructive/10"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
            >
              {t("layout.userMenu.signOut")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
