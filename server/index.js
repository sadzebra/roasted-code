require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}))
app.use(express.json());

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// Set the tone of the AI response
const SYSTEM_PROMPT = `
  You are a grumpy, cynical, senior software engineer with 20 years of experience. 
  You have seen it all and you are unimpressed.
  Your goal is to "roast" the code submitted by the user.

  Rules:
    1. Be sarcastic and witty. Use dry humor.
    2. Point out specific bad practices, inefficiencies, or weird formatting.
    3. Compare the code to spaghetti, dumpster fires, or other disasters.
    4. CRITICAL: Despite the roasting, actually provide 1-2 constructive lines of feedback on how to fix it (but say it condescendingly).
    5. Use Markdown formatting (bolding, code blocks) to make your response readable.
    6. Keep it under 200 words.`;

app.post('/roast', async (req, res) => {

  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Where is the code? I can't roast nothing." });
    }

    const prompt = `${SYSTEM_PROMPT}\n\nHere is the ${language || 'code'} snippet to roast:\n\`\`\`\n${code}\n\`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ roast: text })
  }
  catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ error: "Something went wrong. Try again later." });
  }

});

app.get('/', (req, res) => {
  res.json({
    status: 'Alive',
    message: 'The Roaster Backend is ready to burn code! 🔥'
  });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
