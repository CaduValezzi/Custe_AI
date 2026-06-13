"use client";

import { useEffect, useRef } from "react";
import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { titleAnimation, cardsAnimation } from "./helpers";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import S from "./styles.module.scss";



export const SolutionSection = () => {
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
    <Section id="solution">
      <div className={S.feature}>
        <div className={S.feature__container}>
          <div className={S.feature__header}>
            <Eyebrow >A Solução</Eyebrow>
            <Title
              ref={titleRef}
            >
              Um dashboard para governar todos os seus custos
            </Title>
            <Sub>
                O Custe.AI traz clareza financeira real para quem usa APIs de terceiros.
            </Sub>
          </div>

          
        </div>
      </div>
    </Section>
  );
};