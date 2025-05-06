import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import "./ChatInput.scss";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { calcDynamicFontSize } from "../utils";

interface ChatInputProps {
  isLoading?: boolean;
  clearInputOnSend?: boolean;
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  isLoading,
  clearInputOnSend = false,
  onSend,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasBeenSent, setHasBeenSent] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);
  const { isDekstop1920, isDesktop1536, isDesktop1366 } = useWindowWidth();

  let scaleOptions;
  if (isDesktop1366) {
    scaleOptions = scaleOptions = {
      maxSize: 46,
      minSize: 22,
      minChars: 25,
      maxChars: 100,
    };
  } else if (isDesktop1536) {
    scaleOptions = scaleOptions = {
      maxSize: 48,
      minSize: 24,
      minChars: 25,
      maxChars: 100,
    };
  } else if (isDekstop1920) {
    scaleOptions = {
      maxSize: 60,
      minSize: 36,
      minChars: 25,
      maxChars: 100,
    };
  } else {
    scaleOptions = {
      maxSize: 60,
      minSize: 36,
      minChars: 25,
      maxChars: 100,
    };
  }

  const fontSize = calcDynamicFontSize(value, scaleOptions);

  const handlePlaceholderClick = () => {
    setIsInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    onSend(value);
    setHasBeenSent(true);
    if (clearInputOnSend) {
      setValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    if (hasBeenSent) {
      setValue("");
      setHasBeenSent(false);
    }
  };

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    el.style.height = "auto";
    const newHeight = el.scrollHeight;
    el.style.height = `${newHeight}px`;
    setScrollHeight(newHeight);
  }, [value]);

  const shouldShowInput = value !== "" || isInputFocused;

  return (
    <div
      className={cn("chat-input", { loading: isLoading })}
      aria-busy={isLoading}
    >
      {shouldShowInput ? (
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setScrollHeight(e.target.scrollHeight);
              setValue(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={() => value === "" && setIsInputFocused(false)}
            placeholder="what's in your mind?"
            disabled={isLoading}
            autoFocus
            rows={1}
            style={{ height: `${scrollHeight}px`, fontSize: `${fontSize}px` }}
          />
        </div>
      ) : (
        <div
          className="input-placeholder-container cherish-regular"
          onClick={handlePlaceholderClick}
        >
          <p>Ask Something About me</p>
        </div>
      )}
    </div>
  );
};
