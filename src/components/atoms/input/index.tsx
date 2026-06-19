import S from "./styles.module.scss";
import { InputProps } from "./props";

export const Input = ({ label, error, id, ...rest }: InputProps) => {
  return (
    <div className={S.input__wrapper}>
      <label htmlFor={id} className={S.input__label}>
        {label}
      </label>
      <input
        id={id}
        className={`${S.input__field} ${error ? S.input__field__error : ""}`}
        {...rest}
      />
      {error && <span className={S.input__error}>{error}</span>}
    </div>
  );
};
