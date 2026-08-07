import S from "./styles.module.scss";

export interface ApiRow {
  id: string;
  nome: string;
  custoMensal: string;
  custoAnual: string;
  provedor: string;
  limite: string;
  percentual: number;
}

const COLORS = ["#5028F0", "#1464C8", "#00B4A0", "#FF7A59", "#6B82A8"];

interface ApiTableProps {
  data: ApiRow[];
}

export const ApiTable = ({ data }: ApiTableProps) => {
  return (
    <div className={S.apitable}>
      <div className={S.apitable__header}>
        <div className={S.apitable__cell}>Nome ▼</div>
        <div className={S.apitable__cell}>Custo Mensal ▼</div>
        <div className={S.apitable__cell}>Custo Anual ▼</div>
        <div className={S.apitable__cell}>Provedor ▼</div>
        <div className={S.apitable__cell}>Limite de Gastos ▼</div>
      </div>
      <div className={S.apitable__body}>
        {data.map((row, index) => (
          <div key={row.id} className={S.apitable__row}>
            <div className={S.apitable__cell}>
              <div className={S.apitable__name}>
                <div
                  className={S.apitable__dot}
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                {row.nome}
              </div>
            </div>
            <div className={S.apitable__cell}>
              <span className={S.apitable__mono}>{row.custoMensal}</span>
            </div>
            <div className={S.apitable__cell}>
              <span className={S.apitable__mono}>{row.custoAnual}</span>
            </div>
            <div className={S.apitable__cell}>{row.provedor}</div>
            <div className={S.apitable__cell}>
              <div className={S.apitable__limitwrap}>
                <span className={S.apitable__mono}>{row.limite}</span>
                <div className={S.apitable__bar}>
                  <div
                    className={`${S.apitable__fill} ${row.percentual >= 80 ? S["apitable__fill--warn"] : ""}`}
                    style={{ width: `${row.percentual}%` }}
                  />
                </div>
                <span className={`${S.apitable__pct} ${row.percentual >= 80 ? S["apitable__pct--warn"] : ""}`}>
                  {row.percentual}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
