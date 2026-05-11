import React from 'react';
import LogoSrc from "../../../../public/logo.png";
import { type LogoProps } from './props';
import S from "./styles.module.scss";

export const Logo = ({ src = LogoSrc.src, alt = "Logo", size }: LogoProps): React.ReactNode => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`${S.size} ${S.color} `} src={src} alt={alt} datatype="image" style={{ height: size == 'logo' ? '5rem' : size, width: size == 'logo' ? '6rem' : size }} />
  );
}