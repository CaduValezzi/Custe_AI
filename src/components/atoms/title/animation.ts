import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const titleAnimation = (
  title: HTMLHeadingElement,
) => {
  const tween = gsap.fromTo(
    title,
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
        trigger: title,
        start: "50% bottom",
      },
    }
  );

  return () => {
    tween.kill();
  };
};