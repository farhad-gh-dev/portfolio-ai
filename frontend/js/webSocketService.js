// WebSocket service for communication with the server
import { CONFIG } from "./config.js";

/**
 * Creates and manages WebSocket connection to the server
 * @param {Object} params - Parameters for WebSocket service
 * @param {Function} params.onMessage - Callback for handling messages
 * @param {Function} params.onConnectionChange - Callback for connection status changes
 * @returns {Object} WebSocket service methods
 */
export function createWebSocketService({ onMessage, onConnectionChange }) {
  let socket = null;
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  /**
   * Initialize WebSocket connection
   */
  function initialize() {
    try {
      socket = new WebSocket(CONFIG.WEBSOCKET_URL);
      setEventListeners();
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      handleReconnect();
    }
  }

  /**
   * Set up WebSocket event listeners
   */
  function setEventListeners() {
    socket.addEventListener("open", () => {
      reconnectAttempts = 0;
      onConnectionChange({
        status: "connected",
        message: "Connected to server",
      });
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing message:", error);
        onMessage({ error: "Error processing response from server" });
      }
    });

    socket.addEventListener("close", (event) => {
      onConnectionChange({
        status: "disconnected",
        message: event.wasClean
          ? "Disconnected from server"
          : "Connection lost",
      });
      handleReconnect();
    });

    socket.addEventListener("error", () => {
      onConnectionChange({ status: "error", message: "Connection error" });
    });
  }

  /**
   * Handle reconnection attempts
   */
  function handleReconnect() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      const delay = RECONNECT_DELAY * reconnectAttempts;

      onConnectionChange({
        status: "reconnecting",
        message: `Reconnecting (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`,
      });

      setTimeout(() => {
        initialize();
      }, delay);
    } else {
      onConnectionChange({
        status: "failed",
        message: "Could not reconnect to server. Please refresh the page.",
      });
    }
  }

  /**
   * Send data to the server
   * @param {Object} data - Data to send to the server
   * @returns {boolean} - Whether the send was successful
   */
  function send(data) {
    if (isConnected()) {
      try {
        socket.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    }
    return false;
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean} - Whether the WebSocket is connected
   */
  function isConnected() {
    return socket && socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current connection state
   * @returns {string} - The current connection state
   */
  function getState() {
    if (!socket) return "uninitialized";

    const states = {
      [WebSocket.CONNECTING]: "connecting",
      [WebSocket.OPEN]: "open",
      [WebSocket.CLOSING]: "closing",
      [WebSocket.CLOSED]: "closed",
    };

    return states[socket.readyState] || "unknown";
  }

  // Initialize WebSocket connection
  initialize();

  // Return public methods
  return {
    send,
    isConnected,
    getState,
  };
}
