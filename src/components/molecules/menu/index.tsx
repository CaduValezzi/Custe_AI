"use client"
import { type ReactNode } from "react";
import S from "./styles.module.scss";
import { useEffect } from "react";
import { Logo } from "@/components/atoms/logo";


export const Menu = (): ReactNode => {
    useEffect(() => {
        const handleScroll = () => {
            const menu = document.querySelector(`.${S.menu__section}`);
            if (window.scrollY > 0) {
                menu?.classList.add(S.menu__section__scrolled);
                menu?.classList.remove(S.menu__section__notscrolled);
            } else {
                menu?.classList.remove(S.menu__section__scrolled);
                menu?.classList.add(S.menu__section__notscrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <>
        <div className={`${S.menu__section} ${S.menu__section__notscrolled}`}>
            <div className={S.menu__container}>
                <Logo alt="Logo" size="small" />
                <nav className={S.menu__nav}>
                  <ul className={S.menu__list}>
                    <li className={S.menu__item}><a href="#home" rel="noopener noreferrer" >Home</a></li>
                    <li className={S.menu__item}><a href="#about" rel="noopener noreferrer" >Funcionalidades</a></li>
                    <li className={S.menu__item}><a href="#contact" rel="noopener noreferrer" >Contact</a></li>
                  </ul>
                </nav>
                <button>Menu</button>
            </div>
        </div >
    </>
  );
};