import { Slot } from "@radix-ui/react-slot";
import S from "./styles.module.scss";
import { ButtonProps } from "./props";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = true,
  asChild = false,
  className,
  disabled,
  ...rest
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  const classes = `${S.button} ${S[`button__${variant}`]} ${S[`button__${size}`]} ${fullWidth ? S.button__full : ""} ${className ?? ""}`;
  return (
    <Comp
      className={classes}
      disabled={asChild ? undefined : disabled || loading}
      {...rest}
    >
      {loading && !asChild ? <span className={S.button__spinner} /> : children}
    </Comp>
  );
};
