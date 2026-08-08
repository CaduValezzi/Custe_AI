"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Eyebrow } from "@/components/atoms/eyebrow";
import { AuthLayout } from "@/components/templates/authlayout";

import S from "./styles.module.scss";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <div className={S.forgot}>
        <div className={S.forgot__header}>
          <Eyebrow>{t("app.name")}</Eyebrow>
          <h1 className={S.forgot__title}>{t("auth.forgotTitle")}</h1>
        </div>

        <p className={S.forgot__description}>{t("auth.forgotDescription")}</p>

        <Link href="/login" className={S.forgot__back}>
          <span className={S.forgot__back__arrow}>←</span>
          {t("auth.backToLogin")}
        </Link>
      </div>
    </AuthLayout>
  );
}
