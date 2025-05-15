export const RESPONSE_PLACEHOLDER_ANIMATION = {
  initial: { opacity: 0, y: +50 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -50,
    transition: { duration: 0.3, ease: "easeIn" },
  },
  transition: { duration: 0.7, ease: "easeOut" },
};

export const RESPONSE_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const INPUT_PLACEHOLDER_ANIMATION = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: +50,
    transition: { duration: 0.3, ease: "easeIn" },
  },
  transition: { duration: 0.7, ease: "easeOut" },
};

export const INPUT_ANIMATIONS = {
  initial: { opacity: 0, y: +50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const TEXT_CONTAINER_ANIMATION = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
  exit: {},
};

export const TEXT_WORD_ANIMATION = {
  initial: { opacity: 0, y: 20, filter: "blur(5px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {},
};
