import { type ReactNode } from "react";
import { type SectionProps } from "./props";
import S from "./styles.module.scss";

export const Section = ({ children, isColored = false, id }: SectionProps): ReactNode => {
  return (
    <section id={id} className={`${S.section} ${isColored ? S.colored : ''}`}>
      {children}
    </section>
  );
}