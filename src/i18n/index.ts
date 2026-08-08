import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

export const SUPPORTED_LOCALES = ["en", "pt-BR"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const STORAGE_LOCALE = "acs_locale";

/** Read the persisted locale. SSR-safe (returns null on the server). */
export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_LOCALE);
  return stored === "en" || stored === "pt-BR" ? stored : null;
}

export function setStoredLocale(lng: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_LOCALE, lng);
}

/** Default: stored locale, else browser language (pt → pt-BR), else en. */
function detectLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pt")) {
    return "pt-BR";
  }
  return "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "pt-BR": { translation: ptBR },
  },
  lng: detectLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
