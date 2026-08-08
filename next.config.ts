import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // The backend serves every route without a trailing slash (FastAPI
  // `redirect_slashes` 307s the no-slash form to an absolute upstream URL —
  // which would escape this rewrite proxy and drop the httpOnly auth cookie
  // as a cross-origin request). The API client therefore calls no-slash paths
  // (e.g. `/api/v1/providers`). As defense-in-depth, disable Next's own
  // trailing-slash 308 normalization so an accidental with-slash `/api/*`
  // call is proxied through the rewrite (which strips the slash) instead of
  // bouncing. See next docs proxy.md.
  skipTrailingSlashRedirect: true,
  // Standalone output for the Docker image (see Dockerfile).
  output: "standalone",
  // Pin the tracing root to the frontend package so Next doesn't infer a
  // workspace root from a stray lockfile in the user's home directory.
  outputFileTracingRoot: __dirname,
  sassOptions: {
    additionalData: `@use '@/styles/breakpoints' as *;`,
  },
  // The API client uses same-origin URLs; `/api` and `/health` are proxied to
  // the backend by `src/proxy.ts`, which resolves `ACS_API_UPSTREAM` at runtime
  // (dev default is a locally running backend; the Docker stack overrides it to
  // the compose `backend` service name). A next.config `rewrites()` here would
  // be baked into routes-manifest.json at build time and could not read the
  // runtime env — the bug that shipped the container proxying to itself.
};

export default nextConfig;