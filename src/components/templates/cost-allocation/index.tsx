"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { apiClient, getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { PageHeader } from "@/components/atoms/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoneyAmount, parseDecimalString } from "@/lib/money";
import { useAuth } from "@/providers";

/**
 * `/app/cost-allocation` — cross-tabulated spend by tag dimension across
 * providers. The report is generated on demand (requires at least one tag key)
 * and rendered as a pivot table with KPI cards.
 * Port of mock `cost-allocation-page.tsx`, restyled on brand tokens.
 */
export const CostAllocationTemplate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const tenantId = user?.tenant_id;

  const [month, setMonth] = useState("");
  const [tagKeysInput, setTagKeysInput] = useState("");
  const [submittedTagKeys, setSubmittedTagKeys] = useState("");
  const [submittedMonth, setSubmittedMonth] = useState("");

  const providersList = useQuery({
    queryKey: ["providers", tenantId!],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/providers");
      if (error) throw new Error(getErrorDetail(error));
      return data ?? [];
    },
  });

  const providerNameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of providersList.data ?? []) {
      m.set(p.id, p.display_name);
    }
    return m;
  }, [providersList.data]);

  const report = useQuery({
    queryKey: ["cost-allocation", tenantId!, submittedMonth || undefined, submittedTagKeys || undefined],
    enabled: Boolean(tenantId) && Boolean(submittedTagKeys),
    queryFn: async () => {
      // `tag_keys` is a required query field on this endpoint, so build the
      // params inline (the loose `tenantQuery` helper can't satisfy it). The
      // tenant is resolved server-side from the `X-Tenant-Id` header.
      const { data, error } = await apiClient.GET("/api/v1/analytics/cost-allocation", {
        params: {
          query: {
            tag_keys: submittedTagKeys,
            ...(submittedMonth ? { month: submittedMonth } : {}),
          },
        },
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

  const allProviderIds = useMemo(() => {
    if (!report.data?.rows) return [];
    const ids = new Set<string>();
    for (const row of report.data.rows) {
      for (const pid of Object.keys(row.provider_breakdown)) {
        ids.add(pid);
      }
    }
    return Array.from(ids);
  }, [report.data]);

  const uniqueTagKeys = useMemo(() => {
    if (!report.data?.rows) return new Set<string>();
    return new Set(report.data.rows.map((r) => r.tag_key));
  }, [report.data]);

  const handleGenerate = () => {
    if (!tagKeysInput.trim()) return;
    setSubmittedTagKeys(tagKeysInput.trim());
    setSubmittedMonth(month.trim());
  };

  if (!tenantId) return null;

  const baseCurrency = report.data?.base_currency ?? "USD";

  return (
    <div className="space-y-8">
      <PageHeader title={t("allocation.title")} subtitle={t("allocation.subtitle")} />

      {/* Report controls */}
      <div className="grid max-w-xl gap-4 sm:grid-cols-3">
        <Input
          id="allocMonth"
          label={t("dashboard.month")}
          placeholder={t("dashboard.monthPlaceholder")}
          value={month}
          onChange={(e) => setMonth(e.target.value.trim())}
        />
        <div className="flex flex-col gap-2 sm:col-span-2">
          <div className="flex gap-2">
            <Input
              id="tagKeys"
              label={t("allocation.tagKeys")}
              placeholder={t("allocation.tagKeysPlaceholder")}
              value={tagKeysInput}
              onChange={(e) => setTagKeysInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button
              className="mt-6"
              onClick={handleGenerate}
              disabled={!tagKeysInput.trim()}
            >
              {t("allocation.generate")}
            </Button>
          </div>
        </div>
      </div>

      {report.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}

      {report.data && (
        <>
          {/* KPI cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="transition-all duration-200 hover:border-violet/30 hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardDescription>{t("allocation.grandTotal")}</CardDescription>
                <CardTitle className="font-mono text-xl">
                  {formatMoneyAmount(parseDecimalString(report.data.grand_total_base), baseCurrency)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="transition-all duration-200 hover:border-cyan/30 hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardDescription>{t("allocation.tagKeysAnalyzed")}</CardDescription>
                <CardTitle className="font-mono text-xl">{uniqueTagKeys.size}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="transition-all duration-200 hover:border-cyan/30 hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <CardDescription>{t("allocation.rowCount")}</CardDescription>
                <CardTitle className="font-mono text-xl">{report.data.rows.length}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {report.data.rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("allocation.empty")}</p>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{report.data.month_key}</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Key</TableHead>
                      <TableHead>Tag Value</TableHead>
                      {allProviderIds.map((pid) => (
                        <TableHead key={pid} className="text-right">
                          {providerNameMap.get(pid) ?? pid}
                        </TableHead>
                      ))}
                      <TableHead className="text-right font-semibold">{t("allocation.total")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.rows.map((row, i) => (
                      <TableRow key={`${row.tag_key}-${row.tag_value}-${i}`}>
                        <TableCell className="font-mono text-xs">{row.tag_key}</TableCell>
                        <TableCell className="font-mono text-xs">{row.tag_value}</TableCell>
                        {allProviderIds.map((pid) => (
                          <TableCell key={pid} className="text-right font-mono text-xs">
                            {row.provider_breakdown[pid]
                              ? formatMoneyAmount(parseDecimalString(row.provider_breakdown[pid]), baseCurrency)
                              : "—"}
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-mono text-sm font-medium">
                          {formatMoneyAmount(parseDecimalString(row.total_base), baseCurrency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!report.data && !report.isLoading && (
        <p className="text-sm text-muted-foreground">{t("allocation.empty")}</p>
      )}
    </div>
  );
};
