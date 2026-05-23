import S from "./styles.module.scss";
import { EyebrowProps } from "./props";

export const Eyebrow = ({ children }: EyebrowProps) => {
  return (
    <div className={S.eyebrow}>
      {children}
    </div>
  );
};
