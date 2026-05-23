"use client";

import { useEffect, useRef } from "react";
import { layeredPinning } from "./helpers";
import { HeroSection } from "@/components/templates/home/hero";
import { ProblemSection } from "@/components/templates/home/feature";
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
        <HeroSection />
      </div>

      <div
        ref={(el) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className="relative z-2"
      >
        <ProblemSection />
      </div>
    </>
  );
};