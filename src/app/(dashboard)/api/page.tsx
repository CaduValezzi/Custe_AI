"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/templates/dashboardlayout";
import { ApiTable, type ApiRow } from "@/components/molecules/apitable";
import { SearchInput } from "@/components/atoms/searchinput";
import S from "./styles.module.scss";

const mockApis: ApiRow[] = [
  { id: "1", nome: "OpenAI GPT-4", custoMensal: "R$ 1.840", custoAnual: "R$ 22.080", provedor: "OpenAI", limite: "R$ 2.000", percentual: 92 },
  { id: "2", nome: "AWS S3", custoMensal: "R$ 960", custoAnual: "R$ 11.520", provedor: "Amazon", limite: "R$ 1.300", percentual: 74 },
  { id: "3", nome: "Stripe API", custoMensal: "R$ 420", custoAnual: "R$ 5.040", provedor: "Stripe", limite: "R$ 600", percentual: 70 },
  { id: "4", nome: "Google Maps", custoMensal: "R$ 380", custoAnual: "R$ 4.560", provedor: "Google", limite: "R$ 500", percentual: 76 },
  { id: "5", nome: "Twilio SMS", custoMensal: "R$ 220", custoAnual: "R$ 2.640", provedor: "Twilio", limite: "R$ 400", percentual: 55 },
];

export default function ApiPage() {
  const [search, setSearch] = useState("");

  const filtered = mockApis.filter((api) =>
    api.nome.toLowerCase().includes(search.toLowerCase()) ||
    api.provedor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="API"
      actions={
        <>
          <SearchInput
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={S.api__addbutton}>+ Adicionar</button>
        </>
      }
    >
      <ApiTable data={filtered} />
    </DashboardLayout>
  );
}
