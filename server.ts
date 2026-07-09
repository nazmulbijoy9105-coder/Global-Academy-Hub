import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Paths for JSON storage
  const analyticsPath = path.join(dataDir, "analytics.json");
  const inquiriesPath = path.join(dataDir, "inquiries.json");
  const pushSubscriptionsPath = path.join(dataDir, "push_subscriptions.json");

  // Helper to read and write local JSON structures safely
  const readJsonFile = (filePath: string, defaultVal: any) => {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
    return defaultVal;
  };

  const writeJsonFile = (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error(`Error writing ${filePath}:`, e);
      return false;
    }
  };

  // Use JSON parsing for requests
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const origin = req.headers.origin;
    
    // Flexible CORS for Vercel and AI Studio
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof (res as any).flushHeaders === 'function') (res as any).flushHeaders();

    try {
      const { messages = [], system, stage } = req.body;

      if (!process.env.GROQ_API_KEY) {
        console.error('[Global Academy Hub] GROQ_API_KEY is missing');
        res.write(`data: ${JSON.stringify({ error: 'Server configuration error: API key missing' })}\n\n`);
        res.end();
        return;
      }

      const systemContent = system ||
        `You are the Global Academy Hub AI, an expert academic and visa consultant for Schengen and European higher education. Be concise, professional, warm, and practical. Help students with university recommendations, visa suitability, and preparation.`;

      const fullMessages = [{ role: 'system', content: systemContent }, ...messages];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: fullMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error ${response.status}: ${errText}`);
      }

      const reader = response.body ? response.body.getReader() : null;
      if (!reader) {
        throw new Error("Response body is not readable");
      }
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          if (payload === '[DONE]') {
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
          res.write(`data: ${payload}\n\n`);
          if (typeof (res as any).flush === 'function') (res as any).flush();
        }
      }

      res.write('data: [DONE]\n\n');
      res.end();

    } catch (err: any) {
      console.error('[Global Academy Hub Error]', err.message);
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  });

  // Analytics Endpoints
  app.get("/api/analytics", (req, res) => {
    const data = readJsonFile(analyticsPath, { visits: 0, actions: [] });
    res.json(data);
  });

  app.post("/api/analytics", (req, res) => {
    const current = readJsonFile(analyticsPath, { visits: 0, actions: [] });
    const { action, meta } = req.body;
    
    current.visits = (current.visits || 0) + (action === "pageview" ? 1 : 0);
    if (action && action !== "pageview") {
      current.actions.push({
        action,
        meta: meta || {},
        timestamp: Date.now()
      });
    }

    writeJsonFile(analyticsPath, current);
    res.json({ success: true, visits: current.visits });
  });

  // Student Inquiries Endpoints
  app.get("/api/inquiries", (req, res) => {
    const list = readJsonFile(inquiriesPath, []);
    res.json(list);
  });

  app.post("/api/inquiries", (req, res) => {
    const list = readJsonFile(inquiriesPath, []);
    const { name, email, phone, country, subject, query } = req.body;

    const newInquiry = {
      id: "inq-" + Math.floor(1000 + Math.random() * 9000),
      name: name || "Anonymous",
      email: email || "",
      phone: phone || "",
      country: country || "Germany",
      subject: subject || "General",
      query: query || "",
      status: "pending",
      timestamp: Date.now()
    };

    list.push(newInquiry);
    writeJsonFile(inquiriesPath, list);
    res.json({ success: true, inquiry: newInquiry });
  });

  // Push Subscriptions
  app.post("/api/push-subscriptions", (req, res) => {
    const list = readJsonFile(pushSubscriptionsPath, []);
    const { subscription } = req.body;

    if (subscription) {
      list.push({
        subscription,
        timestamp: Date.now()
      });
      writeJsonFile(pushSubscriptionsPath, list);
    }
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
