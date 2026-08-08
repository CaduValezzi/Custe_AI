"use client";

import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub"
import { Features } from "@/components/atoms/featureslist";
import { VisualGraph } from "@/components/molecules/visualgraph";
import { VisualAlerts } from "@/components/molecules/visualalerts";
import S from "./styles.module.scss";



export const SolutionSection = () => {
  return (
    <Section className={S.solution__container} id="solution">  
          <div className={S.solution__header}>
            <Eyebrow >A Solução</Eyebrow>
            <Title>
              Um dashboard para governar todos os seus custos
            </Title>
            <Sub>
                O Custe.AI traz clareza financeira real para quem usa APIs de terceiros.
            </Sub>
          </div>
          <div className={S.solution__grid}>

            <div className={S.solution__grid__line}>
              <Features className={S.solution__grid__line__item1}>
                <Features.Item title="Cadastro centralizado">
                  Adicione todas as suas APIs em um lugar &mdash; nome, provedor, chave de acesso, moeda e limite mensal. Tudo criptografado.
                </Features.Item>
                <Features.Item title="Upload via CSV">
                  Faça upload das faturas de qualquer provedor. O sistema normaliza e associa os registros automaticamente.
                </Features.Item>
                <Features.Item title="Gráficos em tempo real">
                  Pizza, linha por periodo, e KPIs de crescimento e projeção &mdash; tudo atualizado apos cada upload.
                </Features.Item>
              </Features>
              <VisualGraph className={S.solution__grid__line__item2} />
            </div>

           <div className={S.solution__grid__line}>
              <VisualAlerts className={S.solution__grid__line__item2}/>
              <Features start={4} className={S.solution__grid__line__item1}>
                <Features.Item title="Alertas automáticos">
                  Configure thresholds por API (ex: 80% do limite). Quando atingido, recebe notificacao in-app e por e-mail &mdash; antes de estourar.
                </Features.Item>
                <Features.Item title="Controle por perfil">
                  Administrador, Analista e Desenvolvedor &mdash; cada um acessa so o que precisa, com permissoes granulares.
                </Features.Item>
                <Features.Item title="Comparação de provedores">
                  Visualize lado a lado o custo de APIs similares como AWS vs Azure e tome decisoes baseadas em dados reais.
                </Features.Item>
              </Features>
           </div>
          </div>
    </Section>
  );
};