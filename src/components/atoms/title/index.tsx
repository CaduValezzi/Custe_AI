"use client";

import { forwardRef } from "react";
import S from "./styles.module.scss";
import { TitleProps } from "./props";


export const Title = forwardRef<
  HTMLHeadingElement,
  TitleProps
>(({ children, className }, ref) => {
  return (
    <div className={S.title__container}>
        <h1 ref={ref} className={className}>
          {children}
        </h1>
    </div>
  );
});

Title.displayName = "Title";