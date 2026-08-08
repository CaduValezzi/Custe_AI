"use client";

import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  FilePlus,
  Key,
  LayoutDashboard,
  PieChart,
  RefreshCw,
  Rocket,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  Tag,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/atoms/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import S from "./styles.module.scss";

interface Step {
  title: string;
  description: string;
}

interface GuideSection {
  id: string;
  icon: LucideIcon;
  color: string;
  titleKey: string;
  subtitleKey: string;
  steps: Step[];
}

function SectionCard({ section }: { section: GuideSection }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const Icon = section.icon;

  return (
    <Card className="group flex flex-col transition-all duration-200 hover:border-violet/30 hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm", section.color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base font-semibold leading-tight">{t(section.titleKey)}</CardTitle>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{t(section.subtitleKey)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {t("guide.showSteps")} ({section.steps.length})
        </button>

        {open && (
          <ol className="mt-3 space-y-3">
            {section.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${S.gradientBg}`}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium leading-snug">{step.title}</p>
                  {step.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * `/app/guide` — static in-app documentation. Port of mock `guide-page.tsx`
 * (16 collapsible sections keyed on the `guide.*` i18n namespace), restyled
 * on brand tokens. The mock's `gradient-bg` / `gradient-text` utility classes
 * are replaced by the SCSS-module `gradientBg` / `gradientText` classes.
 */
export const GuideTemplate = () => {
  const { t } = useTranslation();

  const sections: GuideSection[] = [
    {
      id: "getting-started",
      icon: Rocket,
      color: S.gradientBg,
      titleKey: "guide.gettingStarted.title",
      subtitleKey: "guide.gettingStarted.subtitle",
      steps: [
        { title: t("guide.gettingStarted.step1.title"), description: t("guide.gettingStarted.step1.desc") },
        { title: t("guide.gettingStarted.step2.title"), description: t("guide.gettingStarted.step2.desc") },
        { title: t("guide.gettingStarted.step3.title"), description: t("guide.gettingStarted.step3.desc") },
        { title: t("guide.gettingStarted.step4.title"), description: t("guide.gettingStarted.step4.desc") },
      ],
    },
    {
      id: "dashboard",
      icon: LayoutDashboard,
      color: "bg-blue-600",
      titleKey: "guide.dashboard.title",
      subtitleKey: "guide.dashboard.subtitle",
      steps: [
        { title: t("guide.dashboard.step1.title"), description: t("guide.dashboard.step1.desc") },
        { title: t("guide.dashboard.step2.title"), description: t("guide.dashboard.step2.desc") },
        { title: t("guide.dashboard.step3.title"), description: t("guide.dashboard.step3.desc") },
        { title: t("guide.dashboard.step4.title"), description: t("guide.dashboard.step4.desc") },
        { title: t("guide.dashboard.step5.title"), description: t("guide.dashboard.step5.desc") },
      ],
    },
    {
      id: "providers",
      icon: Server,
      color: "bg-violet-600",
      titleKey: "guide.providers.title",
      subtitleKey: "guide.providers.subtitle",
      steps: [
        { title: t("guide.providers.step1.title"), description: t("guide.providers.step1.desc") },
        { title: t("guide.providers.step2.title"), description: t("guide.providers.step2.desc") },
        { title: t("guide.providers.step3.title"), description: t("guide.providers.step3.desc") },
        { title: t("guide.providers.step4.title"), description: t("guide.providers.step4.desc") },
        { title: t("guide.providers.step5.title"), description: t("guide.providers.step5.desc") },
        { title: t("guide.providers.step6.title"), description: t("guide.providers.step6.desc") },
      ],
    },
    {
      id: "polling",
      icon: RefreshCw,
      color: "bg-cyan-600",
      titleKey: "guide.polling.title",
      subtitleKey: "guide.polling.subtitle",
      steps: [
        { title: t("guide.polling.step1.title"), description: t("guide.polling.step1.desc") },
        { title: t("guide.polling.step2.title"), description: t("guide.polling.step2.desc") },
        { title: t("guide.polling.step3.title"), description: t("guide.polling.step3.desc") },
        { title: t("guide.polling.step4.title"), description: t("guide.polling.step4.desc") },
      ],
    },
    {
      id: "webhooks",
      icon: Webhook,
      color: "bg-orange-600",
      titleKey: "guide.webhooks.title",
      subtitleKey: "guide.webhooks.subtitle",
      steps: [
        { title: t("guide.webhooks.step1.title"), description: t("guide.webhooks.step1.desc") },
        { title: t("guide.webhooks.step2.title"), description: t("guide.webhooks.step2.desc") },
        { title: t("guide.webhooks.step3.title"), description: t("guide.webhooks.step3.desc") },
      ],
    },
    {
      id: "manual-costs",
      icon: FilePlus,
      color: "bg-teal-600",
      titleKey: "guide.manualCosts.title",
      subtitleKey: "guide.manualCosts.subtitle",
      steps: [
        { title: t("guide.manualCosts.step1.title"), description: t("guide.manualCosts.step1.desc") },
        { title: t("guide.manualCosts.step2.title"), description: t("guide.manualCosts.step2.desc") },
        { title: t("guide.manualCosts.step3.title"), description: t("guide.manualCosts.step3.desc") },
      ],
    },
    {
      id: "cost-allocation",
      icon: PieChart,
      color: "bg-pink-600",
      titleKey: "guide.costAllocation.title",
      subtitleKey: "guide.costAllocation.subtitle",
      steps: [
        { title: t("guide.costAllocation.step1.title"), description: t("guide.costAllocation.step1.desc") },
        { title: t("guide.costAllocation.step2.title"), description: t("guide.costAllocation.step2.desc") },
        { title: t("guide.costAllocation.step3.title"), description: t("guide.costAllocation.step3.desc") },
        { title: t("guide.costAllocation.step4.title"), description: t("guide.costAllocation.step4.desc") },
      ],
    },
    {
      id: "tags",
      icon: Tag,
      color: "bg-amber-600",
      titleKey: "guide.tags.title",
      subtitleKey: "guide.tags.subtitle",
      steps: [
        { title: t("guide.tags.step1.title"), description: t("guide.tags.step1.desc") },
        { title: t("guide.tags.step2.title"), description: t("guide.tags.step2.desc") },
        { title: t("guide.tags.step3.title"), description: t("guide.tags.step3.desc") },
        { title: t("guide.tags.step4.title"), description: t("guide.tags.step4.desc") },
      ],
    },
    {
      id: "budgets",
      icon: Bell,
      color: "bg-red-600",
      titleKey: "guide.budgets.title",
      subtitleKey: "guide.budgets.subtitle",
      steps: [
        { title: t("guide.budgets.step1.title"), description: t("guide.budgets.step1.desc") },
        { title: t("guide.budgets.step2.title"), description: t("guide.budgets.step2.desc") },
        { title: t("guide.budgets.step3.title"), description: t("guide.budgets.step3.desc") },
      ],
    },
    {
      id: "analytics",
      icon: BarChart3,
      color: "bg-indigo-600",
      titleKey: "guide.analytics.title",
      subtitleKey: "guide.analytics.subtitle",
      steps: [
        { title: t("guide.analytics.step1.title"), description: t("guide.analytics.step1.desc") },
        { title: t("guide.analytics.step2.title"), description: t("guide.analytics.step2.desc") },
        { title: t("guide.analytics.step3.title"), description: t("guide.analytics.step3.desc") },
      ],
    },
    {
      id: "settings",
      icon: Settings,
      color: "bg-slate-600",
      titleKey: "guide.settings.title",
      subtitleKey: "guide.settings.subtitle",
      steps: [
        { title: t("guide.settings.step1.title"), description: t("guide.settings.step1.desc") },
        { title: t("guide.settings.step2.title"), description: t("guide.settings.step2.desc") },
        { title: t("guide.settings.step3.title"), description: t("guide.settings.step3.desc") },
      ],
    },
    {
      id: "users",
      icon: Users,
      color: "bg-green-600",
      titleKey: "guide.users.title",
      subtitleKey: "guide.users.subtitle",
      steps: [
        { title: t("guide.users.step1.title"), description: t("guide.users.step1.desc") },
        { title: t("guide.users.step2.title"), description: t("guide.users.step2.desc") },
        { title: t("guide.users.step3.title"), description: t("guide.users.step3.desc") },
        { title: t("guide.users.step4.title"), description: t("guide.users.step4.desc") },
      ],
    },
    {
      id: "workspaces",
      icon: Building2,
      color: "bg-sky-600",
      titleKey: "guide.workspaces.title",
      subtitleKey: "guide.workspaces.subtitle",
      steps: [
        { title: t("guide.workspaces.step1.title"), description: t("guide.workspaces.step1.desc") },
        { title: t("guide.workspaces.step2.title"), description: t("guide.workspaces.step2.desc") },
        { title: t("guide.workspaces.step3.title"), description: t("guide.workspaces.step3.desc") },
      ],
    },
    {
      id: "security",
      icon: ShieldCheck,
      color: "bg-emerald-600",
      titleKey: "guide.security.title",
      subtitleKey: "guide.security.subtitle",
      steps: [
        { title: t("guide.security.step1.title"), description: t("guide.security.step1.desc") },
        { title: t("guide.security.step2.title"), description: t("guide.security.step2.desc") },
        { title: t("guide.security.step3.title"), description: t("guide.security.step3.desc") },
      ],
    },
    {
      id: "credentials",
      icon: Key,
      color: "bg-yellow-600",
      titleKey: "guide.credentials.title",
      subtitleKey: "guide.credentials.subtitle",
      steps: [
        { title: t("guide.credentials.step1.title"), description: t("guide.credentials.step1.desc") },
        { title: t("guide.credentials.step2.title"), description: t("guide.credentials.step2.desc") },
        { title: t("guide.credentials.step3.title"), description: t("guide.credentials.step3.desc") },
      ],
    },
    {
      id: "changelog",
      icon: ScrollText,
      color: "bg-purple-700",
      titleKey: "guide.changelog.title",
      subtitleKey: "guide.changelog.subtitle",
      steps: [
        { title: t("guide.changelog.step1.title"), description: t("guide.changelog.step1.desc") },
        { title: t("guide.changelog.step2.title"), description: t("guide.changelog.step2.desc") },
      ],
    },
  ];

  const categoryBadges = [
    { label: t("guide.category.gettingStarted"), color: "bg-violet/10 text-violet border-violet/20" },
    { label: t("guide.category.costTracking"), color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { label: t("guide.category.costAnalysis"), color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
    { label: t("guide.category.teamManagement"), color: "bg-green-500/10 text-green-400 border-green-500/20" },
    { label: t("guide.category.security"), color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-violet/20 ${S.gradientBg}`}>
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <PageHeader eyebrow={t("guide.eyebrow")} title={t("guide.title")} subtitle={t("guide.subtitle")} />
        </div>
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap gap-2">
        {categoryBadges.map((b) => (
          <Badge key={b.label} variant="outline" className={cn("text-xs font-medium", b.color)}>
            {b.label}
          </Badge>
        ))}
      </div>

      <Separator />

      {/* Quick-start banner */}
      <div className="rounded-xl border border-violet/20 bg-violet/5 px-5 py-4">
        <p className="text-sm leading-relaxed text-foreground/80">
          <span className={`font-semibold ${S.gradientText}`}>{t("guide.tipLabel")} </span>
          {t("guide.tipText")}
        </p>
      </div>

      {/* Section grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

      {/* Footer note */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 text-center">
        <p className="text-xs text-muted-foreground">{t("guide.footerNote")}</p>
      </div>
    </div>
  );
};
