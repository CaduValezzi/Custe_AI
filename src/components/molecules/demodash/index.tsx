import S from './style.module.scss';

export const Demodash = () => {
  return (
    <div className={S.dashboardMockup}>
      <div className={S.browserBar}>
        <div className={S.browserDots}>
          <span className={S.dotR}></span>
          <span className={S.dotY}></span>
          <span className={S.dotG}></span>
        </div>
        <div className={S.browserUrl}>app.custe.ai / dashboard</div>
      </div>
      <div className={S.dashScreen}>
      <div className={S.kpiCard}>
        <div className={S.kpiLabel}>Gasto mensal</div>
        <div className={S.kpiValue}>R$4.820</div>
        <div className={S.kpiDelta + ' ' + S.up}>&#9650; 12% vs mes anterior</div>
      </div>
      <div className={S.kpiCard}>
        <div className={S.kpiLabel}>APIs monitoradas</div>
        <div className={S.kpiValue}>14</div>
        <div className={S.kpiDelta + ' ' + S.ok}>3 proximas do limite</div>
      </div>
      <div className={S.kpiCard}>
        <div className={S.kpiLabel}>Projecao mensal</div>
        <div className={S.kpiValue}>R$5.290</div>
        <div className={S.kpiDelta + ' ' + S.up}>&#9650; Acima do planejado</div>
      </div>
      <div className={S.kpiCard}>
        <div className={S.kpiLabel}>Alertas ativos</div>
        <div className={S.kpiValue}>2</div>
        <div className={S.kpiDelta + ' ' + S.up}>OpenAI &middot; AWS S3</div>
      </div>

      <div className={S.dashChart}>
        <div className={S.chartTitle}>Evolucao de gastos &mdash; ultimos 6 meses</div>
        <div className={S.bars}>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '42%', background: 'rgba(80,40,240,0.3)', border: '1px solid rgba(80,40,240,0.5)' }}></div><div className={S.barLbl}>Jan</div></div>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '55%', background: 'rgba(80,40,240,0.3)', border: '1px solid rgba(80,40,240,0.5)' }}></div><div className={S.barLbl}>Fev</div></div>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '48%', background: 'rgba(80,40,240,0.3)', border: '1px solid rgba(80,40,240,0.5)' }}></div><div className={S.barLbl}>Mar</div></div>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '70%', background: 'rgba(80,40,240,0.3)', border: '1px solid rgba(80,40,240,0.5)' }}></div><div className={S.barLbl}>Abr</div></div>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '82%', background: 'rgba(80,40,240,0.3)', border: '1px solid rgba(80,40,240,0.5)' }}></div><div className={S.barLbl}>Mai</div></div>
          <div className={S.barWrap}><div className={S.bar} style={{ height: '100%', background: 'linear-gradient(to top,#5028F0,#00B4A0)', border: 'none' }}></div><div className={S.barLbl}>Jun</div></div>
        </div>
      </div>

      <div className={S.dashTable}>
        <div className={S.chartTitle}>APIs &middot; Top gastos</div>
        <div className={S.apiRow}>
          <div className={S.apiName}><div className={S.apiPill} style={{ background: '#5028F0' }}></div>OpenAI GPT-4</div>
          <span className={S.apiCost}>R$1.840</span>
          <span className={S.apiStatus + ' ' + S.warn}>80% do limite</span>
        </div>
        <div className={S.apiRow}>
          <div className={S.apiName}><div className={S.apiPill} style={{ background: '#1464C8' }}></div>AWS S3</div>
          <span className={S.apiCost}>R$960</span>
          <span className={S.apiStatus + ' ' + S.warn}>74% do limite</span>
        </div>
        <div className={S.apiRow}>
          <div className={S.apiName}><div className={S.apiPill} style={{ background: '#00B4A0' }}></div>Stripe API</div>
          <span className={S.apiCost}>R$420</span>
          <span className={S.apiStatus + ' ' + S.ok}>Normal</span>
        </div>
        <div className={S.apiRow}>
          <div className={S.apiName}><div className={S.apiPill} style={{ background: '#6B82A8' }}></div>Google Maps</div>
          <span className={S.apiCost}>R$380</span>
          <span className={S.apiStatus + ' ' + S.ok}>Normal</span>
        </div>
      </div>
    </div>

    <div className={S.alertToast}>
      <div className={S.toastIcon}>&#9888;&#65039;</div>
      <div>
        <div className={S.toastTitle}>Alerta disparado</div>
        <div className={S.toastMsg}>OpenAI atingiu 80% do limite mensal</div>
      </div>
    </div>
  </div>
  );
};