import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

/* 🔥 SIMPLE MEMORY STORAGE */
let conversationHistory = [
  {
    role: "system",
    content: `
You are Artitech AI, an expert-level academic assistant.

Always:
- Structure answers clearly
- Use headings
- Use numbered points
- Avoid unnecessary blank space
- Maintain clean formatting
`
  }
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Add user message to memory
    conversationHistory.push({
      role: "user",
      content: userMessage
    });

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: conversationHistory,
          max_tokens: 800,
          temperature: 0.5
        })
      }
    );

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "No response.";

    // Add AI reply to memory
    conversationHistory.push({
      role: "assistant",
      content: aiReply
    });

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running...");
});