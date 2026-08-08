import { type ReactNode } from "react";
import { Sidebar } from "@/components/organisms/sidebar";
import S from "./styles.module.scss";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export const DashboardLayout = ({ children, title, actions }: DashboardLayoutProps) => {
  return (
    <div className={S.layout}>
      <Sidebar />
      <div className={S.layout__main}>
        <header className={S.layout__header}>
          <h1 className={S.layout__title}>{title}</h1>
          {actions && (
            <div className={S.layout__actions}>{actions}</div>
          )}
        </header>
        <main className={S.layout__content}>
          {children}
        </main>
      </div>
    </div>
  );
};
