import { useState, useEffect } from "react";
import { useWebSocketChat } from "./hooks/useWebSocketChat";
import ChatControls from "./components/ChatControls";
import { Loading } from "./components/Loading";
import { DisconnectMessage } from "./components/DisconnectMessage";
import "./App.scss";

function App() {
  const SOCKET_URL = "ws://localhost:3000"; // Connect to your backend WebSocket server
  const [lastAiMessage, setLastAiMessage] = useState<string | undefined>(
    undefined
  );

  const {
    messages,
    sendMessage,
    clearChat,
    inputMessage,
    setInputMessage,
    connecting,
    readyState,
  } = useWebSocketChat(SOCKET_URL);

  // Update last AI message whenever messages change
  useEffect(() => {
    if (messages.length === 0) {
      setLastAiMessage(undefined);
      return;
    }

    // Find the latest AI message
    const aiMessages = messages.filter((msg) => msg.sender === "ai");
    if (aiMessages.length > 0) {
      const latest = aiMessages[aiMessages.length - 1];
      setLastAiMessage(latest.text);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
    }
  };

  const getBackgroundClass = () => {
    switch (readyState) {
      case 1:
        return "connected-bg";
      case 3:
        return "disconnected-bg";
      default:
        return "connecting-bg";
    }
  };
  const backgroundClass = getBackgroundClass();

  const renderBody = () => {
    if (readyState === 1) {
      return (
        <div className="ai-chat">
          <div className="ai-chat-container">
            <ChatControls
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              connecting={connecting}
              lastAiMessage={lastAiMessage}
            />
          </div>
        </div>
      );
    } else if (readyState === 3) {
      return <DisconnectMessage />;
    } else {
      return <Loading />;
    }
  };

  return (
    <div className={`app-container`}>
      <div className={`bg-image ${backgroundClass}`} />
      <div className="content-container">{renderBody()}</div>
    </div>
  );
}

export default App;
