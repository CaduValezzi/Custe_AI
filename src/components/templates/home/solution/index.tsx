"use client";

import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import { Features } from "@/components/atoms/featureslist";
import { VisualGraph } from "@/components/molecules/visualgraph";
import { VisualAlerts } from "@/components/molecules/visualalerts";
import { useTranslation } from "react-i18next";
import S from "./styles.module.scss";



export const SolutionSection = () => {
  const { t } = useTranslation();
  return (
    <Section className={S.solution__container} id="solution">
          <div className={S.solution__header}>
            <Eyebrow >{t("landing.solution.eyebrow")}</Eyebrow>
            <Title>
              {t("landing.solution.title")}
            </Title>
            <Sub>
                {t("landing.solution.subtitle")}
            </Sub>
          </div>
          <div className={S.solution__grid}>

            <Features>
              <Features.Item title={t("landing.solution.feature1.title")}>
                {t("landing.solution.feature1.desc")}
              </Features.Item>
              <Features.Item title={t("landing.solution.feature2.title")}>
                {t("landing.solution.feature2.desc")}
              </Features.Item>
              <Features.Item title={t("landing.solution.feature3.title")}>
                {t("landing.solution.feature3.desc")}
              </Features.Item>
            </Features>

            <VisualGraph />

            <VisualAlerts />

            <Features start={4}>
              <Features.Item title={t("landing.solution.feature4.title")}>
                {t("landing.solution.feature4.desc")}
              </Features.Item>
              <Features.Item title={t("landing.solution.feature5.title")}>
                {t("landing.solution.feature5.desc")}
              </Features.Item>
              <Features.Item title={t("landing.solution.feature6.title")}>
                {t("landing.solution.feature6.desc")}
              </Features.Item>
            </Features>
          </div>
    </Section>
  );
};