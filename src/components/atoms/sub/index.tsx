import S from "./styles.module.scss";
import { SubProps } from "./props";

export const Sub = ({ children }: SubProps) => {
  return (
    <p className={S.sub}>
      {children}
    </p>
  );
};
