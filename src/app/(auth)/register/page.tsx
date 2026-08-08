"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

import S from "./styles.module.scss";

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/** Built inside the component so the regex error message is localized. */
function buildRegisterSchema(t: TranslateFn) {
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
    tenant_name: z.string().min(1).max(256),
    timezone: z.string().min(1),
    base_currency: z.string().length(3).toUpperCase(),
  });
}

type RegisterValues = {
  email: string;
  password: string;
  display_name: string;
  tenant_name: string;
  timezone: string;
  base_currency: string;
};

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register } = useAuth();

  const schema = useMemo(() => buildRegisterSchema(t), [t]);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      display_name: "",
      tenant_name: "",
      timezone: "UTC",
      base_currency: "USD",
    },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await register(values);
      toast.success(t("auth.registerSuccess"));
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    }
  }

  return (
    <AuthLayout>
      <div className={S.register}>
        <div className={S.register__header}>
          <Eyebrow>{t("auth.registerDescription")}</Eyebrow>
          <h1 className={S.register__title}>{t("auth.registerTitle")}</h1>
          <p className={S.register__subtitle}>
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className={S.register__link}>
              {t("auth.signIn")}
            </Link>
          </p>
        </div>

        <form className={S.register__form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
            id="password"
            label={t("auth.password")}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <p className={S.register__hint}>{t("auth.passwordHint")}</p>
          <Input
            id="display_name"
            label={t("auth.displayName")}
            autoComplete="name"
            error={form.formState.errors.display_name?.message}
            {...form.register("display_name")}
          />
          <Input
            id="tenant_name"
            label={t("auth.tenantName")}
            error={form.formState.errors.tenant_name?.message}
            {...form.register("tenant_name")}
          />
          <div className={S.register__row}>
            <Input
              id="timezone"
              label={t("auth.timezone")}
              error={form.formState.errors.timezone?.message}
              {...form.register("timezone")}
            />
            <Input
              id="base_currency"
              label={t("auth.baseCurrency")}
              maxLength={3}
              error={form.formState.errors.base_currency?.message}
              {...form.register("base_currency")}
            />
          </div>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t("auth.registerSubmit")}
          </Button>
        </form>

        <Link href="/" className={S.register__back}>
          <span className={S.register__back__arrow}>←</span>
          {t("common.back")}
        </Link>
      </div>
    </AuthLayout>
  );
}
