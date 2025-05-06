import React from "react";
import { TEXTS } from "../constants";
import { calcDynamicFontSize } from "../utils";
import { useWindowWidth } from "../hooks/useWindowWidth";
import "./ResponseDisplay.scss";

interface ResponseDisplayProps {
  text?: string;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  text = "",
}) => {
  const { isDekstop1920, isDesktop1536, isDesktop1366 } = useWindowWidth();

  let scaleOptions;
  if (isDesktop1366) {
    scaleOptions = scaleOptions = {
      maxSize: 48,
      minSize: 20,
      maxChars: 100,
    };
  } else if (isDesktop1536) {
    scaleOptions = scaleOptions = {
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
      minSize: 24,
      maxChars: 150,
    };
  }

  const fontSize = calcDynamicFontSize(text, scaleOptions);
  return (
    <div className="response-display">
      {!text ? (
        <div className="response-placeholder cherish-regular">
          <p>{TEXTS.responsePlaceholder}</p>
        </div>
      ) : (
        <div className="response-content">
          <p
            style={{
              fontSize: `${fontSize}px`,
            }}
          >
            {text}
          </p>
        </div>
      )}
    </div>
  );
};
