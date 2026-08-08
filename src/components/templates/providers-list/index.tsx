"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient, getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { PageHeader } from "@/components/atoms/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatMoneyAmount, parseDecimalString } from "@/lib/money";
import { useAuth } from "@/providers";

const providerSchema = z.object({
  display_name: z.string().min(1),
  provider_kind: z.enum(["openai", "cursor", "aws", "stripe", "generic"]),
  billing_type: z.enum(["prepaid", "postpaid"]),
  access_key: z.string().min(1),
  monthly_budget_limit_base: z.string().optional(),
  prepaid_balance_base: z.string().optional(),
  base_url_health: z.string().optional(),
  webhook_secret: z.string().optional(),
  metadata_json: z.string().optional(),
  default_tags_json: z.string().optional(),
});

type ProviderForm = z.infer<typeof providerSchema>;

/**
 * `/app/providers` — provider registry list with a create dialog. Tenant
 * identity is resolved server-side, so the list and whoami calls take no query
 * params. Port of mock `providers-list-page.tsx`, restyled on brand tokens
 * (B1) with the /frontend atoms (`Button`, `Input`, `PageHeader`) replacing
 * the mock's ui/* equivalents.
 */
export const ProvidersListTemplate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const tenantId = user?.tenant_id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const whoami = useQuery({
    queryKey: ["whoami", tenantId!],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/tenants/whoami");
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

  const baseCurrency = whoami.data?.base_currency ?? "USD";

  const providers = useQuery({
    queryKey: ["providers", tenantId!],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/providers");
      if (error) throw new Error(getErrorDetail(error));
      return data ?? [];
    },
  });

  const form = useForm<ProviderForm>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      display_name: "",
      provider_kind: "generic",
      billing_type: "postpaid",
      access_key: "",
      monthly_budget_limit_base: "",
      prepaid_balance_base: "",
      base_url_health: "",
      webhook_secret: "",
      metadata_json: "",
      default_tags_json: "",
    },
  });

  async function onSubmit(values: ProviderForm) {
    let metadata: Record<string, unknown> | undefined;
    if (values.metadata_json?.trim()) {
      try {
        metadata = JSON.parse(values.metadata_json) as Record<string, unknown>;
      } catch {
        toast.error("Invalid JSON in metadata");
        return;
      }
    }
    let defaultTags: Record<string, string> | undefined;
    if (values.default_tags_json?.trim()) {
      try {
        defaultTags = JSON.parse(values.default_tags_json) as Record<string, string>;
      } catch {
        toast.error("Invalid JSON in default tags");
        return;
      }
    }
    const body = {
      display_name: values.display_name.trim(),
      provider_kind: values.provider_kind,
      billing_type: values.billing_type,
      access_key: values.access_key,
      base_url_health: values.base_url_health?.trim() || null,
      webhook_secret: values.webhook_secret?.trim() || null,
      metadata: metadata ?? null,
      default_tags: defaultTags ?? null,
      monthly_budget_limit_base: values.monthly_budget_limit_base?.trim() || null,
      prepaid_balance_base: values.prepaid_balance_base?.trim() || null,
      credential_key_id: null,
      is_polling_enabled: true,
    };
    const { error, response } = await apiClient.POST("/api/v1/providers", { body });
    if (response.status === 404) {
      toast.error("Tenant missing — register workspace first.");
      return;
    }
    if (error) {
      toast.error(getErrorDetail(error));
      return;
    }
    toast.success("Provider created");
    setOpen(false);
    form.reset();
    void qc.invalidateQueries({ queryKey: ["providers", tenantId] });
    void qc.invalidateQueries({ queryKey: ["whoami", tenantId] });
  }

  if (!tenantId) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title={t("providers.title")} />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button fullWidth={false}>
              <Plus className="h-4 w-4" />
              {t("providers.add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("providers.newTitle")}</DialogTitle>
              <DialogDescription>{t("providers.accessKeyHint")}</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label>{t("providers.displayName")}</Label>
                <Input {...form.register("display_name")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("providers.providerKind")}</Label>
                  <Select
                    value={form.watch("provider_kind")}
                    onValueChange={(v) => form.setValue("provider_kind", v as ProviderForm["provider_kind"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["openai", "cursor", "aws", "stripe", "generic"] as const).map((k) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.billingType")}</Label>
                  <Select
                    value={form.watch("billing_type")}
                    onValueChange={(v) => form.setValue("billing_type", v as ProviderForm["billing_type"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prepaid">prepaid</SelectItem>
                      <SelectItem value="postpaid">postpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("providers.accessKey")}</Label>
                <Input type="password" autoComplete="new-password" {...form.register("access_key")} />
              </div>
              <div className="space-y-2">
                <Label>{t("providers.webhookSecret")}</Label>
                <Input type="password" {...form.register("webhook_secret")} />
              </div>
              <div className="space-y-2">
                <Label>{t("providers.healthUrl")}</Label>
                <Input {...form.register("base_url_health")} placeholder="https://..." />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("providers.monthlyLimit")}</Label>
                  <Input {...form.register("monthly_budget_limit_base")} />
                </div>
                <div className="space-y-2">
                  <Label>{t("providers.prepaidBalance")}</Label>
                  <Input {...form.register("prepaid_balance_base")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("providers.metadataJson")}</Label>
                <Textarea rows={3} {...form.register("metadata_json")} placeholder='{"team":"alpha"}' />
              </div>
              <div className="space-y-2">
                <Label>{t("providers.defaultTagsJson")}</Label>
                <Textarea rows={2} {...form.register("default_tags_json")} placeholder='{"team":"ml-ops","env":"production"}' />
              </div>
              <Button type="submit" className="w-full">
                {t("providers.submit")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("providers.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {providers.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
          {!providers.isLoading && providers.data?.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("providers.empty")}</p>
          )}
          {providers.data && providers.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("providers.table.name")}</TableHead>
                  <TableHead>{t("providers.table.kind")}</TableHead>
                  <TableHead>{t("providers.table.billing")}</TableHead>
                  <TableHead>{t("providers.table.budget")}</TableHead>
                  <TableHead className="text-right">{t("providers.detail")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.data.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.display_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.provider_kind}</Badge>
                    </TableCell>
                    <TableCell>{p.billing_type}</TableCell>
                    <TableCell className="text-xs">
                      {p.monthly_budget_limit_base != null
                        ? formatMoneyAmount(parseDecimalString(p.monthly_budget_limit_base), baseCurrency)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" fullWidth={false} asChild>
                        <Link href={`/app/providers/${p.id}`}>{t("providers.detail")}</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
