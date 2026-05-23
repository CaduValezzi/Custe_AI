"use client";

import { forwardRef } from "react";
import S from "./styles.module.scss";
import { TitleProps } from "./props";


export const Title = forwardRef<
  HTMLHeadingElement,
  TitleProps
>(({ children, className }, ref) => {
  return (
    <h1 ref={ref} className={`${S.title} ${className}`}>
          {children}
    </h1>
  );
});

Title.displayName = "Title";