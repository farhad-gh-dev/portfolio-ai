import React from "react";
import MessageInput from "./MessageInput";
import "./ChatControls.scss";

interface ChatControlsProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onClearChat: () => void;
  connecting: boolean;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  onClearChat,
  connecting,
}) => {
  return (
    <div className="ai-chat-controls">
      <button
        className="clear-chat-button"
        onClick={onClearChat}
        disabled={connecting}
      >
        Clear Chat
      </button>

      <MessageInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={onSendMessage}
        disabled={connecting}
      />
    </div>
  );
};

export default ChatControls;
