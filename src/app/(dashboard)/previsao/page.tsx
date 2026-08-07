"use client";

import { DashboardLayout } from "@/components/templates/dashboardlayout";
import { ChartCard } from "@/components/molecules/chartcard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import S from "./styles.module.scss";

const mainForecast = [
  { mes: "Mês Futuro 1", valor: 27000 },
  { mes: "Mês Futuro 2", valor: 22000 },
  { mes: "Mês Futuro 3", valor: 17000 },
];

const apiForecast = [
  {
    nome: "Previsão da API 2",
    data: [
      { mes: "MF1", valor: 25000 },
      { mes: "MF2", valor: 20000 },
      { mes: "MF3", valor: 16000 },
    ],
  },
  {
    nome: "Previsão da API 3",
    data: [
      { mes: "MF1", valor: 28000 },
      { mes: "MF2", valor: 22000 },
      { mes: "MF3", valor: 15000 },
    ],
  },
];

const tooltipStyle = {
  contentStyle: {
    background: "#001428",
    border: "1px solid #ffffff21",
    borderRadius: "0.8rem",
    fontSize: "1.2rem",
  },
  formatter: (value: unknown) => [`R$ ${Number(value).toLocaleString("pt-BR")}`],
};

export default function PrevisaoPage() {
  return (
    <DashboardLayout title="Previsão de Gastos">
      <div className={S.previsao}>
        <ChartCard title="Previsão da API 1" className={S.previsao__main}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={mainForecast} barSize={80}>
              <XAxis dataKey="mes" tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B82A8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]} name="Previsão">
                {mainForecast.map((_, i) => (
                  <Cell key={i} fill={`rgba(80,40,240,${1 - i * 0.22})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className={S.previsao__sidebar}>
          {apiForecast.map((api) => (
            <ChartCard key={api.nome} title={api.nome}>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={api.data} barSize={24}>
                  <XAxis dataKey="mes" tick={{ fill: "#6B82A8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="valor" fill="#5028F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
