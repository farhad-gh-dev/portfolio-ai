import { useState, useEffect, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { Message, WebSocketResponse } from "../types";

interface UseWebSocketChatResult {
  readyState: number;
  messages: Message[];
  lastResponse: string;
  isLoading: boolean;
  sendMessage: (text: string) => void;
}

export const useWebSocketChat = (socketUrl: string): UseWebSocketChatResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    sendMessage: sendWebSocketMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
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
          setLastResponse(data.message);
          setMessages((prev) => [
            ...prev,
            {
              text: data.message,
              sender: "ai",
              timestamp: data.timestamp,
            },
          ]);
          setIsLoading(false); // Set loading to false when response is received
        } else if (data.type === "system_message") {
          setMessages((prev) => [
            ...prev,
            {
              text: data.message,
              sender: "system",
              timestamp: data.timestamp,
            },
          ]);
          setIsLoading(false); // Set loading to false for system messages too
        } else if (data.error) {
          setMessages((prev) => [
            ...prev,
            {
              text: `Error: ${data.error}`,
              sender: "system",
              timestamp: new Date().toISOString(),
            },
          ]);
          setIsLoading(false); // Set loading to false when error occurs
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setIsLoading(false); // Set loading to false on parsing errors
      }
    }
  }, [lastMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      if (text.trim() === "") return;

      setIsLoading(true);

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
    },
    [messages, clientId, sendWebSocketMessage]
  );

  return {
    readyState,
    messages,
    lastResponse,
    isLoading,
    sendMessage,
  };
};
