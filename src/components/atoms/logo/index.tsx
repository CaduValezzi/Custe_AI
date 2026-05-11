import React from 'react';
import LogoSrc from "../../../../public/images/logo/logo_small.png";
import { type LogoProps } from './props';

export const Logo = ({ src = LogoSrc.src, alt = "Custe AI", sizeHeight, sizeWidth, size }: LogoProps): React.ReactNode => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} style={{ height: sizeHeight ? sizeHeight : size === 'small' ? '5rem' : size === 'medium' ? '10rem' : '15rem', width: sizeWidth ? sizeWidth : size === 'small' ? '6rem' : size === 'medium' ? '12rem' : '18rem' }} />
  );
}