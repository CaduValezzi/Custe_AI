import { type ReactNode } from "react";
import { type SectionProps } from "./props";
import S from "./styles.module.scss";

export const Section = ({ children, id }: SectionProps): ReactNode => {
  return (
    <section id={id} className={`${S.section}`}>
      {children}
    </section>
  );
}