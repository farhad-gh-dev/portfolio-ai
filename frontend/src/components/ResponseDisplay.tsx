import React from "react";
import { RESPONSE_FONT_SCALE_OPTIONS, TEXTS } from "../constants";
import { calcDynamicFontSize } from "../utils";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { AnimatePresence, motion } from "motion/react";
import {
  RESPONSE_ANIMATION,
  RESPONSE_PLACEHOLDER_ANIMATION,
} from "../constants/animations";
import type { Message } from "../types";
import "./ResponseDisplay.scss";
import { AnimatedTextFM } from "./AnimatedTextFM";

interface ResponseDisplayProps {
  response?: Message | null;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
}) => {
  const { currentSize } = useWindowWidth();
  const text = response?.text || "";

  const scaleOptions =
    RESPONSE_FONT_SCALE_OPTIONS[
      currentSize as keyof typeof RESPONSE_FONT_SCALE_OPTIONS
    ];

  const fontSize = calcDynamicFontSize(text, scaleOptions);
  return (
    <div className="response-display">
      <AnimatePresence mode="wait">
        {!text ? (
          <motion.div
            key="placeholder"
            className="response-placeholder cherish-regular"
            {...RESPONSE_PLACEHOLDER_ANIMATION}
          >
            <p>{TEXTS.responsePlaceholder}</p>
          </motion.div>
        ) : (
          <motion.div
            key={response?.timestamp}
            className="response-content"
            {...RESPONSE_ANIMATION}
          >
            <AnimatedTextFM text={text} style={{ fontSize: `${fontSize}px` }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
