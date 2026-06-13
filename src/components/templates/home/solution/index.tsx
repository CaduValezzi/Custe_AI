"use client";

import { useEffect, useRef } from "react";
import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { titleAnimation, cardsAnimation } from "./helpers";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import S from "./styles.module.scss";
import { Features } from "@/components/atoms/featureslist";
import { VisualGraph } from "@/components/molecules/visualgraph";



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
          <div className={S.feature__grid}>

            <Features>
              <Features.Item title="Cadastro centralizado">
                Adicione todas as suas APIs em um lugar &mdash; nome, provedor, chave de acesso, moeda e limite mensal. Tudo criptografado.
              </Features.Item>
              <Features.Item title="Upload via CSV">
                Faça upload das faturas de qualquer provedor. O sistema normaliza e associa os registros automaticamente.
              </Features.Item>
              <Features.Item title="Graficos em tempo real">
                Pizza, linha por periodo, e KPIs de crescimento e projeção &mdash; tudo atualizado apos cada upload.
              </Features.Item>
            </Features>
          
            <VisualGraph />
          </div>
        </div>
      </div>
    </Section>
  );
};