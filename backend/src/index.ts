import express, { Request, Response } from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { continueChat } from "./services/geminiService";

const app = express();
const port = process.env.PORT || 3000;
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      const { text, history } = parsedMessage;

      if (!text || typeof text !== "string") {
        ws.send(
          JSON.stringify({
            error: "Message is required and must be a string.",
          })
        );
        return;
      }

      console.log(`Received message: ${text}`);

      // Process the message with Gemini
      const chatResponse = await continueChat(text, history || []);

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
    console.log("Client disconnected");
  });

  // Send a welcome message when client connects
  ws.send(
    JSON.stringify({
      type: "connection_established",
      message: "Connected to Gemini Chat Backend",
      timestamp: new Date().toISOString(),
    })
  );
});

// --- Chat Endpoint ---
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

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

    const chatResponse = await continueChat(message, history);

    res.json(chatResponse);
  } catch (error) {
    console.error("Error in /api/chat endpoint:", error);
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
