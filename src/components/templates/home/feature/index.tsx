"use client";

import { useEffect, useRef } from "react";
import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { features } from "./const"
import { titleAnimation, cardsAnimation } from "./helpers";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import S from "./styles.module.scss";



export const ProblemSection = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
  if (!titleRef.current) return;
  const titleCleanup = titleAnimation(titleRef.current);
  const cardsCleanup = cardsAnimation(cardsRef.current);

  return () => {
    titleCleanup();
    cardsCleanup();
  };
}, []);

  return (
    <Section id="problem">
      <div className={S.feature}>
        <div className={S.feature__container}>
          <div className={S.feature__header}>
            <Eyebrow >O problema</Eyebrow>
            <Title
              ref={titleRef}
            >
              Seus gastos com APIs estao por toda parte
            </Title>

            <Sub>
                Pequenas e medias empresas gastam horas todo mes tentando entender o que consumiram — e muitas vezes descobrem tarde demais.
            </Sub>
          </div>

          <div className={S.feature__grid}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={S.feature__card}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
              >
                <h3 className={S.feature__cardTitle}>
                  {feature.title}
                </h3>

                <p className={S.feature__cardDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};