import { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { Message, WebSocketResponse } from "../types";

interface UseWebSocketChatResult {
  messages: Message[];
  sendMessage: (text: string) => void;
  clearChat: () => void;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  connecting: boolean;
  connectionStatus: string;
  readyState: number;
}

export const useWebSocketChat = (socketUrl: string): UseWebSocketChatResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);

  const {
    sendMessage: sendWebSocketMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("WebSocket connection established");
      setConnecting(false);
    },
    onClose: () => {
      console.log("WebSocket connection closed");
      setConnecting(true);
    },
    onError: (event) => {
      console.error("WebSocket error:", event);
      setConnecting(true);
    },
    reconnectAttempts: 10,
    reconnectInterval: 2000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data) as WebSocketResponse;
        console.log("Received message:", data);

        if (data.type === "connection_established") {
          setClientId(data.clientId ?? null);
          setMessages((prev) => [
            ...prev,
            {
              text: data.message,
              sender: "system",
              timestamp: data.timestamp,
            },
          ]);
        } else if (data.type === "text_response") {
          setMessages((prev) => [
            ...prev,
            {
              text: data.message,
              sender: "ai",
              timestamp: data.timestamp,
            },
          ]);
        } else if (data.type === "system_message") {
          setMessages((prev) => [
            ...prev,
            {
              text: data.message,
              sender: "system",
              timestamp: data.timestamp,
            },
          ]);
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              text: `Error: ${data.error}`,
              sender: "system",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      if (text.trim() === "") return;

      // Add user message to chat
      const timestamp = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        {
          text,
          sender: "user",
          timestamp,
        },
      ]);

      // Send message to server with correctly formatted history
      const historyForGemini = messages
        .filter((msg) => msg.sender === "user" || msg.sender === "ai")
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        }));

      sendWebSocketMessage(
        JSON.stringify({
          text,
          clientId,
          ...(historyForGemini.length > 0 && { history: historyForGemini }),
        })
      );

      // Removed the line: setInputMessage("");
      // The input is now managed by the MessageInput component
    },
    [messages, clientId, sendWebSocketMessage]
  );

  const clearChat = useCallback(() => {
    sendWebSocketMessage(
      JSON.stringify({
        action: "clear_conversation",
        clientId,
      })
    );
  }, [clientId, sendWebSocketMessage]);

  const connectionStatusMap: { [key: number]: string } = {
    [WebSocket.CONNECTING]: "connecting",
    [WebSocket.OPEN]: "connected",
    [WebSocket.CLOSING]: "closing",
    [WebSocket.CLOSED]: "disconnected",
  };

  const connectionStatus = connectionStatusMap[readyState] ?? "Unknown";

  return {
    messages,
    sendMessage,
    clearChat,
    inputMessage,
    setInputMessage,
    connecting,
    connectionStatus,
    readyState,
  };
};
