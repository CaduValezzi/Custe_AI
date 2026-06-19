import S from "./styles.module.scss";
import { EyebrowProps } from "./props";
import { forwardRef } from "react";
import { eyeBrowAnimation } from "./animation";

export const Eyebrow = forwardRef<HTMLDivElement, EyebrowProps>(({ children }, ref) =>{
  const eyebrowRef = ref ?? ((node: HTMLDivElement | null) => {
    if (node) eyeBrowAnimation(node);
  });
  return (
    <div ref={eyebrowRef} className={S.eyebrow}>
      {children}
    </div>
  );
})
