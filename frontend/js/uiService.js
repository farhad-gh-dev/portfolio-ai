// UI service for managing DOM interactions and updates
import { CONFIG } from "./config.js";

/**
 * Creates a UI service to manage DOM interactions
 * @param {Object} elements - DOM elements
 * @returns {Object} UI service methods
 */
export function createUIService(elements) {
  // Store temporary message display timeouts
  const timeouts = {
    messageTimeout: null,
  };

  /**
   * Add a message to the chat container
   * @param {string} sender - The sender of the message
   * @param {string} text - The message text
   * @param {string} className - CSS class for styling
   */
  function addMessage(sender, text, className) {
    // Move typing indicator to the end
    elements.chatContainer.appendChild(elements.typingIndicator);

    const messageElement = document.createElement("div");
    messageElement.className = className;

    // Use safer DOM methods instead of innerHTML
    const senderElement = document.createElement("strong");
    senderElement.textContent = `${sender}: `;

    const textNode = document.createTextNode(text);

    messageElement.appendChild(senderElement);
    messageElement.appendChild(textNode);

    // Add timestamp (optional)
    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = new Date().toLocaleTimeString();
    messageElement.appendChild(timestamp);

    elements.chatContainer.insertBefore(
      messageElement,
      elements.typingIndicator
    );

    // Auto scroll to bottom
    scrollToBottom();
  }

  /**
   * Scroll chat container to the bottom
   */
  function scrollToBottom() {
    elements.chatContainer.scrollTop = elements.chatContainer.scrollHeight;
  }

  /**
   * Set connection status display
   * @param {string} status - Connection status message
   */
  function setConnectionStatus(status) {
    elements.statusDisplay.textContent = `Status: ${status}`;

    // Optional: Add visual indicator of connection state
    const statusClasses = [
      "connected",
      "disconnected",
      "error",
      "reconnecting",
    ];
    statusClasses.forEach((cls) =>
      elements.statusDisplay.classList.remove(cls)
    );

    const className = status.toLowerCase().replace(/\s+/g, "-");
    if (statusClasses.includes(className)) {
      elements.statusDisplay.classList.add(className);
    }
  }

  /**
   * Set the speech status display with auto timeout
   * @param {string} message - Status message
   * @param {boolean} isError - Whether this is an error message
   * @param {number} duration - How long to display the message (ms)
   */
  function setSpeechStatus(message, isError = false, duration = 0) {
    // Clear any existing timeout
    if (timeouts.messageTimeout) {
      clearTimeout(timeouts.messageTimeout);
    }

    elements.speechStatus.textContent = message;

    if (isError) {
      elements.speechStatus.classList.add("error");
    } else {
      elements.speechStatus.classList.remove("error");
    }

    // Set timeout to clear message if duration is provided
    if (duration > 0) {
      timeouts.messageTimeout = setTimeout(() => {
        elements.speechStatus.textContent = "";
        elements.speechStatus.classList.remove("error");
      }, duration);
    }
  }

  /**
   * Update speech recognition UI state
   * @param {boolean} isRecording - Whether recording is active
   * @param {boolean} continuousMode - Whether continuous mode is active
   */
  function updateRecordingState(isRecording, continuousMode) {
    if (isRecording) {
      elements.micButton.classList.add("recording");

      if (continuousMode) {
        elements.micButton.classList.add("continuous");
        elements.continuousModeDisplay.textContent =
          "Continuous Mode: ON - Click mic to turn off";
      }
    } else {
      elements.micButton.classList.remove("recording");
      elements.micButton.classList.remove("continuous");
      elements.continuousModeDisplay.textContent = "";
    }
  }

  /**
   * Show or hide the typing indicator
   * @param {boolean} isVisible - Whether the typing indicator should be visible
   */
  function setTypingIndicatorVisibility(isVisible) {
    elements.typingIndicator.style.display = isVisible ? "flex" : "none";
  }

  /**
   * Set the mic button enabled/disabled state
   * @param {boolean} isEnabled - Whether the mic button should be enabled
   */
  function setMicButtonEnabled(isEnabled) {
    elements.micButton.disabled = !isEnabled;
  }

  /**
   * Set the input field value
   * @param {string} value - The value to set
   */
  function setInputValue(value) {
    elements.messageInput.value = value;
  }

  /**
   * Get the input field value
   * @returns {string} The current input value
   */
  function getInputValue() {
    return elements.messageInput.value;
  }

  /**
   * Clear the input field
   */
  function clearInput() {
    elements.messageInput.value = "";
  }

  // Return public methods
  return {
    addMessage,
    setConnectionStatus,
    setSpeechStatus,
    updateRecordingState,
    setTypingIndicatorVisibility,
    setMicButtonEnabled,
    setInputValue,
    getInputValue,
    clearInput,
    scrollToBottom,
  };
}
