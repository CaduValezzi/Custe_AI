"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Plus,
  ScrollText,
  Server,
  Settings,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { apiClient, getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { requireRole, useAuth } from "@/providers";

import S from "./styles.module.scss";

type NavItem = {
  to: string;
  labelKey: string;
  icon: LucideIcon;
  requiresRole?: string;
};

const nav: NavItem[] = [
  { to: "/app", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/app/providers", labelKey: "nav.providers", icon: Server },
  { to: "/app/cost-allocation", labelKey: "nav.costAllocation", icon: PieChart },
  { to: "/app/settings", labelKey: "nav.settings", icon: Settings },
  { to: "/app/users", labelKey: "nav.users", icon: Users, requiresRole: "admin" },
  { to: "/app/changelog", labelKey: "nav.changelog", icon: ScrollText },
  { to: "/app/guide", labelKey: "nav.guide", icon: BookOpen },
];

/**
 * Authenticated app shell: sidebar navigation + workspace switcher + health
 * indicator + mobile drawer (port of mock `app-shell.tsx`, restyled on brand
 * tokens). Expects to render inside `app/layout.tsx`.
 */
export const AppShell = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, switchWorkspace, joinWorkspace, createWorkspace } = useAuth();

  const [isSwitching, setIsSwitching] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleJoinWorkspace = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    try {
      await joinWorkspace(inviteCode.trim(), user?.email ?? "");
      toast.success(t("workspace.joinSuccess"));
      setInviteCode("");
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    setIsCreating(true);
    try {
      await createWorkspace({
        tenant_name: newWorkspaceName.trim(),
        timezone: "UTC",
        base_currency: "USD",
      });
      toast.success(t("workspace.createSuccess"));
      setNewWorkspaceName("");
      setShowCreateWorkspace(false);
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    } finally {
      setIsCreating(false);
    }
  };

  const handleSwitchWorkspace = async (tenantId: string) => {
    if (tenantId === user?.tenant_id || isSwitching) return;
    setIsSwitching(true);
    try {
      await switchWorkspace(tenantId);
      toast.success(t("workspace.switchSuccess"));
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    } finally {
      setIsSwitching(false);
    }
  };

  const hasMultipleWorkspaces = (user?.workspaces.length ?? 0) > 1;

  const health = useQuery({
    queryKey: ["health", "live"],
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/health/live");
      if (error) throw new Error("down");
      return data;
    },
    refetchInterval: 30_000,
    retry: 1,
  });

  const visibleNav = nav.filter((item) => !item.requiresRole || requireRole(user, item.requiresRole));

  const sidebarContent = (
    <>
      {/* Brand + workspace */}
      <div className={S.sidebar__brand}>
        <Link href="/app" onClick={() => setMobileOpen(false)}>
          <span className={S.sidebar__brand__name}>Custe.AI</span>
        </Link>
        {hasMultipleWorkspaces ? (
          <div className={S.sidebar__workspace}>
            <label className={S.sidebar__workspace__label}>{t("workspace.active")}</label>
            <select
              value={user?.tenant_id}
              onChange={(e) => handleSwitchWorkspace(e.target.value)}
              disabled={isSwitching}
              className={S.sidebar__workspace__select}
            >
              {user?.workspaces.map((ws) => (
                <option key={ws.tenant_id} value={ws.tenant_id}>
                  {ws.tenant_name}
                </option>
              ))}
            </select>
            <div className={S.sidebar__workspace__meta}>
              {user?.display_name} · {user?.roles.join(", ")}
            </div>
          </div>
        ) : (
          <div className={S.sidebar__identity}>
            <div className={S.sidebar__identity__name} title={user?.tenant_name ?? ""}>
              {user?.display_name}
            </div>
            <div className={S.sidebar__identity__roles}>{user?.roles.join(", ")}</div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={S.sidebar__divider} />

      {/* Navigation */}
      <nav className={S.sidebar__nav}>
        {visibleNav.map(({ to, labelKey, icon: Icon }) => {
          const isActive = to === "/app" ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              href={to}
              onClick={() => setMobileOpen(false)}
              className={`${S.sidebar__nav__item} ${isActive ? S.sidebar__nav__item__active : ""}`}
            >
              <Icon className={`${S.sidebar__nav__icon} ${isActive ? S.sidebar__nav__icon__active : ""}`} />
              {t(labelKey)}
              {isActive && <div className={S.sidebar__nav__dot} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className={S.sidebar__bottom}>
        {showCreateWorkspace ? (
          <div className={S.sidebar__panel}>
            <label className={S.sidebar__panel__label}>{t("workspace.createTitle")}</label>
            <div className={S.sidebar__panel__row}>
              <input
                className={S.sidebar__field}
                placeholder={t("workspace.workspaceName")}
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                disabled={isCreating}
              />
              <Button
                size="sm"
                variant="primary"
                fullWidth={false}
                className={S.sidebar__panel__button}
                onClick={handleCreateWorkspace}
                disabled={isCreating || !newWorkspaceName.trim()}
              >
                <Plus className={S.sidebar__panel__icon} />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              className={S.sidebar__panel__cancel}
              onClick={() => setShowCreateWorkspace(false)}
            >
              {t("common.cancel")}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            fullWidth={false}
            className={S.sidebar__action}
            onClick={() => setShowCreateWorkspace(true)}
          >
            <Plus className={S.sidebar__action__icon} />
            {t("workspace.createTitle")}
          </Button>
        )}

        <div className={S.sidebar__panel}>
          <label className={S.sidebar__panel__label}>{t("workspace.joinTitle")}</label>
          <div className={S.sidebar__panel__row}>
            <input
              className={S.sidebar__field}
              placeholder={t("workspace.inviteCode")}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={isJoining}
            />
            <Button
              size="sm"
              variant="secondary"
              fullWidth={false}
              className={S.sidebar__panel__button}
              onClick={handleJoinWorkspace}
              disabled={isJoining || !inviteCode.trim()}
            >
              <Plus className={S.sidebar__panel__icon} />
            </Button>
          </div>
        </div>

        <div className={S.sidebar__health}>
          <div className={S.sidebar__health__status}>
            <Activity className={`${S.sidebar__health__icon} ${health.isSuccess ? S.sidebar__health__icon__up : S.sidebar__health__icon__down}`} />
            {health.isSuccess ? t("common.apiUp") : t("common.apiDown")}
          </div>
        </div>

        <Button
          variant="ghost"
          fullWidth={false}
          className={S.sidebar__action}
          onClick={() => logout()}
        >
          <LogOut className={S.sidebar__action__icon} />
          {t("nav.logout")}
        </Button>
      </div>
    </>
  );

  return (
    <div className={S.shell}>
      {/* Desktop sidebar */}
      <aside className={S.sidebar}>{sidebarContent}</aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className={S.drawer}>
          <div className={S.drawer__backdrop} onClick={() => setMobileOpen(false)} />
          <aside className={S.drawer__panel}>
            <div className={S.drawer__close}>
              <Button variant="ghost" size="icon" fullWidth={false} onClick={() => setMobileOpen(false)}>
                <X className={S.drawer__close__icon} />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className={S.main}>
        <header className={S.header}>
          <Button variant="ghost" size="icon" fullWidth={false} onClick={() => setMobileOpen(true)}>
            <Menu className={S.header__icon} />
          </Button>
          <span className={S.header__brand}>Custe.AI</span>
          <div className={S.header__health}>
            <Activity className={`${S.header__health__icon} ${health.isSuccess ? S.header__health__icon__up : S.header__health__icon__down}`} />
          </div>
        </header>
        <main className={S.main__content}>{children}</main>
      </div>
    </div>
  );
};
