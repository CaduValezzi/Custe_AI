import { type ReactNode } from "react";
import { type SectionProps } from "./props";
import S from "./styles.module.scss";

export const Section = ({ children, id, className }: SectionProps): ReactNode => {
  return (
    <section id={id} className={`${S.section} ${className || ''}`}>
      {children}
    </section>
  );
}