"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import * as API from "@/lib/apiClient";
import { getStoredToken, setStoredToken } from "@/lib/auth-storage";
import type { LoginRequest, RegisterRequest, UserPublic } from "@/schemas";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: UserPublic | null;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPublic | null>(null);
  const [status, setStatus] = useState<AuthStatus>("idle");

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      setToken(stored);
      setStatus("loading");
      API.me(stored)
        .then((nextUser) => {
          setUser(nextUser);
          setStatus("authenticated");
        })
        .catch(() => {
          setStoredToken(null);
          setToken(null);
          setUser(null);
          setStatus("unauthenticated");
        });
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const sync = useCallback((nextToken: string, nextUser: UserPublic) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (payload: LoginRequest) => {
      setStatus("loading");
      const res = await API.login(payload);
      sync(res.token, res.user);
    },
    [sync],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      setStatus("loading");
      const res = await API.register(payload);
      sync(res.token, res.user);
    },
    [sync],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    setStatus("loading");
    try {
      const nextUser = await API.me(token);
      setUser(nextUser);
      setStatus("authenticated");
    } catch (err) {
      logout();
      throw err;
    }
  }, [logout, token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      token,
      user,
      login,
      register,
      logout,
      refresh,
    }),
    [login, logout, refresh, register, status, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
