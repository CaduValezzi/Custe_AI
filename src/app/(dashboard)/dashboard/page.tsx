"use client";

import { DashboardLayout } from "@/components/templates/dashboardlayout";
import { KpiCard } from "@/components/molecules/kpicard";
import { ChartCard } from "@/components/molecules/chartcard";
import {
  LineChart, Line, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import S from "./styles.module.scss";

const lineData = [
  { mes: "Jan", atual: 3200, previsto: 2800 },
  { mes: "Fev", atual: 4100, previsto: 3200 },
  { mes: "Mar", atual: 3700, previsto: 3500 },
  { mes: "Abr", atual: 5200, previsto: 4000 },
  { mes: "Mai", atual: 4800, previsto: 4500 },
  { mes: "Jun", atual: 4820, previsto: 4600 },
];

const pieData = [
  { name: "OpenAI", value: 38 },
  { name: "AWS", value: 20 },
  { name: "Stripe", value: 13 },
  { name: "Outros", value: 29 },
];

const barData = [
  { mes: "Jan", valor: 3200 },
  { mes: "Fev", valor: 4100 },
  { mes: "Mar", valor: 3700 },
  { mes: "Abr", valor: 5200 },
  { mes: "Mai", valor: 4800 },
  { mes: "Jun", valor: 4820 },
];

const PIE_COLORS = ["#5028F0", "#1464C8", "#00B4A0", "#6B82A8"];

const tooltipStyle = {
  contentStyle: {
    background: "#001428",
    border: "1px solid #ffffff21",
    borderRadius: "0.8rem",
    fontSize: "1.2rem",
  },
  labelStyle: { color: "#e0e0f0" },
};

export default function DashboardPage() {
  return (
    <DashboardLayout title="Dashboard">
      <div className={S.dashboard__kpis}>
        <KpiCard label="Gasto mensal" value="R$ 4.820" delta="12% vs mês anterior" deltaType="up" />
        <KpiCard label="APIs monitoradas" value="14" delta="3 próximas do limite" deltaType="neutral" />
        <KpiCard label="Projeção mensal" value="R$ 5.290" delta="Acima do planejado" deltaType="up" />
        <KpiCard label="Alertas ativos" value="2" delta="OpenAI · AWS S3" deltaType="neutral" />
      </div>

      <div className={S.dashboard__charts}>
        <ChartCard title="Evolução de gastos — últimos 6 meses" className={S["dashboard__charts--wide"]}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData}>
              <XAxis dataKey="mes" tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR")}`]} />
              <Legend wrapperStyle={{ fontSize: "1.2rem", color: "#6B82A8" }} />
              <Line type="monotone" dataKey="atual" stroke="#5028F0" strokeWidth={2} dot={{ fill: "#5028F0", r: 4 }} name="Atual" />
              <Line type="monotone" dataKey="previsto" stroke="#00B4A0" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: "#00B4A0", r: 4 }} name="Previsto" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição por provedor">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: "1.1rem", color: "#6B82A8" }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gasto por mês">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="mes" tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR")}`]} />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]} name="Gasto">
                {barData.map((_, i) => (
                  <Cell key={i} fill={i === barData.length - 1 ? "#5028F0" : "rgba(80,40,240,0.3)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  );
}
