import S from "./styles.module.scss";
import { SubProps } from "./props";
import { forwardRef } from "react";
import { subAnimation } from "./animation"

export const Sub = forwardRef<HTMLParagraphElement, SubProps>(({ children }, ref) => {
  const subRef = ref ?? ((node: HTMLParagraphElement | null) => {
    if (node) subAnimation(node);
  });

  return (
    <p ref={subRef} className={S.sub}>
      {children}
    </p>
  );
});

