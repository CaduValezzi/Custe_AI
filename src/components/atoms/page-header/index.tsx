"use client";

import type { ReactNode } from "react";

import S from "./styles.module.scss";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

/** App-page heading block: gradient eyebrow + serif title + muted subtitle (port of mock `page-header.tsx`). */
export const PageHeader = ({ eyebrow, title, subtitle, className, children }: PageHeaderProps) => {
  return (
    <div className={`${S.header} ${className ?? ""}`}>
      {eyebrow && <span className={S.header__eyebrow}>{eyebrow}</span>}
      <h1 className={S.header__title}>{title}</h1>
      {subtitle && <p className={S.header__subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
};
