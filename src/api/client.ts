import createClient from "openapi-fetch"

import { getApiBaseUrl } from "@/lib/api-url"
import type { paths } from "./schema"

export type OpsSecretGetter = () => string | null

let getOpsSecret: OpsSecretGetter = () => null

/** Wire ops secret from React context / storage (call once from app shell). */
export function configureApiClient(options: { getOpsSecret: OpsSecretGetter }) {
  getOpsSecret = options.getOpsSecret
}

export const apiClient = createClient<paths>({
  baseUrl: getApiBaseUrl(),
  credentials: "include",
})

let isRefreshing = false
let refreshQueue: Array<(success: boolean) => void> = []

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => refreshQueue.push(resolve))
  }

  isRefreshing = true
  try {
    const { error } = await apiClient.POST("/api/v1/auth/refresh", {})
    const success = !error
    refreshQueue.forEach((cb) => cb(success))
    refreshQueue = []
    return success
  } catch {
    refreshQueue.forEach((cb) => cb(false))
    refreshQueue = []
    return false
  } finally {
    isRefreshing = false
  }
}

apiClient.use({
  async onRequest({ request, schemaPath }) {
    if (schemaPath.startsWith("/api/v1/ops") && getOpsSecret()) {
      request.headers.set("X-Ops-Secret", getOpsSecret()!.trim())
    }
    return request
  },
  async onResponse({ response, schemaPath }) {
    if (response.status === 401 && !schemaPath.includes("/auth/refresh")) {
      const refreshed = await attemptRefresh()
      if (!refreshed) {
        return response
      }
      // Cookie rotated; signal the caller to retry once (React Query retry re-runs).
      return new Response(null, { status: 401, statusText: "Token refreshed, retry request" })
    }
    return response
  },
})

/** Typed error body from FastAPI */
export function getErrorDetail(error: unknown): string {
  if (error && typeof error === "object" && "detail" in error) {
    const d = (error as { detail: unknown }).detail
    if (typeof d === "string") return d
    if (Array.isArray(d)) return JSON.stringify(d)
  }
  return "Request failed"
}
