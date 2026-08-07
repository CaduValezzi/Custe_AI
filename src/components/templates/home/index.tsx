"use client";

import { useEffect, useRef } from "react";
import { HeroSection } from "@/components/templates/home/hero";
import { ProblemSection } from "@/components/templates/home/problem";
import { Menu } from "@/components/organisms/menu";
import { SolutionSection } from "./solution";
import { PlansSection } from "./plans";
import { Footer } from "@/components/organisms/footer";

export const HomeTemplate = () => {
  return (
    <>
      <Menu />

      <HeroSection />

      <ProblemSection />

      <SolutionSection />

      <PlansSection />

      <Footer />

    </>
  );
};