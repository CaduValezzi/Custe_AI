import type { Metadata } from "next";

import "@/styles/globals.scss";
import { RootProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Custe.AI",
  description: "O Custe.AI centraliza todos os seus gastos com APIs de terceiros em um unico dashboard, com alertas automaticos, histórico e projeção de custos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
