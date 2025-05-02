import { Message } from "../types";
import MessageList from "./MessageList";
import "./ChatLayout.scss";

export const ChatLayout: React.FC<{
  messages: Message[];
  children: React.ReactNode;
}> = ({ messages, children }) => {
  return (
    <div className="ai-chat">
      <div className="ai-chat-container">
        {messages.length > 0 && <MessageList messages={messages} />}
        {children}
      </div>
    </div>
  );
};
