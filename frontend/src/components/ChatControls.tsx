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
  const [isAnswerMode, setIsAnswerMode] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // When a new AI message comes in, switch to answer mode and clear loading state
  useEffect(() => {
    if (lastAiMessage) {
      setCurrentAnswer(lastAiMessage);
      setIsAnswerMode(true);
      setIsLoading(false);
    }
  }, [lastAiMessage]);

  const handleAnswerClick = () => {
    setIsAnswerMode(false);
    setInputMessage(""); // Clear input when going back to input mode
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setIsLoading(true); // Set loading state when message is sent
      onSendMessage();
    }
  };

  return (
    <div className="ai-chat-controls centered-control">
      <MessageInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSendMessage}
        disabled={connecting || isLoading}
        isAnswerMode={isAnswerMode}
        answerText={currentAnswer}
        onAnswerClick={handleAnswerClick}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatControls;
