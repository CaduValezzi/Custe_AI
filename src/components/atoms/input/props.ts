import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional inline label. Omit when rendering a <Label> separately (app forms). */
  label?: string;
  error?: string;
}
