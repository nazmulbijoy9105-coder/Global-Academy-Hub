import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";
import nodemailer from "nodemailer";
import { handleChat } from "./src/server/chat";
import { handleDestinationInfo } from "./src/server/destinationInfo";
import { handleDestinationAcademic } from "./src/server/destinationAcademic";

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
  const emailSubscriptionsPath = path.join(dataDir, "email_subscriptions.json");
  const emailLogsPath = path.join(dataDir, "email_notifications_sent.json");

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
  app.post("/api/chat", handleChat);
  app.post("/api/destination-info", handleDestinationInfo);
  app.post("/api/destination-academic", handleDestinationAcademic);

  // Helper to retrieve SMTP transporter dynamically
  const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      return nodemailer.createTransport({
        host,
        port: parseInt(port || "587"),
        secure: port === "465",
        auth: {
          user,
          pass,
        },
      });
    }
    return null;
  };

  // Email Alerts Endpoints
  app.get("/api/email-alerts/subscriptions", (req, res) => {
    const list = readJsonFile(emailSubscriptionsPath, []);
    res.json(list);
  });

  app.get("/api/email-alerts/logs", (req, res) => {
    const list = readJsonFile(emailLogsPath, []);
    res.json(list);
  });

  app.post("/api/email-alerts/toggle", async (req, res) => {
    const list = readJsonFile(emailSubscriptionsPath, []);
    const logs = readJsonFile(emailLogsPath, []);
    const { 
      email, 
      docId, 
      enabled, 
      docTitle, 
      docTitleBn, 
      country, 
      days, 
      alertEn, 
      alertBn 
    } = req.body;

    if (!email || !docId) {
      return res.status(400).json({ error: "Email and Document ID are required." });
    }

    const index = list.findIndex((item: any) => item.email === email && item.docId === docId);

    if (enabled) {
      const newSubscription = {
        id: `sub-${Math.floor(100000 + Math.random() * 900000)}`,
        email,
        docId,
        docTitle: docTitle || docId,
        docTitleBn: docTitleBn || docId,
        country: country || "Unknown",
        days: days || "Immediate",
        alertEn: alertEn || "",
        alertBn: alertBn || "",
        createdAt: Date.now()
      };

      if (index === -1) {
        list.push(newSubscription);
      } else {
        list[index] = { ...list[index], ...newSubscription };
      }
      writeJsonFile(emailSubscriptionsPath, list);

      // Create an email with a beautiful layout
      const subject = `[Global Academy Hub] Deadline Alert Activated: ${docTitle} (${country})`;
      const html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; border-radius: 9999px; font-weight: bold; font-size: 14px;">
              Global Academy Hub
            </div>
            <h2 style="color: #0f172a; margin-top: 16px; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">Critical Deadline Alert Activated</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Schengen Visa & Study Advisory Platform</p>
          </div>
          
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 11px; font-weight: 750; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.1em;">Document Checklist Alert</p>
            <h3 style="margin: 8px 0 4px 0; color: #1e293b; font-size: 16px; font-weight: 700;">${docTitle}</h3>
            <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">Target Country: <strong>${country}</strong> | Preparation Buffer: <span style="color: #b45309; font-weight: bold;">${days}</span></p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">English Warning Details:</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; background-color: #fffbef; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 0 8px 8px 0; margin: 0 0 16px 0;">
              ${alertEn}
            </div>

            <p style="font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 8px;">বাংলা সতর্কবার্তা বিবরণ:</p>
            <div style="font-size: 13px; color: #334155; line-height: 1.6; background-color: #fffbef; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 0 8px 8px 0; margin: 0;">
              ${alertBn}
            </div>
          </div>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
            <p style="margin: 0 0 4px 0;">This is an automated critical deadline alert for your profile.</p>
            <p style="margin: 0;">© 2026 Global Academy Hub. All rights reserved.</p>
          </div>
        </div>
      `;

      let mailStatus = "Logged in Sandbox (No SMTP Configured)";
      let errMessage = null;

      try {
        const transporter = getTransporter();
        if (transporter) {
          const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
          await transporter.sendMail({
            from: fromEmail,
            to: email,
            subject,
            html
          });
          mailStatus = "Sent Successfully via SMTP";
        }
      } catch (error: any) {
        console.error("Nodemailer error:", error);
        mailStatus = "SMTP Error (Fallback to Sandbox)";
        errMessage = error.message;
      }

      const logEntry = {
        id: `log-${Math.floor(100000 + Math.random() * 900000)}`,
        email,
        docId,
        docTitle,
        country,
        subject,
        status: mailStatus,
        error: errMessage,
        timestamp: Date.now()
      };
      logs.unshift(logEntry);
      writeJsonFile(emailLogsPath, logs);

      return res.json({ 
        success: true, 
        message: mailStatus === "Sent Successfully via SMTP" 
          ? `Alert enabled! Confirmation email sent successfully to ${email}.`
          : `Alert enabled! This alert has been logged securely in our sandbox alert log for ${email}.`,
        status: mailStatus,
        log: logEntry
      });
    } else {
      if (index !== -1) {
        list.splice(index, 1);
        writeJsonFile(emailSubscriptionsPath, list);
      }
      return res.json({ success: true, message: `Alert turned off successfully.` });
    }
  });

  app.post("/api/email-alerts/test", async (req, res) => {
    const list = readJsonFile(emailSubscriptionsPath, []);
    const logs = readJsonFile(emailLogsPath, []);
    const { email, docId } = req.body;

    if (!email || !docId) {
      return res.status(400).json({ error: "Email and Document ID are required for testing." });
    }

    const sub = list.find((item: any) => item.email === email && item.docId === docId);
    if (!sub) {
      return res.status(404).json({ error: "No active alert subscription found for this item." });
    }

    const subject = `[Global Academy Hub Test] IMMEDIATE ACTION REQUIRED: ${sub.docTitle} for ${sub.country}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #ffffff; border-radius: 9999px; font-weight: bold; font-size: 14px;">
            Global Academy Hub TEST DISPATCH
          </div>
          <h2 style="color: #b91c1c; margin-top: 16px; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">⚠️ Critical Upcoming Deadline Warning</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Schengen Student Attestation & Processing Schedule</p>
        </div>
        
        <div style="background-color: #fef2f2; border-radius: 12px; padding: 20px; border: 1px solid #fee2e2; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 11px; font-weight: 750; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.1em;">TIMELINE DISPATCH LOG</p>
          <h3 style="margin: 8px 0 4px 0; color: #991b1b; font-size: 16px; font-weight: 700;">${sub.docTitle} (${sub.country})</h3>
          <p style="margin: 0; font-size: 12px; color: #7f1d1d; font-weight: 500;">Remaining buffer: <strong>${sub.days}</strong></p>
        </div>

        <div style="margin-bottom: 24px; font-size: 13px; color: #334155; line-height: 1.6;">
          <p style="font-weight: bold; color: #0f172a;">English Deadline Details:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 16px;">
            ${sub.alertEn}
          </div>

          <p style="font-weight: bold; color: #0f172a;">বাংলা ডেডলাইন বিবরণ:</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 12px; border-radius: 0 8px 8px 0;">
            ${sub.alertBn}
          </div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
          <p style="margin: 0 0 4px 0;">This test notification was triggered manually by the user from the Global Academy Hub portal.</p>
          <p style="margin: 0;">© 2026 Global Academy Hub. All rights reserved.</p>
        </div>
      </div>
    `;

    let mailStatus = "Logged in Sandbox (No SMTP Configured)";
    let errMessage = null;

    try {
      const transporter = getTransporter();
      if (transporter) {
        const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
        await transporter.sendMail({
          from: fromEmail,
          to: email,
          subject,
          html
        });
        mailStatus = "Sent Successfully via SMTP";
      }
    } catch (error: any) {
      console.error("Nodemailer test dispatch error:", error);
      mailStatus = "SMTP Error (Fallback to Sandbox)";
      errMessage = error.message;
    }

    const logEntry = {
      id: `log-${Math.floor(100000 + Math.random() * 900000)}`,
      email,
      docId,
      docTitle: sub.docTitle,
      country: sub.country,
      subject,
      status: mailStatus,
      error: errMessage,
      timestamp: Date.now()
    };
    logs.unshift(logEntry);
    writeJsonFile(emailLogsPath, logs);

    res.json({
      success: true,
      message: mailStatus === "Sent Successfully via SMTP"
        ? `Test notification email successfully dispatched to ${email}.`
        : `Test email logged successfully in Sandbox dispatch files for ${email}.`,
      status: mailStatus,
      log: logEntry
    });
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
