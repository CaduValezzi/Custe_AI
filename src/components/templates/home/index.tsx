"use client";

import { useEffect, useRef } from "react";
import { layeredPinning } from "./helpers";
import { HeroTemplate } from "@/components/templates/home/hero";
import { FeatureTemplate } from "@/components/templates/home/feature";
import { Menu } from "@/components/organisms/menu";

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
        className="relative z-1"
      >
        <HeroTemplate />
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className="relative z-2"
      >
        <FeatureTemplate />
      </div>
    </>
  );
};