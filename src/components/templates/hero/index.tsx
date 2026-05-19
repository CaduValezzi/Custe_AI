import { Picture } from "@/components/atoms/picture";
import HeroImage from "../../../../public/images/pexels-weekendplayer-186461.jpg";
import S from "./styles.module.scss"

export const HeroTemplate = () => {
  return (
    <>
      <section className={S.hero__section}>
        <div className={S.hero__container}>
          <div className={S.hero__content}>

            <div className={S.hero__info}>
              <h1 className={S.hero__headline}>
                Controle todos os custos das suas APIs em um só lugar.
              </h1>

              <p className={S.hero__description}>
                Monitore gastos, receba alertas e visualize o consumo da sua stack em tempo real.
              </p>

              <div className={S.hero__actions}>
                <button>Começar agora!</button>
                <button>Ver dashboard</button>
              </div>
            </div>

            <div className={S.hero__visual}>
               <Picture src={HeroImage.src} sizeHeight="50vh" sizeWidth="100vw"/>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}; 