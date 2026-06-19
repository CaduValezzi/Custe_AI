import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const eyeBrowAnimation = (
  eyeBrow: HTMLDivElement,
) => {
  const tween = gsap.fromTo(
    eyeBrow,
    {
      y: 80,
      opacity: 0,
    },
    {
      y: 0,
      duration: 1,
      opacity: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: eyeBrow,
        start: "50% bottom",
      },
    }
  );

  return () => {
    tween.kill();
  };
};