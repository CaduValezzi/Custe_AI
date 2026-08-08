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

type JoinValues = {
  email: string;
};

export default function JoinWorkspacePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const { joinWorkspace, user } = useAuth();

  const schema = useMemo(
    () =>
      z.object({
        email: z.email(),
      }),
    [],
  );

  const form = useForm<JoinValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email ?? "" },
  });

  async function onSubmit(values: JoinValues) {
    if (!token) {
      toast.error(t("workspace.invalidToken"));
      return;
    }
    try {
      await joinWorkspace(token, values.email);
      toast.success(t("workspace.joinSuccess"));
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    }
  }

  return (
    <AuthLayout>
      <div className={S.join}>
        <div className={S.join__header}>
          <Eyebrow>{t("app.name")}</Eyebrow>
          <h1 className={S.join__title}>{t("workspace.joinTitle")}</h1>
          <p className={S.join__subtitle}>{t("workspace.joinDescription")}</p>
        </div>

        <form className={S.join__form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <Input
            id="email"
            label={t("auth.email")}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
          <p className={S.join__hint}>{t("workspace.emailMustMatch")}</p>
          <Button type="submit" loading={form.formState.isSubmitting}>
            {t("workspace.joinSubmit")}
          </Button>
        </form>

        <Link href="/login" className={S.join__back}>
          <span className={S.join__back__arrow}>←</span>
          {t("auth.signIn")}
        </Link>
      </div>
    </AuthLayout>
  );
}
