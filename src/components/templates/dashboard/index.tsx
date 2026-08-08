"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { apiClient, getErrorDetail } from "@/api/client";
import { tenantQuery } from "@/api/tenant-query";
import { Input } from "@/components/atoms/input";
import { PageHeader } from "@/components/atoms/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatGrowthFraction, formatMoneyAmount, parseDecimalString } from "@/lib/money";
import { useAuth } from "@/providers";

import S from "./styles.module.scss";

const PIE_COLORS = ["#5028F0", "#1464C8", "#00B4A0", "#a78bfa", "#60a5fa", "#5eead4"];

/** Shared Recharts tooltip chrome, matched to the brand surfaces. */
const TOOLTIP_STYLE = {
  backgroundColor: "#001428",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
};

const renderPieLabel = ({ name, percent }: { name?: string | number; percent?: number }) =>
  `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`;

/**
 * `/app` dashboard — KPI cards, per-provider / per-tag breakdowns, spend-over-time
 * line, provider & tag pies, and the month-end projection card.
 * Port of mock `dashboard-page.tsx`, restyled on brand tokens (B1) with the
 * /frontend atoms (`Input`, `PageHeader`) replacing the mock's ui/* equivalents.
 */
export const DashboardTemplate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const tenantId = user?.tenant_id;

  const [month, setMonth] = useState("");
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [groupByTag, setGroupByTag] = useState("");

  const overview = useQuery({
    queryKey: ["overview", tenantId!, month || undefined, tagKey || undefined, tagValue || undefined],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/analytics/overview", {
        params: tenantQuery(tenantId!, { month: month || null, tag_key: tagKey || null, tag_value: tagValue || null }),
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

  const charts = useQuery({
    queryKey: ["charts", tenantId!, month || undefined, tagKey || undefined, tagValue || undefined, groupByTag || undefined],
    enabled: Boolean(tenantId),
    queryFn: async () => {
      const { data, error } = await apiClient.GET("/api/v1/analytics/charts", {
        params: tenantQuery(tenantId!, {
          month: month || null,
          tag_key: tagKey || null,
          tag_value: tagValue || null,
          group_by_tag: groupByTag || null,
        }),
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
  });

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

  const pieData = useMemo(() => {
    const slices = charts.data?.charts.pie_slices ?? [];
    return slices.map((s, i) => ({
      name: providerNameMap.get(s.provider_id) ?? s.provider_id,
      value: Number(parseDecimalString(s.spent_base)),
      id: s.provider_id,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [charts.data, providerNameMap]);

  const tagPieData = useMemo(() => {
    const slices = charts.data?.charts.tag_pie_slices ?? [];
    return slices.map((s, i) => ({
      name: `${s.tag_value}`,
      value: Number(parseDecimalString(s.spent_base)),
      id: `${s.tag_key}-${s.tag_value}`,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [charts.data]);

  const lineData = useMemo(() => {
    const pts = charts.data?.charts.mtd_timeline_points ?? [];
    return pts.map((p) => ({
      day: p.iso_day_label,
      cumulative: Number(parseDecimalString(p.cumulative_spent_base)),
    }));
  }, [charts.data]);

  const projection = charts.data?.dashed_projection_point;

  if (!tenantId) return null;

  return (
    <div className="space-y-8">
      <PageHeader title={t("dashboard.title")} subtitle={overview.data?.month_key} />

      {/* Filters */}
      <div className="grid max-w-2xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          id="month"
          label={t("dashboard.month")}
          placeholder={t("dashboard.monthPlaceholder")}
          value={month}
          onChange={(e) => setMonth(e.target.value.trim())}
        />
        <Input
          id="tagKey"
          label={t("dashboard.tagFilterKey")}
          placeholder="e.g. team"
          value={tagKey}
          onChange={(e) => setTagKey(e.target.value.trim())}
        />
        <Input
          id="tagValue"
          label={t("dashboard.tagFilterValue")}
          placeholder="e.g. ml-ops"
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value.trim())}
        />
        <Input
          id="groupByTag"
          label={t("dashboard.groupByTag")}
          placeholder="e.g. team"
          value={groupByTag}
          onChange={(e) => setGroupByTag(e.target.value.trim())}
        />
      </div>

      {overview.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}

      {/* KPI cards */}
      {overview.data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-all duration-200 hover:border-violet/30 hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.currentTotal")}</CardDescription>
              <CardTitle className="font-mono text-xl">
                {formatMoneyAmount(parseDecimalString(overview.data.current_month_total_base), overview.data.base_currency)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all duration-200 hover:border-violet/30 hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.previousTotal")}</CardDescription>
              <CardTitle className="font-mono text-xl">
                {formatMoneyAmount(parseDecimalString(overview.data.previous_month_total_base), overview.data.base_currency)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all duration-200 hover:border-cyan/30 hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.growth")}</CardDescription>
              <CardTitle className="font-mono text-xl">
                {formatGrowthFraction(parseDecimalString(overview.data.growth_pct))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all duration-200 hover:border-cyan/30 hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <CardDescription>{t("dashboard.baseCurrency")}</CardDescription>
              <CardTitle className="text-xl">{overview.data.base_currency}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Spend by provider */}
      {overview.data && (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.breakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(overview.data.breakdown_by_provider_base).map(([pid, amt], i) => (
                <li
                  key={pid}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="font-mono text-xs text-muted-foreground">{pid}</span>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    {formatMoneyAmount(parseDecimalString(amt), overview.data.base_currency)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Spend by tag */}
      {overview.data?.breakdown_by_tag && Object.keys(overview.data.breakdown_by_tag).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.tagBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(overview.data.breakdown_by_tag).map(([tKey, values]) => (
              <div key={tKey} className="mb-4 last:mb-0">
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">{tKey}</h4>
                <ul className="space-y-2">
                  {Object.entries(values).map(([tVal, amt], i) => (
                    <li
                      key={tVal}
                      className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="font-mono text-xs">{tVal}</span>
                      </div>
                      <span className="font-mono text-sm font-medium">
                        {formatMoneyAmount(parseDecimalString(amt), overview.data.base_currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-bold">{t("dashboard.chartsTitle")}</h2>
        {charts.isLoading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
        {charts.data && pieData.length === 0 && lineData.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("dashboard.noChartData")}</p>
        )}
        <div className="grid gap-6 lg:grid-cols-2">
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.pieTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={renderPieLabel}>
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {tagPieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("dashboard.tagPieTitle")}
                  {groupByTag ? `: ${groupByTag}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tagPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={renderPieLabel}>
                      {tagPieData.map((entry) => (
                        <Cell key={`cell-tag-${entry.id}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {lineData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.lineTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#6B82A8" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#6B82A8" }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line type="monotone" dataKey="cumulative" stroke="#00B4A0" strokeWidth={2} dot={false} name="MTD" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Projection */}
        {projection && (
          <Card className="mt-6 border-violet/20">
            <CardHeader>
              <CardTitle>{t("dashboard.projection")}</CardTitle>
              {projection.model_note && <CardDescription>{projection.model_note}</CardDescription>}
            </CardHeader>
            <CardContent>
              <p className={`font-mono text-2xl font-bold ${S.gradientText}`}>
                {projection.predicted_end_of_month_total != null
                  ? formatMoneyAmount(parseDecimalString(projection.predicted_end_of_month_total), overview.data?.base_currency ?? "USD")
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t("dashboard.projectionNote")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
