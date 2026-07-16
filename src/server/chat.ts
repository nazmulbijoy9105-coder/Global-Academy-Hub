import { Request, Response } from "express";

/**
 * Handles the chat request and streams the response from Groq API
 */
export async function handleChat(req: Request, res: Response) {
  const { messages = [], system, stream = true } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.error('[Chat Handler] GROQ_API_KEY is missing');
    res.status(500).write(`data: ${JSON.stringify({ error: 'Server configuration error: API key missing' })}\n\n`);
    res.end();
    return;
  }

  const systemContent = system ||
    `You are the Global Academy Hub AI, an expert academic and visa consultant for Schengen and European higher education. 
    Be concise, professional, warm, and practical. 
    Help students with university recommendations, visa suitability, and preparation. 
    You are based in Dhaka, Bangladesh.`;

  const fullMessages = [{ role: 'system', content: systemContent }, ...messages];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: fullMessages,
        stream: stream,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Groq');
    }

    if (stream) {
      // Set streaming headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
      res.end();
    } else {
      // Handle non-streaming response
      const data = await response.json();
      res.json(data);
    }

  } catch (err: any) {
    console.error('[Chat Handler Error]', err.message);
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'text/event-stream');
    }
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
