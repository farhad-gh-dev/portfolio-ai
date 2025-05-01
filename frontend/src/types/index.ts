export interface Message {
  text: string;
  sender: "user" | "ai" | "system";
  timestamp: string;
}

export interface WebSocketResponse {
  type: "connection_established" | "text_response" | "system_message";
  message: string;
  timestamp: string;
  clientId?: string;
  error?: string;
}
