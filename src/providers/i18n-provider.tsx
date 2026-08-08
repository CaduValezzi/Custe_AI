"use client";

import i18n, { setStoredLocale, type Locale } from "@/i18n";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type I18nContextValue = {
  locale: Locale;
  setLocale: (lng: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Initializes the i18next instance (import side-effect), keeps
 * `document.documentElement.lang` in sync, and exposes a locale switcher
 * that persists the choice to localStorage.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(i18n.language as Locale);

  const setLocale = (lng: Locale) => {
    void i18n.changeLanguage(lng);
    setStoredLocale(lng);
    setLocaleState(lng);
  };

  useEffect(() => {
    const syncLang = () => {
      document.documentElement.lang = i18n.language.startsWith("pt") ? "pt-BR" : "en";
    };
    syncLang();
    i18n.on("languageChanged", syncLang);
    return () => {
      i18n.off("languageChanged", syncLang);
    };
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used within I18nProvider");
  return ctx;
}
