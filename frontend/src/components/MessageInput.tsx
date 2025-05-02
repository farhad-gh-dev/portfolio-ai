import React, { useEffect, useRef } from "react";
import "./MessageInput.scss";
import TypeWriter from "./TypeWriter";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isAnswerMode?: boolean;
  answerText?: string;
  onAnswerClick?: () => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
  isAnswerMode = false,
  answerText = "",
  onAnswerClick,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when component mounts or switches back to input mode
    if (!isAnswerMode && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isAnswerMode, isLoading]);

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="message-input-container loading-container">
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    );
  }

  // Show answer that can be clicked to go back to input
  if (isAnswerMode && answerText) {
    return (
      <div
        className="message-input-container answer-mode"
        onClick={onAnswerClick}
      >
        <div className="message-answer">
          <TypeWriter text={answerText} />
        </div>
      </div>
    );
  }

  // Default input mode
  return (
    <div className="message-input-container">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSend()}
        placeholder=""
        disabled={disabled}
        className="message-input"
        autoFocus
      />
    </div>
  );
};

export default MessageInput;
