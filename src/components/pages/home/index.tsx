"use client";

import { useEffect, useRef } from "react";

import { layeredPinning } from "./helpers";

import { Menu } from "@/components/molecules/menu";
import { Section } from "@/components/organisms/section";
import { HeroTemplate } from "@/components/templates/hero";
import S from "./styles.module.scss";
import { FeatureTemplate } from "@/components/templates/feature";

export const HomeTemplate = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cleanup = layeredPinning(sectionsRef.current);

    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <Menu />

      <div
        ref={(el) => {
          if (el) sectionsRef.current[0] = el;
        }}
        className="relative z-10"
      >
        <HeroTemplate />
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className="relative z-20"
      >
        <Section>
          <h1 className={S.Title}>Welcome to Custe AI</h1>
          <p>Your personal assistant for managing your finances.</p>
        </Section>
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[2] = el;
        }}
        className="relative z-30"
      >
        <Section isColored>
          <h1 className={S.Title}>Welcome to Custe AI</h1>
        </Section>
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[3] = el;
        }}
        className="relative z-40"
      >
        <Section>
          <h1 className={S.Title}>Welcome to Custe AI</h1>
          <p>Your personal assistant for managing your finances.</p>
        </Section>
      </div>
      <div
        ref={(el) => {
          if (el) sectionsRef.current[4] = el;
        }}
        className="relative z-50"
      >
        <FeatureTemplate />
      </div>
    </>
  );
};