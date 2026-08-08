"use client";

import type { ReactNode } from "react";

import { QueryProvider } from "./query-provider";
import { I18nProvider } from "./i18n-provider";
import { AuthProvider } from "./auth-provider";
import { Toaster } from "@/components/ui/toaster";

export { useAuth, requireRole, AUTH_QUERY_KEY, type User, type WorkspaceSummary, type RegisterData } from "./auth-provider";
export { useLocale } from "./i18n-provider";

/**
 * Root provider stack for the whole app (auth pages + protected app shell).
 * QueryProvider must wrap AuthProvider (it consumes useQueryClient); i18n is
 * order-independent.
 */
export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <I18nProvider>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </I18nProvider>
    </QueryProvider>
  );
}
