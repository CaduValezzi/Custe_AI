"use client";
import { Footer } from "@/components/organisms/footer";
import { Menu } from "@/components/organisms/menu";
import { HeroSection } from "@/components/organisms/hero";
import { PlansSection } from "@/components/organisms/plans";
import { ProblemSection } from "@/components/organisms/problem";
import { SolutionSection } from "@/components/organisms/solution";

export const PageLayout = () => {
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