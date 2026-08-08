import S from "./style.module.scss"

export const VisualAlerts = () => {
    return(
        <div className={S["feature-visual"]}>
            <div className={S["chart-title"]}>Alertas configurados</div>
            <div className={S["alert-item"]}>
                <div className={S["alert-indicator-active"]}></div>
                <div className={S["alert-text"]}>OpenAI GPT-4 &middot;
                Limite R$2.000</div>
                <div className={S["alert-pct"]}>80% atingido</div>
            </div>
            <div className={S["alert-item"]}>
                <div className={S["alert-indicator-active"]}></div>
                <div className={S["alert-text"]}>AWS S3 &middot;
                Limite R$1.300</div>
                <div className={S["alert-pct"]}>74% atingido</div>
            </div>
            <div className={S["alert-item"]}>
                <div className={S["alert-indicator-ok"]}></div>
                <div className={S["alert-text"]}>Stripe API &middot;
                Limite R$600</div>
                <div className={S["alert-pct"]}>70% &middot;
                Normal</div>
            </div>
            <div className={S["alert-item"]}>
                <div className={S["alert-indicator-ok"]}></div>
                <div className={S["alert-text"]}>Google Maps &middot;
                Limite R$500</div>
                <div className={S["alert-pct"]}>76% &middot;
                Normal</div>
            </div>
        </div>
    )
}