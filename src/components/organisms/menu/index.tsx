"use client"
import Link from "next/link";
import { type ReactNode } from "react";
import S from "./styles.module.scss";
import { useEffect } from "react";
import { Logo } from "@/components/atoms/logo";


export const Menu = (): ReactNode => {
    const scrollTo = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
    let lastScrollY = window.scrollY;

    const menuSection = document.querySelector(`.${S.menu__section}`);

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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    menuSection?.addEventListener("mouseenter", handleMenuEnter);
    menuSection?.addEventListener("mouseleave", handleMenuLeave);

    return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("mousemove", handleMouseMove);

        menuSection?.removeEventListener("mouseenter", handleMenuEnter);
        menuSection?.removeEventListener("mouseleave", handleMenuLeave);
    };
}, []);

  return (
    <>
        <div className={`${S.menu__section} `}>
           <div className={`${S.menu__container}`}>
               <a href="#" onClick={scrollTo("hero")}><Logo className={S.menu__logo} alt="Logo" size="small" /></a>
               <nav className={S.menu__nav}>
                 <ul className={S.menu__list}>
                   <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("problem")}>
                            Problema<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                    <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("solution")}>
                            Solução<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                    <li className={S.menu__item}>
                        <a href="#" onClick={scrollTo("problem")}>
                            Contact<div className={S.menu__item__underline}/>
                        </a>
                    </li>
                 </ul>
               </nav>
           </div>
           <Link href="/login" className={S.menu__button}>Login</Link>
        </div >
    </>
  );
};