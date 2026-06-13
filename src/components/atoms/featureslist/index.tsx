// features.tsx
import S from "./styles.module.scss";
import { FeaturesProps } from "./props"

export const Features = ({ children, start = 1 }: FeaturesProps ) => {
  return (
    <ol className={S["feature__list"]} start={start}>
      {children}
    </ol>
  );
};

const Feature = ({ title, children }: FeaturesProps) => {
  return (
    <li className={S["feature__item"]}>
      <div className={S["feature__text"]}>
        <h4>{title}</h4>
        <p>{children}</p>
      </div>
    </li>
  );
};



Features.Item = Feature;