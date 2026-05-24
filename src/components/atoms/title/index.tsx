"use client";

import { forwardRef } from "react";
import S from "./styles.module.scss";
import { TitleProps } from "./props";


export const Title = forwardRef<
  HTMLHeadingElement,
  TitleProps
>(({ children, className }, ref) => {
  return (
    <h2 ref={ref} className={`${S.title} ${className}`}>
          {children}
    </h2>
  );
});

Title.displayName = "Title";