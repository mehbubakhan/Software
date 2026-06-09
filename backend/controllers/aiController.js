const { OpenAI } = require('openai');

// Initialize Groq client using the OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: 'https://api.groq.com/openai/v1',
});

const chatWithParent = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        ok: false, 
        error: "Groq API Key is missing. Please add GROQ_API_KEY to the backend .env file." 
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: "Messages array is required." });
    }

    // Define the system prompt
    const systemPrompt = {
      role: "system",
      content: "You are an expert childcare assistant. Provide helpful, safe, and encouraging advice to parents regarding child development, sleep routines, feeding guides, and health reminders. Always prioritize the child's safety and recommend seeing a doctor for medical emergencies. Keep your answers concise, friendly, and easy to read."
    };

    const conversation = [systemPrompt, ...messages];

    // Use Groq's extremely fast model
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: conversation,
    });

    res.json({
      ok: true,
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error("Groq Chat Error:", error.message);
    res.status(500).json({ ok: false, error: error.message });
  }
};

module.exports = {
  chatWithParent
};
