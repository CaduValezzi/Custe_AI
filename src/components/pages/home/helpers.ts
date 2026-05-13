import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const layeredPinning = (
  sections: HTMLDivElement[]
) => {
  sections.forEach((section) => {
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
    //   end: "+=100%",
      pin: true,
      pinSpacing: false,
    //   scrub: true,
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
};