import React, { useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import "./ChatControls.scss";

interface ChatControlsProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onClearChat: () => void;
  connecting: boolean;
  lastAiMessage?: string;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  connecting,
  lastAiMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [hasConversationStarted, setHasConversationStarted] = useState(false);

  // When a new AI message comes in, set it as current answer and clear loading state
  useEffect(() => {
    if (lastAiMessage) {
      setCurrentAnswer(lastAiMessage);
      setIsLoading(false);
      setHasConversationStarted(true);
    }
  }, [lastAiMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setIsLoading(true); // Set loading state when message is sent
      onSendMessage();
    }
  };

  return (
    <div className="split-layout">
      <div className="chat-side input-side">
        <MessageInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={connecting || isLoading}
          isLoading={isLoading}
          placeholder="Ask something about me..."
          hasConversationStarted={hasConversationStarted}
        />
      </div>
      <div className="split-border"></div>
      <div className="chat-side answer-side">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        ) : currentAnswer ? (
          <div className="answer-container">
            <div className="message-answer">{currentAnswer}</div>
          </div>
        ) : (
          <div className="answer-placeholder cherish-regular">
            <p>And the Answer might Surprise you</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatControls;
