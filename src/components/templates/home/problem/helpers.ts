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
      duration: 0.5,
      opacity: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 90%",
      },
    }
  );

  return () => {
    tween.kill();
  };
};

export const cardsAnimation = (
  cards: HTMLDivElement[]
) => {
  const tween = gsap.fromTo(
    cards,
    {
      y: 80,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.3,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cards[0],
        start: "top 90%",
      },
    }
  );

  return () => {
    tween.kill();
  };
};