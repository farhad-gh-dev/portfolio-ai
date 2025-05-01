// Main application script - serves as the entry point
import { CONFIG } from "./config.js";
import { createWebSocketService } from "./webSocketService.js";
import { createSpeechRecognitionService } from "./speechRecognitionService.js";
import { createUIService } from "./uiService.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const elements = {
    chatContainer: document.getElementById("chat-container"),
    messageForm: document.getElementById("message-form"),
    messageInput: document.getElementById("message-input"),
    statusDisplay: document.getElementById("status"),
    micButton: document.getElementById("mic-button"),
    speechStatus: document.getElementById("speech-status"),
    clearChatButton: document.getElementById("clear-chat"),
    typingIndicator: document.getElementById("typing-indicator"),
    continuousModeDisplay: document.getElementById("continuous-mode"),
  };

  // Application state
  const state = {
    clientId: null,
    isWaitingForResponse: false,
  };

  // Initialize UI service
  const uiService = createUIService(elements);

  // Initialize WebSocket service
  const socketService = createWebSocketService({
    onMessage: handleServerMessage,
    onConnectionChange: handleConnectionChange,
  });

  // Initialize Speech Recognition service
  const speechService = createSpeechRecognitionService({
    onTranscript: handleTranscript,
    onStateChange: handleSpeechStateChange,
    onError: handleSpeechError,
  });

  // Set up event listeners
  function setupEventListeners() {
    elements.messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = uiService.getInputValue().trim();
      if (message) {
        sendMessage(message);
      }
    });

    elements.clearChatButton.addEventListener("click", () => {
      if (socketService.isConnected() && state.clientId) {
        socketService.send({
          action: "clear_conversation",
        });
      }
    });

    elements.micButton.addEventListener("click", () => {
      speechService.toggleRecording(state.isWaitingForResponse);
    });
  }

  /**
   * Handle messages from the server
   * @param {Object} data - Message data from server
   */
  function handleServerMessage(data) {
    // Hide typing indicator
    uiService.setTypingIndicatorVisibility(false);
    state.isWaitingForResponse = false;

    // Enable mic button
    uiService.setMicButtonEnabled(true);

    if (data.error) {
      uiService.addMessage("System", `Error: ${data.error}`, "system-message");
      return;
    }

    // Process different message types from server
    switch (data.type) {
      case "text_response":
        uiService.addMessage("AI", data.message, "ai-message");

        // In continuous mode, clear transcripts for the next speech segment
        if (
          speechService.isContinuousModeActive() &&
          speechService.isRecording()
        ) {
          speechService.clearTranscripts();
        }
        break;

      case "connection_established":
        uiService.addMessage("System", data.message, "system-message");

        // Store clientId from server
        if (data.clientId) {
          state.clientId = data.clientId;
          console.log(`Client ID received: ${state.clientId}`);
        }
        break;

      case "system_message":
        uiService.addMessage("System", data.message, "system-message");
        break;

      default:
        console.warn("Unknown message type received:", data.type);
    }
  }

  /**
   * Handle connection state changes
   * @param {Object} connectionState - Connection state information
   */
  function handleConnectionChange(connectionState) {
    uiService.setConnectionStatus(connectionState.status);
    uiService.addMessage("System", connectionState.message, "system-message");

    if (connectionState.status !== "connected") {
      state.isWaitingForResponse = false;
    }
  }

  /**
   * Handle transcript from speech recognition
   * @param {Object} transcriptData - Transcript data
   */
  function handleTranscript(transcriptData) {
    // Update input field with interim results
    uiService.setInputValue(transcriptData.text);

    // Handle final transcript
    if (transcriptData.isFinal && !state.isWaitingForResponse) {
      sendMessage(transcriptData.text);

      // Clear the input field after a short delay
      setTimeout(() => {
        uiService.clearInput();
      }, 500);
    }
  }

  /**
   * Handle speech recognition state changes
   * @param {Object} speechState - Speech recognition state
   */
  function handleSpeechStateChange(speechState) {
    uiService.updateRecordingState(
      speechState.status === "recording",
      speechState.continuousMode
    );

    if (speechState.message) {
      uiService.setSpeechStatus(speechState.message);
    }
  }

  /**
   * Handle speech recognition errors
   * @param {string} errorMessage - Error message
   */
  function handleSpeechError(errorMessage) {
    uiService.setSpeechStatus(
      errorMessage,
      true,
      CONFIG.ERROR_MESSAGE_DURATION
    );
  }

  /**
   * Send a message to the server
   * @param {string} message - The message to send
   */
  function sendMessage(message) {
    if (socketService.isConnected() && !state.isWaitingForResponse) {
      // Display user message
      uiService.addMessage("You", message, "user-message");

      // Show typing indicator
      uiService.setTypingIndicatorVisibility(true);
      state.isWaitingForResponse = true;

      // Disable mic button while waiting for response
      uiService.setMicButtonEnabled(false);

      // Send message to server
      socketService.send({
        text: message,
        clientId: state.clientId,
      });

      // Clear input
      uiService.clearInput();
    }
  }

  // Initialize the application
  setupEventListeners();
});
