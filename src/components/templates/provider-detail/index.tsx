"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, RefreshCw, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient, getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getPublicApiBase } from "@/lib/api-url";
import { formatMoneyAmount, parseDecimalString } from "@/lib/money";
import { useAuth } from "@/providers";

const budgetSchema = z.object({
  monthly_budget_limit_base: z.string().optional(),
  prepaid_balance_base: z.string().optional(),
});

const manualSchema = z.object({
  amount_original: z.string().min(1),
  currency_original: z.string().length(3),
  tags_json: z.string().optional(),
});

const invoiceSchema = z.object({
  amount_original: z.string().min(1),
  currency_original: z.string().length(3),
  period_start: z.string().min(1),
  period_end: z.string().min(1),
  notes: z.string().optional(),
  stored_object_key: z.string().optional(),
});

const pollingSchema = z.object({
  is_polling_enabled: z.boolean(),
  polling_interval_seconds: z.string().optional(),
});

const credentialsSchema = z.object({
  access_key: z.string().optional(),
  webhook_secret: z.string().optional(),
});

const tagsSchema = z.object({
  default_tags_json: z.string().min(1),
});

/** Local shape of `ProviderOut.polling_status` (schema types it as `unknown` map). */
type PollingStatus = {
  last_polled_at?: string | null;
  status?: string | null;
  consecutive_failures?: number | null;
  next_retry_at?: string | null;
  last_error?: string | null;
};

/**
 * `/app/providers/[id]` — provider detail with 8 tabs (Budgets, Tags,
 * Polling, Credentials, Manual, Health, Integration, Invoices). Port of mock
 * `provider-detail-page.tsx`, restyled on brand tokens (B1). Tenant identity
 * is resolved server-side, so every endpoint here takes only `path` params
 * (schema `query?: never`) — no `tenantQuery`.
 */
export const ProviderDetailTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const tenantId = user?.tenant_id;
  const qc = useQueryClient();
  const base = getPublicApiBase();

  const whoami = useQuery({
    queryKey: ["whoami", tenantId!],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/tenants/whoami");
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

  const provider = useQuery({
    queryKey: ["provider", tenantId!, id],
    enabled: Boolean(tenantId) && Boolean(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/providers/{provider_id}", {
        params: { path: { provider_id: id } },
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

  const invoices = useQuery({
    queryKey: ["invoices", tenantId!, id],
    enabled: Boolean(tenantId) && Boolean(id),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/providers/{provider_id}/invoices", {
        params: { path: { provider_id: id } },
      });
      if (error) throw new Error(getErrorDetail(error));
      return data ?? [];
    },
  });

  const budgetForm = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    values: {
      monthly_budget_limit_base:
        provider.data?.monthly_budget_limit_base != null ? String(provider.data.monthly_budget_limit_base) : "",
      prepaid_balance_base: provider.data?.prepaid_balance_base != null ? String(provider.data.prepaid_balance_base) : "",
    },
  });

  const manualForm = useForm<z.infer<typeof manualSchema>>({
    resolver: zodResolver(manualSchema),
    defaultValues: { amount_original: "", currency_original: whoami.data?.base_currency ?? "USD", tags_json: "" },
  });

  const invoiceForm = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      amount_original: "",
      currency_original: "USD",
      period_start: "",
      period_end: "",
      notes: "",
      stored_object_key: "",
    },
  });

  const pollingForm = useForm<z.infer<typeof pollingSchema>>({
    resolver: zodResolver(pollingSchema),
    values: {
      is_polling_enabled: provider.data?.is_polling_enabled ?? true,
      polling_interval_seconds: provider.data?.polling_interval_seconds?.toString() ?? "",
    },
  });

  const credentialsForm = useForm<z.infer<typeof credentialsSchema>>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      access_key: "",
      webhook_secret: "",
    },
  });

  const tagsForm = useForm<z.infer<typeof tagsSchema>>({
    resolver: zodResolver(tagsSchema),
    values: {
      default_tags_json: provider.data?.default_tags ? JSON.stringify(provider.data.default_tags, null, 2) : "{}",
    },
  });

  const [healthResult, setHealthResult] = useState<string | null>(null);
  const [pollingSaving, setPollingSaving] = useState(false);
  const [pollTestResult, setPollTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [pollTesting, setPollTesting] = useState(false);
  const [credentialsSaving, setCredentialsSaving] = useState(false);
  const [tagsSaving, setTagsSaving] = useState(false);
  const [backfilling, setBackfilling] = useState(false);

  const stripeUrl = `${base}/api/v1/webhooks/stripe/${id}`;
  const genericUrl = `${base}/api/v1/webhooks/generic/${id}`;

  const curlGeneric = useMemo(() => {
    const tid = tenantId ?? "$TENANT_ID";
    return `curl -sS -X POST "${genericUrl}?tenant_id=${encodeURIComponent(tid)}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Tenant-Id: ${tid}" \\\n  -H "X-Acs-Signature: <hex_hmac_of_body>" \\\n  -d '{"event_id":"evt_001","amount_original":"10","currency_original":"USD"}'`;
  }, [genericUrl, tenantId]);

  async function saveBudgets(values: z.infer<typeof budgetSchema>) {
    if (!tenantId) return;
    const { error } = await apiClient.PATCH("/api/v1/providers/{provider_id}/budgets", {
      params: { path: { provider_id: id } },
      body: {
        monthly_budget_limit_base: values.monthly_budget_limit_base?.trim() || null,
        prepaid_balance_base: values.prepaid_balance_base?.trim() || null,
      },
    });
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success(t("providers.saveBudgets"));
    void qc.invalidateQueries({ queryKey: ["provider", tenantId, id] });
    void qc.invalidateQueries({ queryKey: ["providers", tenantId] });
  }

  async function submitManual(values: z.infer<typeof manualSchema>) {
    if (!tenantId) return;
    let tags: Record<string, string> | null | undefined;
    if (values.tags_json?.trim()) {
      try {
        tags = JSON.parse(values.tags_json) as Record<string, string>;
      } catch {
        toast.error("Invalid JSON in tags");
        return;
      }
    }
    const { error } = await apiClient.POST("/api/v1/providers/manual-cost-line", {
      body: {
        provider_id: id,
        amount_original: values.amount_original.trim(),
        currency_original: values.currency_original.trim().toUpperCase(),
        occurred_at: null,
        tags: tags ?? null,
      },
    });
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success("OK");
    manualForm.reset({ amount_original: "", currency_original: values.currency_original, tags_json: "" });
    // Dashboard keys are `["overview", tenantId, ...]` / `["charts", tenantId, ...]`;
    // invalidate by prefix so every month/tag variant refetches.
    void qc.invalidateQueries({ queryKey: ["overview", tenantId] });
    void qc.invalidateQueries({ queryKey: ["charts", tenantId] });
  }

  async function submitInvoice(values: z.infer<typeof invoiceSchema>) {
    if (!tenantId) return;
    const { error } = await apiClient.POST("/api/v1/providers/{provider_id}/invoices", {
      params: { path: { provider_id: id } },
      body: {
        amount_original: values.amount_original.trim(),
        currency_original: values.currency_original.trim().toUpperCase(),
        period_start: values.period_start,
        period_end: values.period_end,
        notes: values.notes?.trim() || null,
        stored_object_key: values.stored_object_key?.trim() || null,
        occurred_at: null,
      },
    });
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success("Invoice recorded");
    invoiceForm.reset();
    void qc.invalidateQueries({ queryKey: ["invoices", tenantId, id] });
  }

  async function runHealth() {
    if (!tenantId) return;
    const { data, error } = await apiClient.POST("/api/v1/providers/{provider_id}/health-probe", {
      params: { path: { provider_id: id } },
    });
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    setHealthResult(JSON.stringify(data, null, 2));
  }

  async function savePolling(values: z.infer<typeof pollingSchema>) {
    if (!tenantId) return;
    setPollingSaving(true);
    const interval = values.polling_interval_seconds?.trim();
    const { error } = await apiClient.PATCH("/api/v1/providers/{provider_id}/polling", {
      params: { path: { provider_id: id } },
      body: {
        is_polling_enabled: values.is_polling_enabled,
        polling_interval_seconds: interval ? parseInt(interval, 10) : null,
      },
    });
    setPollingSaving(false);
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success(t("providers.savePolling"));
    void qc.invalidateQueries({ queryKey: ["provider", tenantId, id] });
  }

  async function testPollingConnection() {
    if (!tenantId) return;
    setPollTesting(true);
    setPollTestResult(null);
    const { data, error } = await apiClient.POST("/api/v1/providers/{provider_id}/poll-test", {
      params: { path: { provider_id: id } },
    });
    setPollTesting(false);
    if (error) {
      setPollTestResult({ success: false, message: getErrorDetail(error) });
      toast.error(t("providers.pollTestFailed"));
      return;
    }
    if (data) {
      setPollTestResult({ success: data.success, message: data.message });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
    void qc.invalidateQueries({ queryKey: ["provider", tenantId, id] });
  }

  async function saveCredentials(values: z.infer<typeof credentialsSchema>) {
    if (!tenantId) return;
    setCredentialsSaving(true);
    const { error } = await apiClient.PATCH("/api/v1/providers/{provider_id}/credentials", {
      params: { path: { provider_id: id } },
      body: {
        access_key: values.access_key?.trim() || null,
        webhook_secret: values.webhook_secret?.trim() || null,
      },
    });
    setCredentialsSaving(false);
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success(t("providers.saveCredentials"));
    credentialsForm.reset({ access_key: "", webhook_secret: "" });
    void qc.invalidateQueries({ queryKey: ["provider", tenantId, id] });
  }

  function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  }

  function copyText(text: string) {
    void navigator.clipboard.writeText(text);
    toast.success(t("common.copied"));
  }

  const cur = whoami.data?.base_currency ?? "USD";

  if (!tenantId) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" fullWidth={false} asChild>
          <Link href="/app/providers">{t("common.back")}</Link>
        </Button>
        {provider.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
        {provider.data && (
          <div>
            <h1 className="font-serif text-2xl font-bold">{provider.data.display_name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs">{provider.data.id}</span>
              <Badge>{provider.data.provider_kind}</Badge>
              <Badge variant="outline">{provider.data.billing_type}</Badge>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="budgets">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="budgets">{t("providers.budgetsTitle")}</TabsTrigger>
          <TabsTrigger value="tags">{t("providers.tagsTitle")}</TabsTrigger>
          <TabsTrigger value="polling">{t("providers.pollingTitle")}</TabsTrigger>
          <TabsTrigger value="credentials">{t("providers.credentialsTitle")}</TabsTrigger>
          <TabsTrigger value="manual">{t("providers.manualTitle")}</TabsTrigger>
          <TabsTrigger value="health">{t("providers.healthTitle")}</TabsTrigger>
          <TabsTrigger value="integration">{t("providers.integrationTitle")}</TabsTrigger>
          <TabsTrigger value="invoices">{t("providers.invoicesTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>{t("providers.budgetsTitle")}</CardTitle>
              <CardDescription>{cur}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="max-w-md space-y-4" onSubmit={budgetForm.handleSubmit(saveBudgets)}>
                <div className="space-y-2">
                  <Label>{t("providers.monthlyLimit")}</Label>
                  <Input {...budgetForm.register("monthly_budget_limit_base")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.prepaidBalance")}</Label>
                  <Input {...budgetForm.register("prepaid_balance_base")} />
                </div>
                <Button type="submit" fullWidth={false}>
                  {t("providers.saveBudgets")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="polling">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                {t("providers.pollingTitle")}
              </CardTitle>
              <CardDescription>{t("providers.pollingDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status display */}
              {provider.data?.polling_status && (() => {
                const ps = provider.data!.polling_status as PollingStatus;
                return (
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 text-sm font-medium">{t("providers.pollingStatus")}</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("providers.lastPolled")}</span>
                        <span>{formatDate(ps.last_polled_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("providers.pollingState")}</span>
                        <Badge variant={ps.status === "idle" ? "default" : "secondary"}>{ps.status ?? "—"}</Badge>
                      </div>
                      {ps.consecutive_failures != null && ps.consecutive_failures > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("providers.consecutiveFailures")}</span>
                          <span className="text-destructive">{ps.consecutive_failures}</span>
                        </div>
                      )}
                      {ps.next_retry_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("providers.nextRetry")}</span>
                          <span>{formatDate(ps.next_retry_at)}</span>
                        </div>
                      )}
                      {ps.last_error && <div className="mt-2 text-xs text-destructive">{ps.last_error}</div>}
                    </div>
                  </div>
                );
              })()}

              {/* Test connection */}
              <div className="max-w-md">
                <Button variant="outline" onClick={() => void testPollingConnection()} disabled={pollTesting}>
                  {pollTesting ? t("providers.pollTesting") : t("providers.pollTestButton")}
                </Button>
                {pollTestResult && (
                  <div
                    className={`mt-2 rounded-md p-3 text-sm ${
                      pollTestResult.success ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {pollTestResult.message}
                  </div>
                )}
              </div>

              {/* Configuration form */}
              <form className="max-w-md space-y-4" onSubmit={pollingForm.handleSubmit(savePolling)}>
                <div className="flex items-center justify-between space-y-0 rounded-md border p-4">
                  <div className="space-y-0.5">
                    <Label>{t("providers.enablePolling")}</Label>
                    <p className="text-sm text-muted-foreground">{t("providers.enablePollingDesc")}</p>
                  </div>
                  <input type="checkbox" {...pollingForm.register("is_polling_enabled")} className="h-4 w-4" />
                </div>

                <div className="space-y-2">
                  <Label>{t("providers.pollingInterval")}</Label>
                  <Input
                    {...pollingForm.register("polling_interval_seconds")}
                    placeholder={t("providers.pollingIntervalPlaceholder")}
                    type="number"
                    min={300}
                  />
                  <p className="text-xs text-muted-foreground">{t("providers.pollingIntervalHelp")}</p>
                </div>

                <Button type="submit" disabled={pollingSaving} fullWidth={false}>
                  {pollingSaving ? t("common.saving") : t("providers.savePolling")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>{t("providers.credentialsTitle")}</CardTitle>
              <CardDescription>{t("providers.credentialsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="max-w-md space-y-4" onSubmit={credentialsForm.handleSubmit(saveCredentials)}>
                <div className="space-y-2">
                  <Label>{t("providers.accessKey")}</Label>
                  <Input
                    {...credentialsForm.register("access_key")}
                    placeholder={provider.data?.access_key_masked || t("providers.accessKeyPlaceholder")}
                    type="password"
                    autoComplete="new-password"
                  />
                  <p className="text-xs text-muted-foreground">{t("providers.accessKeyHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.webhookSecret")}</Label>
                  <Input
                    {...credentialsForm.register("webhook_secret")}
                    placeholder={provider.data?.webhook_secret_masked || t("providers.webhookSecretPlaceholder")}
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground">{t("providers.webhookSecretHelp")}</p>
                </div>
                <Button type="submit" disabled={credentialsSaving} fullWidth={false}>
                  {credentialsSaving ? t("common.saving") : t("providers.saveCredentials")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {t("providers.tagsTitle")}
              </CardTitle>
              <CardDescription>{t("providers.tagsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium">{t("providers.currentTags")}</h4>
                {provider.data?.default_tags && Object.keys(provider.data.default_tags).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(provider.data.default_tags).map(([k, v]) => (
                      <Badge key={k} variant="secondary" className="font-mono text-xs">
                        {k}: {v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("providers.noTags")}</p>
                )}
              </div>

              <Separator />

              <form
                className="max-w-md space-y-4"
                onSubmit={tagsForm.handleSubmit(async (values) => {
                  if (!tenantId) return;
                  setTagsSaving(true);
                  let parsed: Record<string, string>;
                  try {
                    parsed = JSON.parse(values.default_tags_json) as Record<string, string>;
                  } catch {
                    toast.error("Invalid JSON");
                    setTagsSaving(false);
                    return;
                  }
                  const { error } = await apiClient.PATCH("/api/v1/providers/{provider_id}/tags", {
                    params: { path: { provider_id: id } },
                    body: { default_tags: parsed },
                  });
                  setTagsSaving(false);
                  if (error) {
                    toast.error(getErrorDetail(error));
                    return;
                  }
                  toast.success(t("providers.saveTags"));
                  void qc.invalidateQueries({ queryKey: ["provider", tenantId, id] });
                })}
              >
                <div className="space-y-2">
                  <Label>{t("providers.editTags")}</Label>
                  <Textarea rows={4} className="font-mono text-xs" {...tagsForm.register("default_tags_json")} />
                </div>
                <Button type="submit" disabled={tagsSaving} fullWidth={false}>
                  {tagsSaving ? t("common.saving") : t("providers.saveTags")}
                </Button>
              </form>

              <Separator />

              <div className="max-w-md">
                <p className="mb-2 text-sm text-muted-foreground">{t("providers.backfillConfirm")}</p>
                <Button
                  variant="outline"
                  disabled={backfilling}
                  fullWidth={false}
                  onClick={async () => {
                    if (!tenantId) return;
                    setBackfilling(true);
                    const { data, error } = await apiClient.POST("/api/v1/providers/{provider_id}/backfill-tags", {
                      params: { path: { provider_id: id } },
                    });
                    setBackfilling(false);
                    if (error) {
                      toast.error(getErrorDetail(error));
                      return;
                    }
                    toast.success(t("providers.backfillSuccess", { count: data?.events_updated ?? 0 }));
                  }}
                >
                  {backfilling ? t("common.saving") : t("providers.backfillTags")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>{t("providers.manualTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="max-w-md space-y-4" onSubmit={manualForm.handleSubmit(submitManual)}>
                <div className="space-y-2">
                  <Label>{t("providers.amount")}</Label>
                  <Input {...manualForm.register("amount_original")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.currency")}</Label>
                  <Input maxLength={3} {...manualForm.register("currency_original")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.manualTags")}</Label>
                  <Textarea rows={2} className="font-mono text-xs" placeholder='{"project":"chatbot-v2"}' {...manualForm.register("tags_json")} />
                </div>
                <Button type="submit" fullWidth={false}>
                  {t("providers.submitManual")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>{t("providers.healthTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => void runHealth()} fullWidth={false}>
                {t("providers.runHealth")}
              </Button>
              {healthResult && (
                <pre className="max-h-64 overflow-auto rounded-md bg-muted p-3 text-xs">{healthResult}</pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>{t("providers.integrationTitle")}</CardTitle>
              <CardDescription>{t("providers.integrationBody")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2 block">{t("providers.stripeUrl")}</Label>
                <div className="flex gap-2">
                  <Input readOnly value={stripeUrl} className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" fullWidth={false} onClick={() => copyText(stripeUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="mb-2 block">{t("providers.genericUrl")}</Label>
                <div className="flex gap-2">
                  <Input readOnly value={genericUrl} className="font-mono text-xs" />
                  <Button type="button" variant="outline" size="icon" fullWidth={false} onClick={() => copyText(genericUrl)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Separator />
              <div>
                <Label className="mb-2 block">{t("providers.curlGeneric")}</Label>
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">{curlGeneric}</pre>
                <Button type="button" variant="secondary" className="mt-2" fullWidth={false} onClick={() => copyText(curlGeneric)}>
                  {t("common.copy")}
                </Button>
              </div>
              <div>
                <Label className="mb-2 block">{t("providers.curlStripe")}</Label>
                <pre className="rounded-md bg-muted p-3 text-xs">stripe listen --forward-to {stripeUrl}</pre>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("providers.scriptLink")}:{" "}
                <code className="rounded bg-muted px-1">scripts/xasc_signature_converter.py</code>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("providers.invoiceAdd")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid max-w-xl gap-4 sm:grid-cols-2" onSubmit={invoiceForm.handleSubmit(submitInvoice)}>
                <div className="space-y-2">
                  <Label>{t("providers.amount")}</Label>
                  <Input {...invoiceForm.register("amount_original")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.currency")}</Label>
                  <Input maxLength={3} {...invoiceForm.register("currency_original")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.periodStart")}</Label>
                  <Input type="date" {...invoiceForm.register("period_start")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.periodEnd")}</Label>
                  <Input type="date" {...invoiceForm.register("period_end")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("providers.notes")}</Label>
                  <Textarea {...invoiceForm.register("notes")} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("providers.objectKey")}</Label>
                  <Input {...invoiceForm.register("stored_object_key")} />
                </div>
                <Button type="submit" className="sm:col-span-2" fullWidth={false}>
                  {t("providers.invoiceAdd")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("providers.invoicesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
              {invoices.data && invoices.data.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("providers.empty")}</p>
              )}
              {invoices.data && invoices.data.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("providers.amount")}</TableHead>
                      <TableHead>{t("providers.currency")}</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>{t("providers.periodStart")}</TableHead>
                      <TableHead>{t("providers.uploadedAt")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.data.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>{String(inv.amount_original)}</TableCell>
                        <TableCell>{inv.currency_original}</TableCell>
                        <TableCell>{formatMoneyAmount(parseDecimalString(inv.amount_base), cur)}</TableCell>
                        <TableCell className="text-xs">{inv.period_start}</TableCell>
                        <TableCell className="text-xs">{inv.uploaded_at}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
