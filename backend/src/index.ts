import express, { Request, Response } from "express";
import { continueChat } from "./services/geminiService";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
