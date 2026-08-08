"use client";

import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/organisms/app-shell";
import { useAuth } from "@/providers";

import S from "./styles.module.scss";

/**
 * Protected layout for the `/app` section. Client-side guard: while the
 * auth session is still resolving it renders a brand splash (avoids a redirect
 * flash for authenticated users); once resolved, unauthenticated users are
 * redirected to `/login` and the rest render inside `<AppShell>`.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={S.splash}>
        <span className={S.splash__brand}>Custe.AI</span>
        <span className={S.splash__dot} aria-hidden />
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
