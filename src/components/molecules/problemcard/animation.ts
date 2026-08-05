import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const cardAnimation = (
  card: HTMLDivElement,
) => {
  const tween = gsap.fromTo(
    card,
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
        trigger: card,
        start: "50% bottom",
      },
    }
  );

  return () => {
    tween.kill();
  };
};