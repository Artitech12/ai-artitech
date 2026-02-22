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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
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
          messages: [
            {
              role: "system",
              content: `
You are Artitech AI, an expert-level academic assistant.

STRICT RESPONSE RULES:

1. Always structure answers clearly.
2. Use proper section headings.
3. Use numbered lists (1., 2., 3.).
4. Avoid unnecessary blank lines.
5. Keep spacing clean and consistent.
6. Explain deeply but clearly.
7. If scientific topic, explain step-by-step logically.
8. Never respond in one large paragraph.
9. Format cleanly using markdown style.

Make responses professional, accurate, and high quality like ChatGPT.
`
            },
            {
              role: "user",
              content: `Explain in structured, academic, detailed style:\n\n${req.body.message}`
            }
          ],
          max_tokens: 800,
          temperature: 0.5
        })
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response generated."
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running...");
});