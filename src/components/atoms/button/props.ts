import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. "primary" and "ghost" are the landing/auth defaults; the rest serve app pages. */
  variant?: "primary" | "ghost" | "secondary" | "outline" | "danger";
  /** Size. Default "md" matches the legacy atom (full-height 4.8rem). "icon" is a square 3.2rem button for icon-only actions. */
  size?: "sm" | "md" | "lg" | "icon";
  /** Show an inline spinner and disable the button while `true`. */
  loading?: boolean;
  /** Stretch to 100% width (legacy default). Pass `false` for inline app buttons. */
  fullWidth?: boolean;
  /** Render the button's single child element (e.g. a NextLink) instead of a <button>, via Radix Slot. */
  asChild?: boolean;
}
