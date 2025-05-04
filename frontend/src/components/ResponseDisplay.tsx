import React from "react";
import { TEXTS } from "../constants";
import "./ResponseDisplay.scss";

interface ResponseDisplayProps {
  text?: string;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ text }) => {
  return (
    <div className="response-display">
      {!text ? (
        <div className="response-placeholder cherish-regular">
          <p>{TEXTS.responsePlaceholder}</p>
        </div>
      ) : (
        <div className="response-content">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};
