/** TanStack Query key factories — keep cache scoping consistent across pages. */
export const qk = {
  whoami: (tenantId: string) => ["whoami", tenantId] as const,
  providers: (tenantId: string) => ["providers", tenantId] as const,
  provider: (tenantId: string, providerId: string) => ["provider", tenantId, providerId] as const,
  invoices: (tenantId: string, providerId: string) => ["invoices", tenantId, providerId] as const,
  overview: (tenantId: string, month: string | undefined) => ["analytics", "overview", tenantId, month ?? ""] as const,
  charts: (tenantId: string, month: string | undefined) => ["analytics", "charts", tenantId, month ?? ""] as const,
  health: () => ["health", "live"] as const,
}
