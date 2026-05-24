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

      <HeroSection />

      <ProblemSection />
    </>
  );
};