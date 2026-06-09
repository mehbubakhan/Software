const { OpenAI } = require('openai');

// Initialize Groq client using the OpenAI SDK
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: 'https://api.groq.com/openai/v1',
});

const chatWithParent = async (req, res) => {
  try {
    const { messages, role } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        ok: false, 
        error: "Groq API Key is missing. Please add GROQ_API_KEY to the backend .env file." 
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ ok: false, error: "Messages array is required." });
    }

    const prompts = {
      parent: "You are an expert childcare assistant. Provide helpful, safe, and encouraging advice to parents regarding child development, sleep routines, feeding guides, and health reminders. Always prioritize the child's safety and recommend seeing a doctor for medical emergencies. Keep your answers concise, friendly, and easy to read.",
      nanny: "You are an expert career and childcare assistant for nannies. Provide advice on job matching, interview prep, schedule management, and creative child interaction tips. Keep answers concise, professional, and supportive.",
      daycare: "You are an expert facility management assistant for daycare owners. Provide advice on licensing prep, facility safety, staff management, and parent communication. Keep answers concise, professional, and practical.",
      adoption: "You are an expert adoption assistant. Provide compassionate and accurate guidance on the adoption process, paperwork tips, and emotional support. Keep answers concise, warm, and supportive.",
      seller: "You are an expert marketplace and e-commerce assistant. Provide advice on optimizing product listings, managing inventory, and increasing sales in a childcare-focused marketplace. Keep answers concise, professional, and actionable.",
      admin: "You are an expert platform administration assistant. Provide advice on moderation policies, user management, handling complaints, and analyzing platform metrics. Keep answers concise, objective, and professional."
    };

    const rolePrompt = prompts[role] || prompts.parent;

    // Define the system prompt
    const systemPrompt = {
      role: "system",
      content: rolePrompt
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
