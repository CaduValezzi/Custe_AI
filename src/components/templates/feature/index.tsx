"use client";

import { useEffect, useRef } from "react";

import { Title } from "@/components/atoms/title";
import { Section } from "@/components/organisms/section";

import { titleAnimation } from "./helpers";

import S from "./styles.module.scss";

export const FeatureTemplate = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const cleanup = titleAnimation(titleRef.current);

    return () => cleanup();
  }, []);

  return (
    <Section id="feature">
      <div className={S.feature__container}>
        <Title
          ref={titleRef}
          className={S.title__especial}
        >
          Funcionalidades
        </Title>

        <p>Feature description goes here.</p>

        <Title>Funcionalidades</Title>
      </div>
    </Section>
  );
};