"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      await login(values.email, values.password);
      toast.success(t("auth.loginSuccess"));
      router.push("/app");
    } catch (error) {
      toast.error(getErrorDetail(error));
    }
  }

  return (
    <AuthLayout>
      <div className={S.login}>
        <div className={S.login__header}>
          <Eyebrow>{t("auth.loginEyebrow")}</Eyebrow>
          <h1 className={S.login__title}>{t("auth.loginTitle")}</h1>
          <p className={S.login__subtitle}>
            {t("auth.noAccount")}{" "}
            <Link href="/register" className={S.login__link}>
              {t("auth.signUp")}
            </Link>
          </p>
        </div>

        <form className={S.login__form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
            autoComplete="current-password"
            placeholder="••••••••"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <Link href="/forgot-password" className={S.login__forgot}>
            {t("auth.forgotPassword")}
          </Link>

          <Button type="submit" loading={form.formState.isSubmitting}>
            {t("auth.loginSubmit")}
          </Button>
        </form>

        <div className={S.login__divider}>
          <span>{t("auth.orContinueWith")}</span>
        </div>

        <Button variant="ghost" type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.705A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {t("auth.continueWithGoogle")}
        </Button>

        <Link href="/" className={S.login__back}>
          <span className={S.login__back__arrow}>←</span>
          {t("common.back")}
        </Link>
      </div>
    </AuthLayout>
  );
}
