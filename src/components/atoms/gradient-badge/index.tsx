import type { ReactNode } from "react";

import S from "./styles.module.scss";

export interface GradientBadgeProps {
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}

/** Gradient-tinted status pill with an optional pulsing dot (port of mock `gradient-badge.tsx`). */
export const GradientBadge = ({ children, className, pulse = true }: GradientBadgeProps) => {
  return (
    <span className={`${S.badge} ${className ?? ""}`}>
      {pulse && <span className={S.badge__dot} aria-hidden />}
      {children}
    </span>
  );
};
