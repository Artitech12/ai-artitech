import express from "express";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();
console.log("Loaded Token:", process.env.HF_TOKEN);


const app = express();
app.use(cors());  
app.use(express.json());

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
            { role: "user", content: req.body.message }
          ],
          max_tokens: 200
        })
      }
    );

    const data = await response.json();

    console.log("HF RESPONSE:", data);

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
