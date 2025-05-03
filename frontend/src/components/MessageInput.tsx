import React, { useEffect, useRef, useState } from "react";
import "./MessageInput.scss";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isLoading?: boolean;
  placeholder?: string;
  hasConversationStarted?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
  isLoading = false,
  placeholder = "Ask something about me...",
  hasConversationStarted = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handlePlaceholderClick = () => {
    setIsInputFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="message-input-container">
      {hasConversationStarted || isInputFocused ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          onBlur={() => value === "" && setIsInputFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className="message-input"
          autoFocus
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
