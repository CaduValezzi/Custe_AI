"use client";

import { forwardRef } from "react";
import S from "./styles.module.scss";
import { TitleProps } from "./props";
import { titleAnimation } from "./animation"


export const Title = forwardRef<
  HTMLHeadingElement,
  TitleProps
>(({ children, className }, ref) => {
  const headingRef = ref ?? ((node: HTMLHeadingElement | null) => {
    if (node) titleAnimation(node);
  });

  return (
    <h2 ref={headingRef} className={`${S.title} ${className}`}>
          {children}
    </h2>
  );
});

Title.displayName = "Title";