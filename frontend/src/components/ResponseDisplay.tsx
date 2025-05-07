import React from "react";
import { TEXTS } from "../constants";
import { calcDynamicFontSize } from "../utils";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { AnimatePresence, motion } from "motion/react";
import {
  RESPONSE_ANIMATION,
  RESPONSE_PLACEHOLDER_ANIMATION,
} from "../constants/animations";
import type { Message } from "../types";
import "./ResponseDisplay.scss";

interface ResponseDisplayProps {
  response?: Message | null;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
}) => {
  const { isDekstop1920, isDesktop1536, isDesktop1366 } = useWindowWidth();
  const text = response?.text || "";

  let scaleOptions;
  if (isDesktop1366) {
    scaleOptions = {
      maxSize: 48,
      minSize: 20,
      maxChars: 100,
    };
  } else if (isDesktop1536) {
    scaleOptions = {
      maxSize: 52,
      minSize: 20,
      maxChars: 100,
    };
  } else if (isDekstop1920) {
    scaleOptions = {
      maxSize: 60,
      minSize: 24,
      maxChars: 100,
    };
  } else {
    scaleOptions = {
      maxSize: 60,
      minSize: 26,
      maxChars: 260,
    };
  }

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
            <p
              style={{
                fontSize: `${fontSize}px`,
              }}
            >
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
