import S from "./styles.module.scss";
import { EyebrowProps } from "./props";

export const Eyebrow = ({ children }: EyebrowProps) => {
  return (
    <h2 className={S.eyebrow}>
      {children}
    </h2>
  );
};
