import { Logo } from "@/components/atoms/logo";
import S from './styles.module.scss';

export const Footer = () => {
    return (
        <footer className={S.footer__section}>
            <div className={S.footer__container}>
                <div className={S.footer__content}>
                    <div className={S.footer__content__logo}>
                        <Logo alt="Logo" sizeHeight="3rem" sizeWidth="3.5rem" />
                    </div>
                    <div className={S.footer__content__text}>
                        <p>© 2026 · Custe.AI  · Todos os direitos reservados.</p>
                    </div>
                </div>
            </div >
        </footer>
    );
}