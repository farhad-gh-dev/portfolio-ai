import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  disabled,
}) => {
  return (
    <div className="message-input-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && onSend()}
        placeholder="Type your message here..."
        disabled={disabled}
        className="message-input"
      />
      <button
        className="send-button"
        onClick={onSend}
        disabled={disabled || value.trim() === ""}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
