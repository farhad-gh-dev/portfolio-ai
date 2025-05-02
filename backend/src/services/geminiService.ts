import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  ChatSession,
} from "@google/generative-ai";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

// Optional: Configure safety settings if needed
// See: https://ai.google.dev/docs/safety_setting_gemini
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const INSTRUCTIONS_PATH = path.join(
  __dirname,
  "../config/systemInstructions.txt"
);
let instructionsText = "";

try {
  instructionsText = fs.readFileSync(INSTRUCTIONS_PATH, "utf8");
  console.log("System instructions loaded from file successfully");
} catch (error) {
  console.error("Error reading system instructions file:", error);
  instructionsText =
    "You are an AI assistant for Farhan's portfolio website. Be professional and helpful.";
}

const DEFAULT_SYSTEM_INSTRUCTIONS = {
  role: "system",
  parts: [{ text: instructionsText }],
};

const activeChatSessions = new Map<string, ChatSession>();

// --- Option 1: Simple Text Generation ---
export async function generateSimpleText(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw new Error("Failed to get response from AI model.");
  }
}

// --- Option 2: Conversational Chat ---
export async function continueChat(
  message: string,
  history: any[] = [],
  clientId?: string,
  customInstructions?: string
) {
  try {
    let chat: ChatSession;

    // Use custom instructions if provided, otherwise use default
    let systemInstructions = DEFAULT_SYSTEM_INSTRUCTIONS;

    // If custom instructions are provided as a string, format them correctly
    if (customInstructions && typeof customInstructions === "string") {
      systemInstructions = {
        role: "system",
        parts: [
          {
            text: customInstructions,
          },
        ],
      };
    }

    // If clientId is provided, try to use or create a persistent chat session
    if (clientId) {
      if (!activeChatSessions.has(clientId)) {
        // Create a new chat session for this client
        chat = model.startChat({
          history: history,
          systemInstruction: systemInstructions,
          safetySettings,
          // generationConfig: { maxOutputTokens: 100 },
        });
        activeChatSessions.set(clientId, chat);
      } else {
        // Use existing chat session
        chat = activeChatSessions.get(clientId)!;
      }
    } else {
      // Fallback to non-persistent chat if no clientId provided
      chat = model.startChat({
        history: history,
        systemInstruction: systemInstructions,
        safetySettings,
        // generationConfig: { maxOutputTokens: 100 },
      });
    }

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return { reply: text };
  } catch (error) {
    console.error("Error in chat conversation:", error);
    if (error instanceof Error && error.message.includes("SAFETY")) {
      return { reply: "The response was blocked due to safety concerns." };
    }
    throw new Error("Failed to get chat response from AI model.");
  }
}

// Function to clear a chat session or all sessions
export function clearChatSession(clientId?: string) {
  if (clientId) {
    activeChatSessions.delete(clientId);
    return {
      success: true,
      message: `Chat session for client ${clientId} cleared`,
    };
  } else {
    activeChatSessions.clear();
    return { success: true, message: "All chat sessions cleared" };
  }
}
