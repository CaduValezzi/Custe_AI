"use client";

import { useEffect, useRef } from "react";
import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { titleAnimation, cardsAnimation } from "./helpers";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import S from "./styles.module.scss";
import { Features } from "@/components/atoms/featureslist";



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
          
            <div className="pie-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#5028F0' }}></div>
                <span className="legend-name">OpenAI</span>
                <span className="legend-pct">38%</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#1464C8' }}></div>
                <span className="legend-name">AWS</span>
                <span className="legend-pct">20%</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#00B4A0' }}></div>
                <span className="legend-name">Stripe</span>
                <span className="legend-pct">13%</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: '#6B82A8' }}></div>
                <span className="legend-name">Outros</span>
                <span className="legend-pct">29%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};