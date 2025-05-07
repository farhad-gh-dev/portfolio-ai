import { useWebSocketChat } from "./hooks/useWebSocketChat";
import { ChatLayout } from "./components/ChatLayout";
import { ConnectionLostScreen } from "./components/ConnectionLostScreen";
import { ChatInput } from "./components/ChatInput";
import { ResponseDisplay } from "./components/ResponseDisplay";
import { CONNECTION_STATES, SOCKET_URL, TEXTS } from "./constants";
import "./App.scss";

function App() {
  const { readyState, lastResponse, isLoading, sendMessage } =
    useWebSocketChat(SOCKET_URL);

  const isDisconnected = readyState === CONNECTION_STATES.CLOSED;
  const isConnecting = readyState === CONNECTION_STATES.CONNECTING;

  return (
    <main className="app-container">
      {!isDisconnected ? (
        <ChatLayout
          isConnecting={isConnecting}
          inputComponent={
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          }
          answerComponent={<ResponseDisplay response={lastResponse} />}
        />
      ) : (
        <ConnectionLostScreen />
      )}
      <footer className="copyright">
        <span>{TEXTS.footer}</span>
      </footer>
    </main>
  );
}

export default App;
