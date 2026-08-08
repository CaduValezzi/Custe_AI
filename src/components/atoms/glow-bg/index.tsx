import S from "./styles.module.scss";

export interface GlowBgProps {
  className?: string;
}

/** Decorative violet/cyan radial glows for app pages (port of mock `glow-bg.tsx`). */
export const GlowBg = ({ className }: GlowBgProps) => {
  return (
    <div className={`${S.glow} ${className ?? ""}`} aria-hidden>
      <div className={S.glow__violet} />
      <div className={S.glow__cyan} />
    </div>
  );
};
