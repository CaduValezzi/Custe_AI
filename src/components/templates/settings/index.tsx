"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { apiClient, configureApiClient, getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { PageHeader } from "@/components/atoms/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setStoredLocale } from "@/i18n";
import { useAuth } from "@/providers";

const OPS_SECRET_STORAGE_KEY = "acs_ops_secret";

/**
 * `/app/settings` — workspace identity, language switch, and advanced ops
 * controls. The ops routes are guarded by `X-Ops-Secret` (injected by
 * `api/client.ts`); the secret lives in sessionStorage for the browser session
 * only. Port of mock `settings-page.tsx`, restyled on brand tokens.
 */
export const SettingsTemplate = () => {
  const { t, i18n: lng } = useTranslation();
  const { user, logout } = useAuth();
  const tenantId = user?.tenant_id;
  const qc = useQueryClient();

  const [opsInput, setOpsInput] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(OPS_SECRET_STORAGE_KEY) ?? "";
  });
  const [rollupMonth, setRollupMonth] = useState("");

  // Make the client read the ops secret live from sessionStorage so the
  // Save/Clear buttons only have to write/remove the item.
  useEffect(() => {
    configureApiClient({ getOpsSecret: () => window.sessionStorage.getItem(OPS_SECRET_STORAGE_KEY) });
  }, []);

  const saveOpsSecret = () => {
    window.sessionStorage.setItem(OPS_SECRET_STORAGE_KEY, opsInput.trim());
    toast.success(t("settings.saveOps"));
  };

  const clearOpsSecret = () => {
    window.sessionStorage.removeItem(OPS_SECRET_STORAGE_KEY);
    setOpsInput("");
    toast.success(t("settings.clearOps"));
  };

  const rollup = useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST("/api/v1/ops/rollup", {
        params: { query: rollupMonth.trim() ? { month_key: rollupMonth.trim() } : {} },
      });
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
    onSuccess: (data) => {
      toast.success(data != null ? JSON.stringify(data) : "OK");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const alerts = useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST("/api/v1/ops/alerts-scan", {});
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
    onSuccess: (data) => {
      toast.success(data != null ? JSON.stringify(data) : "OK");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const globalRollup = useMutation({
    mutationFn: async () => {
      const { data, error } = await apiClient.POST("/api/v1/ops/global-rollups", {});
      if (error) throw new Error(getErrorDetail(error));
      return data;
    },
    onSuccess: (data) => {
      toast.success(data != null ? JSON.stringify(data) : "OK");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!tenantId) return null;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageHeader title={t("settings.title")} />

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.tenantSection")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("settings.currentTenant")}</Label>
            <p className="mt-1 font-mono text-sm">{tenantId}</p>
          </div>
          <Button variant="danger" fullWidth={false} onClick={() => void logout()}>
            {t("nav.logout")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.locale")}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant={lng.language === "en" ? "primary" : "outline"}
            fullWidth={false}
            onClick={() => {
              setStoredLocale("en");
              void lng.changeLanguage("en");
            }}
          >
            English
          </Button>
          <Button
            variant={lng.language === "pt-BR" ? "primary" : "outline"}
            fullWidth={false}
            onClick={() => {
              setStoredLocale("pt-BR");
              void lng.changeLanguage("pt-BR");
            }}
          >
            Português (BR)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("settings.opsSection")}</CardTitle>
          <CardDescription>{t("settings.opsDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.opsSecret")}</Label>
            <Input
              id="ops"
              type="password"
              autoComplete="off"
              value={opsInput}
              onChange={(e) => setOpsInput(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" fullWidth={false} onClick={saveOpsSecret}>
              {t("settings.saveOps")}
            </Button>
            <Button type="button" variant="outline" fullWidth={false} onClick={clearOpsSecret}>
              {t("settings.clearOps")}
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>{t("settings.opsMonth")}</Label>
            <Input id="mkey" placeholder="yyyy-mm" value={rollupMonth} onChange={(e) => setRollupMonth(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" fullWidth={false} disabled={rollup.isPending} onClick={() => rollup.mutate()}>
              {t("settings.rollup")}
            </Button>
            <Button type="button" variant="secondary" fullWidth={false} disabled={alerts.isPending} onClick={() => alerts.mutate()}>
              {t("settings.alertsScan")}
            </Button>
            <Button type="button" variant="outline" fullWidth={false} disabled={globalRollup.isPending} onClick={() => globalRollup.mutate()}>
              {t("settings.globalRollup")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
