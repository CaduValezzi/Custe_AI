import { type ReactNode } from "react";
import S from "./styles.module.scss";
import {type SectionProps } from "./props";

export const Section = ({ children, isColored = false }: SectionProps): ReactNode => {
  return (
    <section className={`${S.section} ${isColored ? S.colored : ''}`}>
      {children}
    </section>
  );
}