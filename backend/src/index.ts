import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { continueChat, clearChatSession } from "./services/geminiService";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// Track client connections with unique IDs
const clients = new Map<WebSocket, string>();

// WebSocket connection handling
wss.on("connection", (ws) => {
  // Assign a unique client ID for this connection
  const clientId = uuidv4();
  clients.set(ws, clientId);

  console.log(`Client connected with ID: ${clientId}`);

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      const { text, history, action } = parsedMessage;

      // Handle special actions
      if (action === "clear_conversation") {
        clearChatSession(clientId);
        ws.send(
          JSON.stringify({
            type: "system_message",
            message: "Conversation has been cleared.",
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      if (!text || typeof text !== "string") {
        ws.send(
          JSON.stringify({
            error: "Message is required and must be a string.",
          })
        );
        return;
      }

      console.log(`Received message from ${clientId}: ${text}`);

      // Process the message with Gemini using persistent chat sessions
      const chatResponse = await continueChat(text, history || [], clientId);

      // Send the response back to the client
      ws.send(
        JSON.stringify({
          type: "text_response",
          message: chatResponse.reply,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
      ws.send(
        JSON.stringify({
          error: "An error occurred while processing your message",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ${clients.get(ws)}`);
    // Note: We don't clear the chat session on disconnect to allow reconnection
    clients.delete(ws);
  });

  // Send a welcome message when client connects
  ws.send(
    JSON.stringify({
      type: "connection_established",
      message: "Connected to Gemini Chat Backend",
      clientId: clientId,
      timestamp: new Date().toISOString(),
    })
  );
});

// --- Chat Endpoint ---
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history, clientId } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string." });
    }

    if (history && !Array.isArray(history)) {
      return res
        .status(400)
        .json({ error: "History must be an array if provided." });
    }

    const chatResponse = await continueChat(message, history, clientId);

    res.json(chatResponse);
  } catch (error) {
    console.error("Error in /api/chat endpoint:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// --- Clear Chat Endpoint ---
app.post("/api/clear-chat", (req: Request, res: Response) => {
  try {
    const { clientId } = req.body;
    const result = clearChatSession(clientId);
    res.json(result);
  } catch (error) {
    console.error("Error in /api/clear-chat endpoint:", error);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

// --- Basic Root Route ---
app.get("/", (req: Request, res: Response) => {
  res.send("Gemini Chat Backend is running!");
});

// --- Start Server ---
server.listen(port, () => {
  console.log(`Server listening on port ${port} with WebSocket support`);
});
