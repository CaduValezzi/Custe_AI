import S from "./styles.module.scss"

export const HeroSection = () => {
  return (
    <>
      <section className={S.hero__section}>
        <div className={S.hero__container}>
          <div className={S.hero__content}>

            <div className={S.hero__info}>
              <h1 className={S.hero__headline}>
                Pare de perder dinheiro<br/>com <span className={S.hero__headline__span}>APIs que você<br/>nem lembra que usa</span>
              </h1>

              <p className={S.hero__description}>
                O Custe.AI centraliza todos os seus gastos com APIs de terceiros em um unico dashboard — com alertas automaticos, historico e projecao de custos.
              </p>

              <div className={S.hero__actions}>
                <button className={S.hero__actions__especial}>Começar agora!</button>
                <button>Ver dashboard</button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}; 