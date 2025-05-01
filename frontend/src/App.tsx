import { useWebSocketChat } from "./hooks/useWebSocketChat";
import MessageList from "./components/MessageList";
import ChatControls from "./components/ChatControls";
import "./App.scss";

function App() {
  const SOCKET_URL = "ws://localhost:3000"; // Connect to your backend WebSocket server

  const {
    messages,
    sendMessage,
    clearChat,
    inputMessage,
    setInputMessage,
    connecting,
    readyState,
  } = useWebSocketChat(SOCKET_URL);

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
        return "connecting-bg"; // Using disconnected as the default/fallback option
    }
  };
  const backgroundClass = getBackgroundClass();

  console.log("readyState:", readyState);

  const renderBody = () => {
    if (readyState === 1) {
      return (
        <div className="ai-chat">
          <div className="ai-chat-container">
            <MessageList messages={messages} />

            <ChatControls
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={handleSendMessage}
              onClearChat={clearChat}
              connecting={connecting}
            />
          </div>
        </div>
      );
    } else if (readyState === 3) {
      return (
        <div className="flex-center">
          <h2>Disconnected</h2>
          <p>Please check your connection or try again later.</p>
        </div>
      );
    } else {
      return (
        <div className="flex-center">
          <div className="loader"></div>
          <h2>Connecting to the AI Chat Service...</h2>
          <p>Please wait while we establish a connection.</p>
        </div>
      );
    }
  };

  return (
    <div className={`app-container ${backgroundClass}`}>{renderBody()}</div>
  );
}

export default App;
