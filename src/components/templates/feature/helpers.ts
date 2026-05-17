import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const titleAnimation = (
  title: HTMLHeadingElement
) => {
  const tween = gsap.fromTo(
    title,
    {
      x: 500,
      opacity: 0,
    },
    {
      x: 0,
      opacity: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 50%",
        end: "bottom 30%",
        scrub: true,
      },
    }
  );

  return () => {
    tween.kill();
  };
};