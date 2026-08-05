"use client";

import { useEffect, useRef } from "react";
import { HeroSection } from "@/components/templates/home/hero";
import { ProblemSection } from "@/components/templates/home/problem";
import { Menu } from "@/components/organisms/menu";
import { SolutionSection } from "./solution";

export const HomeTemplate = () => {
  return (
    <>
      <Menu />

      <HeroSection />

      <ProblemSection />

      <SolutionSection />

    </>
  );
};