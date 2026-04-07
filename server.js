const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: API key ko env me rakhna best hai
const API_KEY = process.env.OPENROUTER_API_KEY || "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";

// ✅ ROOT ROUTE (Error fix: Cannot GET /)
app.get("/", (req, res) => {
  res.send("Vibely Backend Running 🚀");
});

// ✅ MAIN API
app.post("/generate", async (req, res) => {
  const { niche } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give 5 viral Instagram reel ideas for ${niche} with hook, caption and hashtags`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content;

    res.json({ result });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    res.json({
      result:
        "❌ " +
        (error.response?.data?.error?.message || error.message),
    });
  }
});

// ✅ IMPORTANT: Render ke liye dynamic port use karo
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
