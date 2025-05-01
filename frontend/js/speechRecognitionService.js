// Speech recognition service for voice-to-text functionality
import { CONFIG } from "./config.js";

/**
 * Creates and manages speech recognition functionality
 * @param {Object} params - Parameters for speech recognition service
 * @param {Function} params.onTranscript - Callback when new transcript is available
 * @param {Function} params.onStateChange - Callback for state changes
 * @param {Function} params.onError - Callback for errors
 * @returns {Object} Speech recognition service methods
 */
export function createSpeechRecognitionService({
  onTranscript,
  onStateChange,
  onError,
}) {
  // Feature detection for speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // State management
  const state = {
    isRecording: false,
    continuousMode: false,
    silenceTimeout: null,
    lastTranscript: "",
    finalTranscriptSent: true,
  };

  // Check if browser supports speech recognition
  if (!SpeechRecognition) {
    onError("Speech recognition not supported in this browser.");
    // Return limited interface for unsupported browsers
    return {
      isSupported: false,
      toggleRecording: () => onError("Speech recognition not supported"),
      isContinuousModeActive: () => false,
    };
  }

  // Create recognition instance
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = CONFIG.SPEECH_LANG;

  /**
   * Clear transcripts without restarting recognition
   */
  function clearTranscripts() {
    state.lastTranscript = "";
    state.finalTranscriptSent = true;
    return true;
  }

  /**
   * Set up recognition event handlers
   */
  function setupEventHandlers() {
    recognition.onstart = function () {
      state.isRecording = true;
      state.continuousMode = true;

      onStateChange({
        status: "recording",
        continuousMode: true,
        message: "Listening...",
      });
    };

    recognition.onresult = function (event) {
      // Get the current transcript from the latest result only
      let currentTranscript = "";

      // We only want the most recent result to avoid accumulation
      if (event.results.length > 0) {
        const latestResult = event.results[event.results.length - 1];
        currentTranscript = latestResult[0].transcript;
      }

      // Notify about interim transcript for display
      onTranscript({
        text: currentTranscript,
        isFinal: false,
      });

      // Check if we have a final result
      const isFinal =
        event.results.length > 0 &&
        event.results[event.results.length - 1].isFinal;

      // Handle silence detection and final results
      handleTranscriptProcessing(currentTranscript, isFinal);
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error", event.error);

      // Only treat some errors as fatal
      const fatalErrors = [
        "not-allowed",
        "service-not-allowed",
        "network",
        "aborted",
      ];

      if (fatalErrors.includes(event.error)) {
        stopRecording();
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = function () {
      // Restart recognition if in continuous mode and not manually stopped
      if (state.isRecording) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Could not restart recognition:", e);

          // Try again after a short delay
          setTimeout(() => {
            if (state.isRecording) {
              try {
                recognition.start();
              } catch (error) {
                console.error(
                  "Failed to restart recognition after delay:",
                  error
                );
                stopRecording();
                onError("Failed to restart speech recognition");
              }
            }
          }, 100);
        }
      } else {
        stopRecording();
      }
    };
  }

  /**
   * Process transcript to determine if it should be sent
   * @param {string} currentTranscript - Current speech transcript
   * @param {boolean} isFinal - Whether this is a final transcript from the recognition engine
   */
  function handleTranscriptProcessing(currentTranscript, isFinal) {
    // Clear any existing timeout
    if (state.silenceTimeout) {
      clearTimeout(state.silenceTimeout);
    }

    if (isFinal && currentTranscript !== state.lastTranscript) {
      // If we have a new final transcript that hasn't been sent
      if (currentTranscript.trim()) {
        onTranscript({
          text: currentTranscript.trim(),
          isFinal: true,
        });

        state.lastTranscript = currentTranscript;
        state.finalTranscriptSent = true;
        clearTranscripts();
      }
    } else if (currentTranscript !== state.lastTranscript) {
      // Set a timeout to consider the user done speaking after a pause
      state.silenceTimeout = setTimeout(() => {
        if (currentTranscript.trim() && !state.finalTranscriptSent) {
          onTranscript({
            text: currentTranscript.trim(),
            isFinal: true,
          });

          state.lastTranscript = currentTranscript;
          state.finalTranscriptSent = true;
          clearTranscripts();
        }
      }, CONFIG.SILENCE_TIMEOUT);

      state.finalTranscriptSent = false;
    }
  }

  /**
   * Toggle recording state (start/stop)
   * @param {boolean} isWaitingForResponse - Whether system is waiting for response
   * @returns {boolean} - Whether operation was successful
   */
  function toggleRecording(isWaitingForResponse) {
    if (state.isRecording) {
      return stopRecording();
    } else {
      return startRecording(isWaitingForResponse);
    }
  }

  /**
   * Start speech recognition
   * @param {boolean} isWaitingForResponse - Whether system is waiting for response
   * @returns {boolean} - Whether operation was successful
   */
  function startRecording(isWaitingForResponse) {
    if (isWaitingForResponse) {
      onError("Please wait for AI response before speaking again");
      return false;
    }

    clearTranscripts();

    try {
      recognition.start();
      return true;
    } catch (e) {
      console.error("Error starting recognition:", e);
      state.isRecording = false;
      onError("Error starting speech recognition. Please try again.");
      return false;
    }
  }

  /**
   * Stop speech recognition
   * @returns {boolean} - Whether operation was successful
   */
  function stopRecording() {
    state.isRecording = false;
    state.continuousMode = false;

    onStateChange({
      status: "stopped",
      continuousMode: false,
      message: "",
    });

    if (state.silenceTimeout) {
      clearTimeout(state.silenceTimeout);
      state.silenceTimeout = null;
    }

    try {
      recognition.stop();
      return true;
    } catch (e) {
      console.error("Error stopping recognition:", e);
      return false;
    }
  }

  /**
   * Check if recording is active
   * @returns {boolean} - Whether recording is active
   */
  function isRecording() {
    return state.isRecording;
  }

  /**
   * Check if continuous mode is active
   * @returns {boolean} - Whether continuous mode is active
   */
  function isContinuousModeActive() {
    return state.continuousMode;
  }

  // Set up event handlers
  setupEventHandlers();

  // Return public methods
  return {
    isSupported: true,
    toggleRecording,
    isRecording,
    isContinuousModeActive,
    clearTranscripts,
  };
}
