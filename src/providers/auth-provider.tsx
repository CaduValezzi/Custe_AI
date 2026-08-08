"use client";

import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { apiClient, getErrorDetail } from "@/api/client";
import type { components } from "@/api/schema";

export type WorkspaceSummary = components["schemas"]["WorkspaceSummary"];

export type User = {
  user_id: string;
  email: string;
  display_name: string;
  roles: string[];
  tenant_id: string;
  tenant_name: string;
  workspaces: WorkspaceSummary[];
};

export type RegisterData = {
  email: string;
  password: string;
  display_name: string;
  tenant_name: string;
  timezone: string;
  base_currency: string;
};

export type CreateWorkspaceData = {
  tenant_name: string;
  timezone: string;
  base_currency: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  acceptInvite: (token: string, email: string, password: string, display_name: string) => Promise<void>;
  switchWorkspace: (tenantId: string) => Promise<void>;
  joinWorkspace: (inviteCode: string, email: string) => Promise<void>;
  createWorkspace: (data: CreateWorkspaceData) => Promise<void>;
  refreshSession: () => Promise<void>;
  userQuery: UseQueryResult<User | null, Error>;
};

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

const AuthContext = createContext<AuthContextValue | null>(null);

/** Map the API MeResponse onto the frontend User shape. */
function toUser(data: components["schemas"]["MeResponse"]): User {
  return {
    user_id: data.user_id,
    email: data.email,
    display_name: data.display_name ?? "",
    roles: data.roles,
    tenant_id: data.tenant_id,
    tenant_name: data.tenant_name,
    workspaces: data.workspaces ?? [],
  };
}

export async function fetchCurrentUser(): Promise<User | null> {
  const { data, error } = await apiClient.GET("/api/v1/auth/me");
  if (error || !data) return null;
  return toUser(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const user = userQuery.data ?? null;
  const isLoading = userQuery.isLoading;

  const refreshSession = useCallback(async () => {
    try {
      const { error } = await apiClient.POST("/api/v1/auth/refresh", {});
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
    } catch {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
    }
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await apiClient.POST("/api/v1/auth/login", {
        body: { email, password },
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, data ? toUser(data) : null);
    },
    [queryClient],
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const { data: me, error } = await apiClient.POST("/api/v1/auth/register", {
        body: {
          email: data.email,
          password: data.password,
          display_name: data.display_name,
          tenant_name: data.tenant_name,
          timezone: data.timezone,
          base_currency: data.base_currency,
        },
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, me ? toUser(me) : null);
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await apiClient.POST("/api/v1/auth/logout", {});
    queryClient.setQueryData(AUTH_QUERY_KEY, null);
    queryClient.clear();
    window.location.replace("/login");
  }, [queryClient]);

  const acceptInvite = useCallback(
    async (token: string, email: string, password: string, display_name: string) => {
      const { data: me, error } = await apiClient.POST("/api/v1/auth/invite/redeem", {
        body: { invite_code: token, email, password, display_name },
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, me ? toUser(me) : null);
    },
    [queryClient],
  );

  const switchWorkspace = useCallback(
    async (tenantId: string) => {
      const { data: me, error } = await apiClient.POST("/api/v1/auth/switch-workspace", {
        body: { tenant_id: tenantId },
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, me ? toUser(me) : null);
      await queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const joinWorkspace = useCallback(
    async (inviteCode: string, email: string) => {
      const { data: me, error } = await apiClient.POST("/api/v1/auth/invite/join", {
        body: { invite_code: inviteCode, email },
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, me ? toUser(me) : null);
    },
    [queryClient],
  );

  const createWorkspace = useCallback(
    async (data: CreateWorkspaceData) => {
      const { data: me, error } = await apiClient.POST("/api/v1/auth/create-workspace", {
        body: data,
      });
      if (error) throw new Error(getErrorDetail(error));
      queryClient.setQueryData(AUTH_QUERY_KEY, me ? toUser(me) : null);
    },
    [queryClient],
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      acceptInvite,
      switchWorkspace,
      joinWorkspace,
      createWorkspace,
      refreshSession,
      userQuery,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      acceptInvite,
      switchWorkspace,
      joinWorkspace,
      createWorkspace,
      refreshSession,
      userQuery,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Hierarchical role check: admin (3) > editor (2) > viewer (1). */
export function requireRole(user: User | null, ...allowedRoles: string[]): boolean {
  if (!user) return false;
  const roleHierarchy: Record<string, number> = { admin: 3, editor: 2, viewer: 1 };
  const userLevel = Math.max(...user.roles.map((r) => roleHierarchy[r] ?? 0));
  const requiredLevel = Math.min(...allowedRoles.map((r) => roleHierarchy[r] ?? 0));
  return userLevel >= requiredLevel;
}
