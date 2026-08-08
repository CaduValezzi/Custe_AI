"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { getErrorDetail } from "@/api/client";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Input } from "@/components/atoms/input";
import { AuthLayout } from "@/components/templates/authlayout";
import { useAuth } from "@/providers";

import S from "../styles.module.scss";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Built inside the component so the regex error message is localized. */
function buildAcceptInviteSchema(t: TranslateFn) {
  const hint = t("auth.passwordHint");
  return z.object({
    email: z.email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Za-z]/, hint)
      .regex(/[0-9]/, hint)
      .regex(/[^A-Za-z0-9]/, hint),
    display_name: z.string().min(1).max(128),
  });
}

type AcceptInviteValues = {
  email: string;
  password: string;
  display_name: string;
};

export default function InviteAcceptPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const { acceptInvite } = useAuth();

  const schema = useMemo(() => buildAcceptInviteSchema(t), [t]);

  const form = useForm<AcceptInviteValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", display_name: "" },
  });

  async function onSubmit(values: AcceptInviteValues) {
    if (!token) {
      toast.error(t("auth.invalidInvite"));
      return;
    }
    try {
      await acceptInvite(token, values.email, values.password, values.display_name);
      toast.success(t("auth.inviteAccepted"));
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    }
  }

  return (
    <AuthLayout>
      <div className={S.invite}>
        <div className={S.invite__header}>
          <Eyebrow>{t("app.name")}</Eyebrow>
          <h1 className={S.invite__title}>{t("auth.acceptInviteTitle")}</h1>
          <p className={S.invite__subtitle}>{t("auth.acceptInviteDescription")}</p>
        </div>

        <form className={S.invite__form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Input
            id="email"
            label={t("auth.email")}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <Input
            id="display_name"
            label={t("auth.displayName")}
            autoComplete="name"
            error={form.formState.errors.display_name?.message}
            {...form.register("display_name")}
          />
          <Input
            id="password"
            label={t("auth.password")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <p className={S.invite__hint}>{t("auth.passwordHint")}</p>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t("auth.acceptInviteSubmit")}
          </Button>
        </form>

        <Link href="/login" className={S.invite__back}>
          <span className={S.invite__back__arrow}>←</span>
          {t("auth.signIn")}
        </Link>
      </div>
    </AuthLayout>
  );
}
