import { forwardRef } from "react";
import { ProblemCardProps } from "./props"
import S from "./styles.module.scss"
import { cardAnimation } from "./animation";

export const ProblemCard = forwardRef< HTMLDivElement,ProblemCardProps > (({ icon, title, content }, ref) =>{
  const cardRef = ref ?? ((node: HTMLDivElement | null) => {
    if (node) cardAnimation(node);
  });
    return (
    <div ref={cardRef} className={S.problemcard}>
      <span className={S.problemcard__icon}>{icon}</span>
      <h3 className={S.problemcard__title}>{title}</h3>
      <p className={S.problemcard__content}>{content}</p>
    </div>
    );
})

ProblemCard.displayName="ProblemCard";