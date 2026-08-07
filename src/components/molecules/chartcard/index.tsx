import { type ReactNode } from "react";
import S from "./styles.module.scss";

interface ChartCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ title, children, className }: ChartCardProps) => {
  return (
    <div className={`${S.chartcard} ${className ?? ""}`}>
      {title && <div className={S.chartcard__title}>{title}</div>}
      <div className={S.chartcard__body}>{children}</div>
    </div>
  );
};
