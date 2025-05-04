import React from "react";
import "./ChatInterface.scss";

interface ChatLayoutProps {
  inputComponent?: React.ReactNode;
  answerComponent?: React.ReactNode;
  isConnecting?: boolean;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({
  inputComponent,
  answerComponent,
  isConnecting,
}) => {
  return (
    <div className="chat-interface">
      {!isConnecting ? (
        <div className="split-layout">
          {inputComponent}
          <div className="split-border" />
          {answerComponent}
        </div>
      ) : (
        <div className="flex-center">
          <div className="loader"></div>
          <h2>Connecting to the AI Chat Service...</h2>
          <p>Please wait while we establish a connection.</p>
        </div>
      )}
    </div>
  );
};
