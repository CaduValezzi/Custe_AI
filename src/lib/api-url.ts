/**
 * API base URL for the openapi-fetch client.
 *
 * Empty string = same-origin: the browser talks to the Next.js server and the
 * server rewrites `/api/*` → backend (see next.config.ts `rewrites`). This is
 * the right mode for both local dev and the Docker stack (the browser cannot
 * resolve the `backend` service name).
 *
 * Override with `NEXT_PUBLIC_ACS_API_URL` when the browser should call the API
 * host directly (e.g. a remote staging backend).
 */
export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_ACS_API_URL ?? "").replace(/\/$/, "")
}

/** Public base URL for docs/curl snippets (dev: same-origin). */
export function getPublicApiBase(): string {
  const env = getApiBaseUrl()
  if (env) return env
  if (typeof window !== "undefined") return window.location.origin.replace(/\/$/, "")
  return ""
}
