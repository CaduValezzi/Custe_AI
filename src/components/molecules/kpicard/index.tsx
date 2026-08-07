import S from "./styles.module.scss";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
}

export const KpiCard = ({ label, value, delta, deltaType = "neutral" }: KpiCardProps) => {
  return (
    <div className={S.kpi}>
      <div className={S.kpi__label}>{label}</div>
      <div className={S.kpi__value}>{value}</div>
      {delta && (
        <div className={`${S.kpi__delta} ${S[`kpi__delta--${deltaType}`]}`}>
          {deltaType === "up" ? "▲" : deltaType === "down" ? "▼" : ""} {delta}
        </div>
      )}
    </div>
  );
};
