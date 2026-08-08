"use client"
import Link from "next/link";
import { useState, type ReactNode } from "react";
import S from "./styles.module.scss";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/atoms/logo";
import iconSrc from "@/public/list.svg";
import { Picture } from "@/components/atoms/picture";


export const Menu = (): ReactNode => {
    const { t } = useTranslation();
    const [width, setWidth] = useState<number>(() => (typeof window !== "undefined" ? window.innerWidth : 0));
        const scrollTo = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
    const menuSection = document.querySelector(`.${S.menu__section}`);
    const menuIcon = document.querySelector(`.${S.menu__icon}`);
    const menuContainer = document.querySelector(`.${S.menu__container}`);
    const isDesktop = window.innerWidth > 441;
    let lastScrollY = window.scrollY;
    let isMouseOnMenu = false;
    let isMouseAtTop = false;


    const showMenu = () => {
        menuSection?.classList.remove(S.menu__section__hidden);
    };

    const hideMenu = () => {
        if (!isMouseOnMenu) {
            menuSection?.classList.add(S.menu__section__hidden);
        }
    };
    const toggleMenuMobile = () => {
        menuSection?.classList.toggle(S.menu__section__hiddenMobile);
        menuIcon?.classList.toggle(S.menu__icon__show);
    }
    const hideMenuMobile = () => {
        menuSection?.classList.add(S.menu__section__hiddenMobile);
        menuIcon?.classList.add(S.menu__icon__show);
    }

    const handleScroll = () => {
        if (isMouseOnMenu) return;

        const currentScrollY = window.scrollY;

        if (currentScrollY < lastScrollY) {
            // scroll para cima
            showMenu();
        } else if (currentScrollY > lastScrollY) {
            // scroll para baixo
            hideMenu();
        }

        lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
        const atTop = e.clientY <= 50;

        if (atTop && !isMouseAtTop) {
            isMouseAtTop = true;
            showMenu();
        }

        if (!atTop) {
            isMouseAtTop = false;
        }
    };

    const handleMenuEnter = () => {
        isMouseOnMenu = true;
        showMenu();
    };

    const handleMenuLeave = () => {
        isMouseOnMenu = false;
        if (!isMouseAtTop) {
            hideMenu();
        }
    };

    const resizeWindow = () => {
        setWidth(window.innerWidth);
    };


    if (isDesktop) {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    menuSection?.addEventListener("mouseenter", handleMenuEnter);
    menuSection?.addEventListener("mouseleave", handleMenuLeave);
    }else{
        window.addEventListener("resize", resizeWindow);
        menuIcon?.addEventListener("click", toggleMenuMobile);
        menuContainer?.addEventListener("click", hideMenuMobile);
    }

    

    return () => {
        if (isDesktop) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("mousemove", handleMouseMove);
        menuSection?.removeEventListener("mouseenter", handleMenuEnter);
        menuSection?.removeEventListener("mouseleave", handleMenuLeave);
        }else{
            window.removeEventListener("resize", resizeWindow);
            menuIcon?.removeEventListener("click", toggleMenuMobile);
            menuContainer?.removeEventListener("click", hideMenuMobile);
        }

        
    };
}, []);

const isMobile = width <= 441;

  return (
    <>
        <div className={`${S.menu__section} ${isMobile ? S.menu__section__hiddenMobile : '' }`}>
           <Picture className={`${S.menu__icon} ${isMobile ? S.menu__icon__show : '' }`} src={iconSrc.src} alt="Menu" />
           <div className={`${S.menu__container} `}>
               <a href="#" onClick={scrollTo("hero")}>{isMobile ? <Logo className={S.menu__logo} alt="Logo" size="medium" /> : <Logo className={S.menu__logo} alt="Logo" size="small" />}</a>
               <nav className={S.menu__nav}>
                 <ul className={S.menu__list}>
                   <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("problem")}>
                            {t("landing.menu.problem")}<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                    <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("solution")}>
                            {t("landing.menu.solution")}<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                    <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("plans")}>
                            {t("landing.menu.plans")}<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                 </ul>
               </nav>
               <Link href="/login" className={S.menu__button}>{t("landing.menu.login")}</Link>
           </div>
        </div >
    </>
  );
};