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

  useEffect(() => {
    if (lastAiMessage) {
      setCurrentAnswer(lastAiMessage);
      setIsLoading(false);
    }
  }, [lastAiMessage]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setIsLoading(true);
      onSendMessage();
    }
  };

  return (
    <div className="split-layout">
      <div
        className={`chat-side input-side ${isLoading ? "loading-answer" : ""}`}
      >
        <MessageInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={connecting || isLoading}
          isLoading={isLoading}
          placeholder="Ask something about me..."
        />
      </div>
      <div className="split-border"></div>
      <div className="chat-side answer-side">
        {currentAnswer ? (
          <div className={"answer-container"}>
            <p className="message-answer">{currentAnswer}</p>
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
