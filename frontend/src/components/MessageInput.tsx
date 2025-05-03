import React, { useEffect, useRef, useState } from "react";
import "./MessageInput.scss";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isLoading?: boolean;
  placeholder?: string;
  clearInputOnSend?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
  clearInputOnSend = false,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasBeenSent, setHasBeenSent] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  const handlePlaceholderClick = () => {
    setIsInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    onSend();
    setHasBeenSent(true);
    if (clearInputOnSend) {
      onChange("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    // Clear the input when focused after sending
    if (hasBeenSent) {
      onChange("");
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

  return (
    <div className="message-input-container">
      {value != "" || isInputFocused ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setScrollHeight(e.target.scrollHeight);
            onChange(e.target.value);
          }}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={() => value === "" && setIsInputFocused(false)}
          placeholder="what's in your mind?"
          disabled={disabled}
          className="message-input"
          autoFocus
          rows={1}
          style={{ height: `${scrollHeight}px` }}
        />
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

export default MessageInput;
