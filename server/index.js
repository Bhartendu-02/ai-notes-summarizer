import express from "express";
import fetch from "node-fetch";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, "..", "public")));

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile"; // See https://console.groq.com/docs/models

if (!GROQ_API_KEY) {
  console.warn("[WARN] GROQ_API_KEY not set. /api/summarize will fail until you set it.");
}

app.post("/api/summarize", async (req, res) => {
  try {
    const { transcript, prompt } = req.body || {};
    if (!transcript || !prompt) {
      return res.status(400).json({ error: "Missing transcript or prompt" });
    }

    const system = "You are an assistant that creates concise, well-structured summaries of meeting or call transcripts. Respect the user's instruction exactly, highlight action items and owners when asked, and return clean Markdown.";

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Instruction:\n${prompt}\n\nTranscript:\n${transcript}` }
        ]
      })
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Groq error:", resp.status, txt);
      return res.status(500).json({ error: "Groq request failed", detail: txt });
    }
    const data = await resp.json();
    const summary = data.choices?.[0]?.message?.content ?? "";
    return res.json({ summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Email sender
function buildTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn("[WARN] SMTP settings incomplete. /api/send-email will fail until configured.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, html } = req.body || {};
    if (!to || !subject || !html) {
      return res.status(400).json({ error: "Missing to / subject / html" });
    }
    const recipients = Array.isArray(to) ? to.join(",") : String(to);
    const transporter = buildTransporter();
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: recipients,
      subject,
      html,
    });
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email send failed", detail: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Notes Summarizer running on http://localhost:${PORT}`);
});
