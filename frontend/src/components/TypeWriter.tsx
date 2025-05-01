import React, { useState, useEffect } from "react";
import "./TypeWriter.scss";

interface TypeWriterProps {
  text: string;
  typingSpeed?: number;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, typingSpeed = 30 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, typingSpeed]);

  return (
    <span className={`typewriter ${isComplete ? "complete" : ""}`}>
      {displayedText}
      {!isComplete && <span className="cursor"></span>}
    </span>
  );
};

export default TypeWriter;
