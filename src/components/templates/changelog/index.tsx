"use client";

import { ArrowLeftRight, Plus, ScrollText, ShieldCheck, Trash2, Wrench, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/atoms/page-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { CHANGELOG, type ChangelogTag } from "./changelog-data";
import S from "./styles.module.scss";

const TAG_CONFIG: Record<ChangelogTag, { labelKey: string; className: string; Icon: LucideIcon }> = {
  feature: {
    labelKey: "changelog.tagFeature",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Icon: Plus,
  },
  fix: {
    labelKey: "changelog.tagFix",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Icon: Wrench,
  },
  security: {
    labelKey: "changelog.tagSecurity",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
    Icon: ShieldCheck,
  },
  changed: {
    labelKey: "changelog.tagChanged",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Icon: ArrowLeftRight,
  },
  removed: {
    labelKey: "changelog.tagRemoved",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
    Icon: Trash2,
  },
};

/**
 * `/app/changelog` — static release-history timeline. Port of mock
 * `changelog-page.tsx` + `changelog-data.ts`, restyled on brand tokens.
 * The mock's `gradient-bg` utility class is not present in /frontend; the
 * gradient here comes from the SCSS-module `gradientBg` class (var(--grad)),
 * matching the dashboard/page-header gradient pattern.
 */
export const ChangelogTemplate = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <div className="flex items-center gap-3 pb-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${S.gradientBg}`}>
          <ScrollText className="h-5 w-5" />
        </div>
        <PageHeader title={t("changelog.title")} subtitle={t("changelog.subtitle")} />
      </div>

      <Separator />

      <div className="relative space-y-10 pt-4">
        <div className="absolute left-[7px] top-4 h-full w-px bg-white/[0.07]" />

        {CHANGELOG.map((entry, entryIdx) => (
          <div key={entry.version} className="relative pl-8">
            <div className={`absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full shadow-sm shadow-violet/20 ${S.gradientBg}`} />

            <div className="mb-3 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-lg font-bold">{entry.version}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(`${entry.date}T00:00:00`).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <ul className="space-y-3">
              {entry.items.map((item, itemIdx) => {
                const cfg = TAG_CONFIG[item.tag];
                const Icon = cfg.Icon;
                return (
                  <li key={itemIdx} className="flex items-start gap-3">
                    <Badge variant="outline" className={`mt-0.5 shrink-0 gap-1 py-0.5 text-[11px] font-medium ${cfg.className}`}>
                      <Icon className="h-3 w-3" />
                      {t(cfg.labelKey)}
                    </Badge>
                    <span className="text-sm leading-relaxed text-foreground/90">{item.description}</span>
                  </li>
                );
              })}
            </ul>

            {entryIdx < CHANGELOG.length - 1 && <div className="mt-8" />}
          </div>
        ))}
      </div>
    </div>
  );
};
