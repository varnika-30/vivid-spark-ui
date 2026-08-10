import type { Transition, Variants } from "motion/react";

export const spring: Transition = { type: "spring", stiffness: 320, damping: 30, mass: 0.8 };
export const softSpring: Transition = { type: "spring", stiffness: 180, damping: 24 };
export const ease: Transition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: ease },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.28 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: ease },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: spring },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

export const stagger = (staggerChildren = 0.07, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
});

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, scale: 0.995, transition: { duration: 0.25 } },
};

export const hoverLift = {
  whileHover: { y: -4, transition: spring },
  whileTap: { scale: 0.985 },
};
