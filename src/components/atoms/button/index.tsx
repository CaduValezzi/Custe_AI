import S from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  children,
  variant = "primary",
  loading = false,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`${S.button} ${S[`button__${variant}`]} ${className ?? ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className={S.button__spinner} /> : children}
    </button>
  );
};
