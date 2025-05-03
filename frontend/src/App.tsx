import { useState, useEffect } from "react";
import { useWebSocketChat } from "./hooks/useWebSocketChat";
import ChatControls from "./components/ChatControls";
import { Loading } from "./components/Loading";
import { DisconnectMessage } from "./components/DisconnectMessage";
import "./App.scss";
import { BackgroundContainer } from "./components/BackgroundContainer";

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

    console.log("Messages:", messages);
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
    }
  };

  const renderBody = () => {
    if (readyState === 1) {
      return (
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
      );
    } else if (readyState === 3) {
      return <DisconnectMessage />;
    } else {
      return <Loading />;
    }
  };

  return (
    <div className="app-container">
      <BackgroundContainer readyState={readyState} />
      <div className="content-container">{renderBody()}</div>
      <div className="copyright">
        <span>Designed and Developed by Farhad</span>
      </div>
    </div>
  );
}

export default App;
