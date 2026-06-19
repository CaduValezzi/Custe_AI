import { type ReactNode } from "react";
import S from "./styles.module.scss";
import { Logo } from "@/components/atoms/logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={S.authlayout}>
      <div className={S.authlayout__left}>
        <div className={S.authlayout__left__content}>
          <a href="/" className={S.authlayout__brand}>
            <Logo alt="Custe.AI" size="small" />
            <span>Custe.AI</span>
          </a>
          <div className={S.authlayout__tagline}>
            <h2>Controle inteligente dos seus<br /><span>gastos com APIs</span></h2>
            <p>Centralize, visualize e preveja seus custos com APIs em um unico lugar.</p>
          </div>
          <div className={S.authlayout__stats}>
            <div className={S.authlayout__stat}>
              <span className={S.authlayout__stat__value}>77%</span>
              <span className={S.authlayout__stat__label}>das PMEs usam APIs de pagamento</span>
            </div>
            <div className={S.authlayout__stat}>
              <span className={S.authlayout__stat__value}>60%+</span>
              <span className={S.authlayout__stat__label}>ja usam solucoes de IA via API</span>
            </div>
          </div>
        </div>
      </div>
      <div className={S.authlayout__right}>
        <div className={S.authlayout__right__content}>
          {children}
        </div>
      </div>
    </div>
  );
};
