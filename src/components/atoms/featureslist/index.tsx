import S from "./styles.module.scss";
import { FeaturesProps } from "./props"
import { forwardRef } from "react";
import { itemAnimation } from "./animation";

export const Features = ({ children, start = 1, className }: FeaturesProps ) => {
  return (
    <ol className={`${S.feature__list} ${className}`} start={start}>
      {children}
    </ol>
  );
};

const Feature = forwardRef<HTMLLIElement, FeaturesProps>(({ title, children }, ref) => {
  const itemRef = ref ?? ((node: HTMLLIElement | null) => {
    if (node) itemAnimation(node);
  });
  return (
    <li className={S.feature__item} ref={itemRef}>
      <div className={S.feature__text}>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
    </li>
  );
});

Feature.displayName = "Feature";

Features.Item = Feature;