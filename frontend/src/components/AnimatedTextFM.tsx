import React from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedTextFMProps {
  text: string;
  exitDelay?: number;
  initialDelay?: number;
  style?: React.CSSProperties;
}

export const AnimatedTextFM: React.FC<AnimatedTextFMProps> = ({
  text,
  exitDelay = 0,
  initialDelay = 0,
  style,
}) => {
  const container: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: initialDelay,
      },
    },
    exit:
      exitDelay > 0
        ? { transition: { staggerChildren: 0.03, delayChildren: exitDelay } }
        : {},
  };

  const char: Variants = {
    initial: { opacity: 0, y: 20, filter: "blur(5px)" },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit:
      exitDelay > 0
        ? {
            opacity: 0,
            y: -20,
            filter: "blur(5px)",
            transition: { duration: 0.5, ease: "easeIn" },
          }
        : {},
  };

  // Split the text into sentences and words
  const words = text.split(/(\s+)/);

  return (
    <motion.p
      style={{ ...style }}
      variants={container}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={char}
          style={{ display: "inline-block" }}
        >
          {word === " " ? "\u00A0" : word}
        </motion.span>
      ))}
    </motion.p>
  );
};
