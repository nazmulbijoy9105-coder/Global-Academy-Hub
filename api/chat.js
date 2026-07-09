// api/chat.js
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("[Global Academy Hub] GROQ_API_KEY is missing");
    res.status(500).json({
      error: "Server configuration error: GROQ_API_KEY not set",
      hint: "Add GROQ_API_KEY to Vercel Environment Variables"
    });
    return;
  }

  try {
    const { messages = [], system } = req.body;
    const systemContent = system || `You are the Global Academy Hub AI, an expert academic and visa consultant for Schengen and European higher education. Be concise, professional, warm, and practical. Help students with university recommendations, visa suitability, SOP drafting, blocked account guidance, and interview preparation. Always respond in the same language the user is using (English or Bengali).`;
    const fullMessages = [{ role: "system", content: systemContent }, ...messages];

    console.log("[Global Academy Hub] Calling Groq API with", fullMessages.length, "messages");

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("[Global Academy Hub] Groq API error:", groqResponse.status, errText);
      res.status(502).json({ error: "Groq API error", status: groqResponse.status, details: errText });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error("[Global Academy Hub] Function error:", error);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};
