export const SOCKET_URL = "ws://localhost:3000";

export const CONNECTION_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const TEXTS = {
  footer: "Designed and Developed by Farhad",
  responsePlaceholder: "And the Answer might Surprise you",
  questionPlaceholder: "what's in your mind?",
  inputPlaceholder: "Ask Something About me",
  textareaPlaceholder: "what's in your mind?",
  connectingToApi: "Connecting to the AI Chat Service...",
  pleaseWait: "Please wait while we establish a connection.",
  disconnected: "Disconnected",
  checkYourConnection: "Please check your connection or try again later.",
};

export const RESPONSE_FONT_SCALE_OPTIONS = {
  desktop1920: { maxSize: 60, minSize: 24, maxChars: 100 },
  desktop1536: { maxSize: 52, minSize: 20, maxChars: 100 },
  desktop1366: { maxSize: 48, minSize: 20, maxChars: 100 },
  default: { maxSize: 60, minSize: 26, maxChars: 260 },
} as const;

export const INPUT_FONT_SCALE_OPTIONS = {
  desktop1920: {
    maxSize: 60,
    minSize: 36,
    minChars: 25,
    maxChars: 100,
  },
  desktop1536: {
    maxSize: 48,
    minSize: 28,
    minChars: 25,
    maxChars: 100,
  },
  desktop1366: {
    maxSize: 46,
    minSize: 22,
    minChars: 25,
    maxChars: 100,
  },
  default: {
    maxSize: 60,
    minSize: 36,
    minChars: 25,
    maxChars: 100,
  },
} as const;

export const AUDIO_VISUALIZER_SIZE_OPTIONS = {
  desktop1920: {
    width: 120,
    height: 350,
  },
  desktop1536: {
    width: 100,
    height: 305,
  },
  desktop1366: {
    width: 100,
    height: 260,
  },
  default: {
    width: 140,
    height: 420,
  },
} as const;
