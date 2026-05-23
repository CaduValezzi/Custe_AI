"use client"
import { type ReactNode } from "react";
import S from "./styles.module.scss";
import { useEffect } from "react";
import { Logo } from "@/components/atoms/logo";


export const Menu = (): ReactNode => {
    useEffect(() => {
        let lastScrollY: number = 0;
        const menuSection = document.querySelector(`.${S.menu__section}`);
        
        const menuShow = () => {
            const windowScrollY = window.scrollY;
            if (windowScrollY > lastScrollY) {
                menuSection?.classList.add(S.menu__section__hidden);
            } else {
                menuSection?.classList.remove(S.menu__section__hidden);
            }
            lastScrollY = windowScrollY;
        };
        const menuMouseOver = () => {
            menuSection?.classList.add(S.menu__section__visible);
        }
        const menuMouseOut = () => {
            menuSection?.classList.remove(S.menu__section__visible);
        }

        window.addEventListener("scroll", menuShow);
        menuSection?.addEventListener("mouseover", menuMouseOver);
        menuSection?.addEventListener("mouseout", menuMouseOut);

        return () => {
            window.removeEventListener("scroll", menuShow);
            menuSection?.removeEventListener("mouseover", menuMouseOver);
            menuSection?.removeEventListener("mouseout", menuMouseOut);
        };
    }, []);

  return (
    <>
        <div className={`${S.menu__section} `}>
           <div className={`${S.menu__container}`}>
               <a href="#" rel="noopener noreferrer"><Logo className={S.menu__logo} alt="Logo" size="small" /></a>
               <nav className={S.menu__nav}>
                 <ul className={S.menu__list}>
                   <li className={S.menu__item}><a href="#problem" rel="noopener noreferrer" >Problema<div className={S.menu__item__underline}/></a></li>
                   <li className={S.menu__item}><a href="#feature" rel="noopener noreferrer" >Solução<div className={S.menu__item__underline}/></a></li>
                   <li className={S.menu__item}><a href="#" rel="noopener noreferrer" >Contact<div className={S.menu__item__underline}/></a></li>
                 </ul>
               </nav>
           </div>
           <button className={S.menu__button}>Login</button>
        </div >
    </>
  );
};