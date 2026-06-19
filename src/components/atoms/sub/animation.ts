import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const subAnimation = (
  sub: HTMLParagraphElement,
) => {
  const tween = gsap.fromTo(
    sub,
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
        trigger: sub,
        start: "50% bottom",
      },
    }
  );

  return () => {
    tween.kill();
  };
};