"use client";

import { Section } from "@/components/organisms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub";
import { Title } from "@/components/atoms/title";
import { PriceCard } from "@/components/molecules/pricecard";
import { useTranslation } from "react-i18next";
import S from "./styles.module.scss"

export const PlansSection = () =>{
    const { t } = useTranslation();
    return(
        <Section className={S.plans__container} id="plans">
            <div className={S.plans__header}>
                <Eyebrow >{t("landing.plans.eyebrow")}</Eyebrow>
                <Title className={S.plans__header__title}>
                    {t("landing.plans.title")}
                </Title>
                <Sub>
                    {t("landing.plans.subtitle")}
                </Sub>
            </div>
            <div className={S.plans__grid}>
                <PriceCard />
                <PriceCard />
                <PriceCard />
            </div>
        </Section>
    )
}