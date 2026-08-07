"use client";

import { DashboardLayout } from "@/components/templates/dashboardlayout";
import { LimitCard } from "@/components/molecules/limitcard";
import S from "./styles.module.scss";

const gastos = [
  { nome: "API 1 — OpenAI GPT-4", gasto: "R$ 1.840", limite: "R$ 2.000", percentual: 92 },
  { nome: "API 2 — AWS S3", gasto: "R$ 960", limite: "R$ 1.300", percentual: 74 },
  { nome: "API 3 — Stripe", gasto: "R$ 420", limite: "R$ 600", percentual: 70 },
];

export default function GastosPage() {
  return (
    <DashboardLayout title="Limite de Gastos">
      <div className={S.gastos}>
        {gastos.map((item, i) => (
          <LimitCard key={i} {...item} />
        ))}
      </div>
    </DashboardLayout>
  );
}
