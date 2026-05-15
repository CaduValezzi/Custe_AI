"use client"
import { type ReactNode } from "react";
import S from "./styles.module.scss";
import { useEffect } from "react";
import { Logo } from "@/components/atoms/logo";


export const Menu = (): ReactNode => {
    useEffect(() => {
        let lastScrollY: number = 0;
        const handleScroll = () => {
           
            const windowScrollY = window.scrollY;
        
            const section = document.querySelector(`.${S.menu__section}`);
            
            if (windowScrollY > lastScrollY) {
                lastScrollY = windowScrollY;
                section?.classList.add(S.menu__section__scrolled);
            } else {
                lastScrollY = windowScrollY;
                section?.classList.remove(S.menu__section__scrolled);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <>
        <div className={`${S.menu__section} `}>
            <div className={`${S.menu__container}`}>
                <Logo alt="Logo" size="small" />
                <nav className={S.menu__nav}>
                  <ul className={S.menu__list}>
                    <li className={S.menu__item}><a href="#home" rel="noopener noreferrer" >Home</a></li>
                    <li className={S.menu__item}><a href="#feature" rel="noopener noreferrer" >Funcionalidades</a></li>
                    <li className={S.menu__item}><a href="#contact" rel="noopener noreferrer" >Contact</a></li>
                  </ul>
                </nav>
            </div>
            <button className={S.menu__button}>Login</button>
        </div >
    </>
  );
};