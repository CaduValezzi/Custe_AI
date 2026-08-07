import S from "./styles.module.scss";

interface LimitCardProps {
  nome: string;
  gasto: string;
  limite: string;
  percentual: number;
}

export const LimitCard = ({ nome, gasto, limite, percentual }: LimitCardProps) => {
  const isWarn = percentual >= 80;

  return (
    <div className={`${S.limitcard} ${isWarn ? S["limitcard--warn"] : ""}`}>
      <div className={S.limitcard__grid}>
        <div className={S.limitcard__field}>
          <span className={S.limitcard__label}>Nome</span>
          <span className={S.limitcard__name}>{nome}</span>
        </div>
        <div className={S.limitcard__field}>
          <span className={S.limitcard__label}>Gasto</span>
          <span className={S.limitcard__value}>{gasto}</span>
        </div>
        <div className={S.limitcard__field}>
          <span className={S.limitcard__label}>Limite de gasto</span>
          <span className={S.limitcard__value}>{limite}</span>
        </div>
        <div className={S.limitcard__field}>
          <span className={S.limitcard__label}>Acima do limite</span>
          <span className={`${S.limitcard__pct} ${isWarn ? S["limitcard__pct--warn"] : ""}`}>
            {percentual >= 100 ? `+${percentual - 100}%` : `-${100 - percentual}%`}
          </span>
        </div>
      </div>
      <div className={S.limitcard__progresswrap}>
        <div
          className={`${S.limitcard__progress} ${isWarn ? S["limitcard__progress--warn"] : ""}`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>
    </div>
  );
};
