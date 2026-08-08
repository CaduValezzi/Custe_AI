import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Next.js 16 renamed Middleware → Proxy; it runs on the Node.js runtime and reads
// process.env per-request — unlike next.config.ts `rewrites()`, whose destinations
// are baked into routes-manifest.json at `next build`. That bake broke the Docker
// stack: the container had ACS_API_UPSTREAM=http://backend:8000 but still proxied
// /api → http://127.0.0.1:8000 (the build-time default, i.e. the container itself)
// → ECONNREFUSED on login. Rewriting server-side keeps the browser on the frontend
// origin so the backend's httpOnly auth cookies survive.
export const config = {
  matcher: ["/api/:path*", "/health/:path*"],
};

export function proxy(request: NextRequest) {
  const upstream = process.env.ACS_API_UPSTREAM ?? "http://127.0.0.1:8000";
  return NextResponse.rewrite(
    new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, upstream),
  );
}
