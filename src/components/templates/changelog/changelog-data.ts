export type ChangelogTag = "feature" | "fix" | "security" | "changed" | "removed";

export interface ChangelogItem {
  tag: ChangelogTag;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  items: ChangelogItem[];
}

/** Static release history for `/app/changelog` (port of mock `changelog-data.ts`). */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v0.8.0",
    date: "2026-08-07",
    items: [
      {
        tag: "feature",
        description:
          "Complete frontend rebuild on Next.js 16 (App Router) + React 19 + TypeScript + SCSS Modules + Tailwind v4: every page rebuilt on the brand identity (dark-only violet/blue/cyan palette, DM Serif Display / DM Mono / Figtree) — marketing landing, auth (login, register, invite/join, forgot-password), dashboard, provider registry and provider detail (Budgets, Tags, Polling, Credentials, Manual, Health, Integration, Invoices tabs), cost allocation, settings, user management, changelog, and user guide.",
      },
      {
        tag: "feature",
        description:
          "i18n rollout: full English and Portuguese (pt-BR) support across the entire application via react-i18next, with the <html lang> attribute kept in sync on language switch.",
      },
      {
        tag: "feature",
        description:
          "Data layer rebuilt on openapi-fetch + TanStack Query with TypeScript types regenerated from the backend OpenAPI contract; auth, providers, analytics, and manual-cost flows now call the real API through a same-origin rewrite proxy.",
      },
      {
        tag: "feature",
        description:
          "Component library ported from the reference mock and restyled on brand tokens: Radix-based dialog, select, dropdown-menu, tabs, tooltip, table, card, badge, label, separator, textarea, plus toast notifications; existing Button/Input atoms extended with variants, sizes, and asChild support.",
      },
      {
        tag: "feature",
        description:
          "Authenticated app shell with role-aware sidebar navigation — Dashboard, Providers, Cost Allocation, Settings, Changelog, Guide, and admin-only Users — enforcing the role hierarchy (admin > editor > viewer) on the client.",
      },
      {
        tag: "feature",
        description: "Landing page CTAs wired to the real /register and /login routes; the GSAP hero experience is preserved.",
      },
      {
        tag: "fix",
        description:
          "Dead links resolved: /register is now a real sign-up flow (auto-login into a new workspace) and /forgot-password received a stub page instead of 404.",
      },
      {
        tag: "fix",
        description:
          "Trailing-slash proxy fix: backend routes are uniformly no-slash and the frontend calls them no-slash; Next's trailing-slash 308 redirect is disabled as defense-in-depth so no /api call can escape the same-origin proxy (which would drop the httpOnly auth cookie as a cross-origin request).",
      },
      {
        tag: "security",
        description:
          "Auth cookies remain httpOnly + SameSite and never leave the same-origin proxy; the dev tenant-header bypass stays gated behind ACS_DEVELOPMENT_TENANT_HEADER and is rejected when combined with secure-cookie production settings.",
      },
      {
        tag: "fix",
        description:
          "Docker proxy fix: the compose frontend was proxying /api to itself (ECONNREFUSED on login) because next.config.ts rewrites() destinations are baked into routes-manifest.json at build time, so the runtime ACS_API_UPSTREAM env was never read. /api and /health now proxy through the Next.js 16 runtime proxy (src/proxy.ts), which resolves ACS_API_UPSTREAM per request — the browser stays on the frontend origin and the httpOnly auth cookies survive.",
      },
      {
        tag: "changed",
        description:
          "Docker: frontend image rebuilt for Next.js standalone output; the compose frontend service proxies /api and /health to the backend container via ACS_API_UPSTREAM; frontend .dockerignore added so the build context no longer ships host node_modules (~14 kB context).",
      },
      {
        tag: "changed",
        description: "Root documentation updated: CLAUDE.md now describes the frontend as Next.js 16 (App Router).",
      },
      {
        tag: "changed",
        description:
          "E2E verification green: build (tsc -b) + ESLint clean across 15 routes; full walkthrough passed through the proxy — register → /auth/me → provider registry create/list → analytics overview/charts/cost-allocation → manual cost entry with USD→BRL FX normalization (rate source: external API) — with no trailing-slash redirects.",
      },
    ],
  },
  {
    version: "v0.7.2",
    date: "2025-06-18",
    items: [
      {
        tag: "feature",
        description:
          "User Guide page: full in-app documentation covering every feature — Getting Started, Dashboard, Providers, Automatic Polling, Webhooks & Integration, Manual Cost Entry, Cost Allocation, Tags, Budgets & Alerts, Analytics & Charts, Settings, Users & Invitations, Workspaces, Security, Credentials, and Changelog. Accessible from a new sidebar nav tab for all authenticated users.",
      },
    ],
  },
  {
    version: "v0.7.1",
    date: "2025-06-18",
    items: [
      {
        tag: "feature",
        description:
          "Cost Allocation page: new top-level sidebar page with cross-tab report — select tag keys, generate a table of spend broken down by tag value × provider.",
      },
      {
        tag: "feature",
        description: "Dashboard tag filtering: filter overview and charts by tag key + value directly from the dashboard controls.",
      },
      {
        tag: "feature",
        description: "Dashboard tag breakdown card: view spend grouped by tag dimension below the existing provider breakdown.",
      },
      {
        tag: "feature",
        description: "Dashboard tag pie chart: group pie slices by any tag key (e.g. team) alongside the provider pie chart.",
      },
      {
        tag: "feature",
        description:
          "Provider Tags tab: view, edit, and save default cost-allocation tags on each provider, plus a one-click backfill to re-apply tags to existing events.",
      },
      {
        tag: "feature",
        description: "Default tags on provider registration: optional default_tags JSON field when creating a new provider.",
      },
      {
        tag: "changed",
        description: "Manual cost form now includes an optional tags JSON field for event-level tag overrides.",
      },
    ],
  },
  {
    version: "v0.7.0",
    date: "2025-06-18",
    items: [
      {
        tag: "feature",
        description:
          "Multi-Provider Cost Allocation & Tagging: attribute costs to teams, projects, environments, or any custom dimension via a flexible tags/labels system on every cost event.",
      },
      {
        tag: "feature",
        description:
          "Provider default tags: providers define default cost-allocation tags (e.g. team, env) that are automatically inherited by all cost events created from that provider.",
      },
      {
        tag: "feature",
        description:
          "Tag inheritance with event-level overrides: individual cost events can override provider defaults at write time; event-level values win on key conflict.",
      },
      {
        tag: "feature",
        description:
          "Tag-based filtering on all analytics endpoints: filter /overview and /charts by tag_key + tag_value query params to scope dashboards to a specific team or environment.",
      },
      {
        tag: "feature",
        description:
          "Tag dimension breakdown: /overview now returns breakdown_by_tag with nested {tag_key: {tag_value: total}} alongside the existing provider breakdown.",
      },
      {
        tag: "feature",
        description:
          "Tag pie chart grouping: /charts accepts a group_by_tag param to generate pie slices grouped by any tag key instead of only by provider.",
      },
      {
        tag: "feature",
        description:
          "GET /analytics/cost-allocation endpoint: cross-tabulates spend by tag value × provider — 'Team X spent $Y across providers A, B, C this month'.",
      },
      {
        tag: "feature",
        description: "PATCH /providers/{id}/tags endpoint: update default cost-allocation tags on a provider at any time.",
      },
      {
        tag: "feature",
        description:
          "POST /providers/{id}/backfill-tags endpoint: re-propagate changed provider default tags to all existing cost events while preserving event-level overrides.",
      },
      {
        tag: "changed",
        description:
          "Manual cost line and webhook/polling ingestion paths now accept and persist resolved tags on every CostEvent.",
      },
      {
        tag: "changed",
        description:
          "DailyCostAggregate rollups now carry tags and use a tags_hash discriminator for unique indexing per tag combination.",
      },
    ],
  },
  {
    version: "v0.6.0",
    date: "2025-06-18",
    items: [
      {
        tag: "feature",
        description:
          "Real-Time Provider Usage Polling: automated cost ingestion from OpenAI and other provider APIs. Transforms the product from manual tracking to automated cost observatory.",
      },
      {
        tag: "feature",
        description: "Provider adapter plugin system with OpenAI adapter (AWS Cost Explorer adapter ready for P1 implementation).",
      },
      {
        tag: "feature",
        description: "Distributed locking via PollingCursor collection: prevents concurrent workers from polling the same provider simultaneously.",
      },
      {
        tag: "feature",
        description: "Exponential backoff with jitter for failed polls: automatically retries with increasing delays (capped at 5 minutes).",
      },
      {
        tag: "feature",
        description:
          "Bulk idempotency for cost ingestion: O(1) database queries using $in operator instead of O(N) individual lookups.",
      },
      {
        tag: "feature",
        description:
          "30-day historical backfill on first provider poll: populates dashboards immediately instead of showing blank screens.",
      },
      {
        tag: "feature",
        description: "PATCH /providers/{id}/polling endpoint: toggle automatic polling and configure per-provider intervals.",
      },
      {
        tag: "changed",
        description:
          "Provider detail API now includes polling_status with last_polled_at, consecutive_failures, and next_retry_at for visibility.",
      },
      {
        tag: "security",
        description:
          "Polling credentials use existing Fernet encryption infrastructure; decrypted only in memory during poll execution.",
      },
      {
        tag: "changed",
        description:
          "Replaced placeholder fetch_stub_log scheduler job with concurrent poll_all_provider_usage using asyncio.Semaphore(10) for throttling.",
      },
    ],
  },
  {
    version: "v0.5.3",
    date: "2025-06-18",
    items: [
      {
        tag: "feature",
        description:
          "Multi-workspace support: users can belong to multiple workspaces and switch between them instantly. Active workspace context is re-issued in the JWT on every switch.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/create-workspace — authenticated users can spin up additional workspaces without registering a new account.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/invite/join — already-registered users can redeem an invite code to join an additional workspace without creating a new account.",
      },
      {
        tag: "changed",
        description:
          "Sidebar now shows a workspace switcher dropdown when the user is a member of more than one workspace.",
      },
    ],
  },
  {
    version: "v0.5.2",
    date: "2025-06-10",
    items: [
      {
        tag: "feature",
        description:
          "Admin invite flow: admins can generate expiring, email-bound 8-character invite codes via POST /auth/invite.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/invite/redeem — new users can register and join a workspace in a single step using an invite code.",
      },
      {
        tag: "feature",
        description: "GET /auth/invites — admins can list all pending (unused, non-expired) invites for their workspace.",
      },
      {
        tag: "feature",
        description: "DELETE /auth/invites/{token_hash} — admins can revoke a pending invite before it is redeemed.",
      },
      {
        tag: "security",
        description:
          "Invite codes are stored as SHA-256 hashes; the plaintext code is only returned once at creation time and never persisted in the database.",
      },
    ],
  },
  {
    version: "v0.5.1",
    date: "2025-06-03",
    items: [
      {
        tag: "security",
        description:
          "Role-based access control (RBAC) with a three-tier hierarchy: admin > editor > viewer. Higher roles automatically inherit all lower-role permissions.",
      },
      {
        tag: "feature",
        description:
          "require_role() FastAPI dependency factory: any endpoint can declare a minimum required role as a single Depends() call.",
      },
      {
        tag: "feature",
        description: "RequireAdmin and RequireEditor type aliases added for ergonomic use in route signatures.",
      },
      {
        tag: "feature",
        description:
          "User Management page in the frontend: admins can view workspace members, their roles, and invite new users.",
      },
    ],
  },
  {
    version: "v0.5.0",
    date: "2025-05-28",
    items: [
      {
        tag: "security",
        description:
          "Replaced the placeholder X-Tenant-Id header with full JWT-based authentication. The header is now only accepted in development mode when explicitly enabled via ACS_DEVELOPMENT_TENANT_HEADER=true.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/register — creates a new user and tenant in one step; first user of a workspace automatically receives the admin role.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/login and POST /auth/logout — standard credential-based login; JWT pair written as httpOnly, SameSite=strict cookies.",
      },
      {
        tag: "feature",
        description:
          "POST /auth/refresh — silent token rotation using the refresh token cookie; issues a new access + refresh token pair.",
      },
      {
        tag: "feature",
        description:
          "GET /auth/me — returns the current user profile including all workspace memberships and active roles.",
      },
      {
        tag: "security",
        description:
          "Access tokens expire in 15 minutes; refresh tokens expire in 7 days. Both are stored exclusively in httpOnly cookies — never exposed to JavaScript.",
      },
      {
        tag: "feature",
        description:
          "Password strength validation enforced server-side: minimum 8 characters, requires at least one digit.",
      },
    ],
  },
  {
    version: "v0.4.2",
    date: "2025-05-14",
    items: [
      {
        tag: "feature",
        description:
          "Budget alert system: tenants can configure monthly spending thresholds per provider. Alerts fire when projected spend crosses 80% or 100% of the budget.",
      },
      {
        tag: "feature",
        description:
          "APScheduler-based periodic tasks: monthly cost aggregation and budget projection jobs run automatically in the background.",
      },
      {
        tag: "feature",
        description:
          "Analytics projections endpoint: returns current-month spend vs. budget with linear end-of-month projection.",
      },
    ],
  },
  {
    version: "v0.4.1",
    date: "2025-05-07",
    items: [
      {
        tag: "feature",
        description:
          "Dashboard page with monthly cost breakdown, per-provider spend charts, and top-cost provider ranking.",
      },
      {
        tag: "feature",
        description: "Settings page: update tenant name, timezone, base currency, and budget thresholds.",
      },
      {
        tag: "feature",
        description:
          "Currency conversion: all costs are normalised to the tenant's base currency using configurable exchange rates.",
      },
      {
        tag: "changed",
        description:
          "Sidebar navigation added with links to Dashboard, Providers, Settings, and (admin-only) Users.",
      },
    ],
  },
  {
    version: "v0.4.0",
    date: "2025-04-29",
    items: [
      {
        tag: "feature",
        description: "Provider management: register AI/API providers per workspace (name, base URL, default currency).",
      },
      {
        tag: "feature",
        description:
          "Cost ingestion via authenticated webhook (POST /webhooks/{provider_id}/ingest) and manual entry endpoint.",
      },
      {
        tag: "feature",
        description:
          "Monthly invoice aggregation: costs are rolled up into per-provider monthly invoices stored in MongoDB.",
      },
      {
        tag: "feature",
        description:
          "Health probe endpoints: GET /health/live and GET /health/ready for container orchestration liveness/readiness checks.",
      },
    ],
  },
];
