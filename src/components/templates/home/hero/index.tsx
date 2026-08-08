"use client";

import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import { Demodash } from "@/components/molecules/demodash";
import { Section } from "@/components/organisms/section";
import S from "./styles.module.scss"

export const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <>
      <Section className={S.hero__container} id="hero">
          <div className={S.hero__badge}>
              <span className={S.hero__badge__dot}></span>
              {t("landing.hero.badge")}
            </div>
          <div className={S.hero__content}>


            <div className={S.hero__info}>
              <h1 className={S.hero__headline}>
                <Trans
                  i18nKey="landing.hero.headline"
                  components={{
                    br: <br />,
                    span: <span className={S.hero__headline__span} />,
                  }}
                />
              </h1>

              <p className={S.hero__description}>
                {t("landing.hero.description")}
              </p>

              <div className={S.hero__actions}>
                <Link href="/register" className={S.hero__actions__especial}>{t("landing.hero.ctaPrimary")}</Link>
                <Link href="/login" className={S.hero__actions__ghost} >{t("landing.hero.ctaSecondary")}</Link>
              </div>
            </div>
          </div>
          <Demodash />
      </Section>
    </>
  )
};