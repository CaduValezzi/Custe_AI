import S from "./style.module.scss"

export const VisualGraph = () => {
    return(
        <div className={S["feature-visual"]}>
            <div className={S["chart-title"]}>Distribuicao de gastos &mdash;
                Junho 2026</div>
            <div className={S["pie-wrap"]}>
                <svg viewBox="0 0 120 120" width="110" height="110" style={{ flexShrink: 0 }}>
                <circle r="40" cx="60" cy="60" fill="transparent" stroke="#5028F0" strokeWidth="28" strokeDasharray="100 152" strokeDashoffset="0"/>
                <circle r="40" cx="60" cy="60" fill="transparent" stroke="#1464C8" strokeWidth="28" strokeDasharray="50 202" strokeDashoffset="-100"/>
                <circle r="40" cx="60" cy="60" fill="transparent" stroke="#00B4A0" strokeWidth="28" strokeDasharray="30 222" strokeDashoffset="-150"/>
                <circle r="40" cx="60" cy="60" fill="transparent" stroke="#6B82A8" strokeWidth="28" strokeDasharray="72 180" strokeDashoffset="-180"/>
                <circle r="28" cx="60" cy="60" fill="#001428"/>
                </svg>
                <div className={S["pie-legend"]}>
                <div className={S["legend-item"]}><div className={S["legend-dot"]} style={{ background: '#5028F0' }}></div><span className={S["legend-name"]}>OpenAI</span><span className={S["legend-pct"]}>38%</span></div>
                <div className={S["legend-item"]}><div className={S["legend-dot"]} style={{ background: '#1464C8' }}></div><span className={S["legend-name"]}>AWS</span><span className={S["legend-pct"]}>20%</span></div>
                <div className={S["legend-item"]}><div className={S["legend-dot"]} style={{ background: '#00B4A0' }}></div><span className={S["legend-name"]}>Stripe</span><span className={S["legend-pct"]}>13%</span></div>
                <div className={S["legend-item"]}><div className={S["legend-dot"]} style={{ background: '#6B82A8' }}></div><span className={S["legend-name"]}>Outros</span><span className={S["legend-pct"]}>29%</span></div>
                </div>
            </div>
        </div>
    );
}