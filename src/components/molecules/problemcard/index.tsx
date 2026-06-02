'use client'
import { forwardRef } from "react";
import { ProblemCardProps } from "./props"
import S from "./styles.module.scss"

export const ProblemCard = forwardRef< HTMLDivElement,ProblemCardProps > (({ icon, title, content }, ref) =>{
    return (
    <div ref={ref} className={S.problemcard}>
      <span className={S.problemcard__icon}>{icon}</span>
      <h3 className={S.problemcard__title}>{title}</h3>
      <p className={S.problemcard__content}>{content}</p>
    </div>
    );
})

ProblemCard.displayName="ProblemCard";