import S from "./styles.module.scss";

export const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className={`${S.section__container} mx-16`}>
      {children}
    </section>
  );
}