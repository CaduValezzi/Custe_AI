'use client'
import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { problems } from "./const"
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import { ProblemCard } from "@/components/molecules/problemcard";
import S from "./styles.module.scss";

export const ProblemSection = () => {
  return (
    <Section className={S.problem__container} id="problem">  
          <div className={S.problem__header}>
            <Eyebrow >O problema</Eyebrow>
            <Title>
              Seus gastos com APIs estão por toda parte
            </Title>
            <Sub>
                Pequenas e medias empresas gastam horas todo mês tentando entender o que consumiram — e muitas vezes descobrem tarde demais.
            </Sub>
          </div>

          <div className={S.problem__grid}>
            {problems.map((problem) => (
              <ProblemCard
              key={problem.title} icon={problem.icon} title={problem.title} content={problem.content} />
            ))}
          </div>
    </Section>
  );
};