"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

export type Locale = "en" | "fr";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "chatfleet_locale";

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") {
      setLocaleState(stored);
      return;
    }
    const browserLocale =
      typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : null;
    if (browserLocale === "en" || browserLocale === "fr") {
      setLocaleState(browserLocale);
      window.localStorage.setItem(STORAGE_KEY, browserLocale);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
};
