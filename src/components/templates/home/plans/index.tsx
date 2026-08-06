import { Section } from "@/components/organisms/section";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Sub } from "@/components/atoms/sub";
import { Title } from "@/components/atoms/title";
import { PriceCard } from "@/components/molecules/pricecard";
import S from "./styles.module.scss"

export const PlansSection = () =>{
    return(
        <Section className={S.plans__container} id="plans">
            <div className={S.plans__header}>
                <Eyebrow >Planos</Eyebrow>
                <Title className={S.plans__header__title}>
                    Transparente como deveria ser
                </Title>
                <Sub>
                    Sem surpresas. Exatamente o que voce espera de uma ferramenta de controle de custos.
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