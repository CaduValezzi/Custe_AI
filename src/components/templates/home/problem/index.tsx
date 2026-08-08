"use client";

import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { problems } from "./const"
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import { ProblemCard } from "@/components/molecules/problemcard";
import { useTranslation } from "react-i18next";
import S from "./styles.module.scss";

export const ProblemSection = () => {
  const { t } = useTranslation();
  return (
    <Section className={S.problem__container} id="problem">
          <div className={S.problem__header}>
            <Eyebrow >{t("landing.problem.eyebrow")}</Eyebrow>
            <Title>
              {t("landing.problem.title")}
            </Title>
            <Sub>
                {t("landing.problem.subtitle")}
            </Sub>
          </div>

          <div className={S.problem__grid}>
            {problems.map((problem) => (
              <ProblemCard
              key={problem.titleKey} icon={problem.icon} title={t(problem.titleKey)} content={t(problem.contentKey)} />
            ))}
          </div>
    </Section>
  );
};