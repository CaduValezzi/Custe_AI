"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import S from "./styles.module.scss";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/api", label: "API", icon: "⚙" },
  { href: "/previsao", label: "Previsão", icon: "📊" },
  { href: "/gastos", label: "Gastos", icon: "▦" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={S.sidebar}>
      <div className={S.sidebar__brand}>
        <span className={S.sidebar__brandname}>Custe.AI</span>
      </div>
      <nav className={S.sidebar__nav}>
        <ul className={S.sidebar__list}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${S.sidebar__link} ${pathname === item.href ? S["sidebar__link--active"] : ""}`}
              >
                <span className={S.sidebar__icon}>{item.icon}</span>
                <span className={S.sidebar__label}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
