"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { useTranslation } from "react-i18next";
import S from "./styles.module.scss"

export const PriceCard = () => {
    const { t } = useTranslation();
    return (
        <div className={S.price__card}>
        <div className={S.plan__name}>{t("landing.plans.card.name")}</div>
        <div className={S.plan__price}>{t("landing.plans.card.price")}</div>
        <div className={S.plan__period}>{t("landing.plans.card.period")}</div>
        <div className={S.plan__divider}></div>
        <ul className={S.plan__features}>
            <li><div className={S.check}>&#10003;</div>{t("landing.plans.card.feature1")}</li>
            <li><div className={S.check}>&#10003;</div>{t("landing.plans.card.feature2")}</li>
            <li><div className={S.check}>&#10003;</div>{t("landing.plans.card.feature3")}</li>
            <li><div className={S.check}>&#10003;</div>{t("landing.plans.card.feature4")}</li>
        </ul>
        <Button variant="ghost" asChild>
          <Link href="/register">{t("landing.plans.card.cta")}</Link>
        </Button>
        </div>
    )
}