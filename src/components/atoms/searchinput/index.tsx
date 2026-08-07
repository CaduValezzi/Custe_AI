import S from "./styles.module.scss";
import { InputHTMLAttributes } from "react";

export const SearchInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={S.search}>
      <span className={S.search__icon}>🔍</span>
      <input className={S.search__input} {...props} />
    </div>
  );
};
