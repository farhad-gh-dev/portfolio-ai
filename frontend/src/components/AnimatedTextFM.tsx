import React from "react";
import { motion } from "framer-motion";
import {
  TEXT_CONTAINER_ANIMATION,
  TEXT_WORD_ANIMATION,
} from "../constants/animations";

interface AnimatedTextFMProps {
  text: string;
  exitDelay?: number;
  initialDelay?: number;
  style?: React.CSSProperties;
}

export const AnimatedTextFM: React.FC<AnimatedTextFMProps> = ({
  text,
  style,
}) => {
  const words = text.split(/(\s+)/);

  return (
    <motion.p
      style={{ ...style }}
      variants={TEXT_CONTAINER_ANIMATION}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={TEXT_WORD_ANIMATION}
          className="display-inline-block"
        >
          {word === " " ? "\u00A0" : word}
        </motion.span>
      ))}
    </motion.p>
  );
};
