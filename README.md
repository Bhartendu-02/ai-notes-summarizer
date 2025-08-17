# AI Meeting Notes Summarizer

**Live Demo:** [ai-notes-summarizer-jizc.onrender.com](https://ai-notes-summarizer-jizc.onrender.com)

---

## Overview

The **AI Meeting Notes Summarizer** is a simple and practical tool that helps you turn long meeting transcripts into concise summaries.  
It highlights action items, allows editing, and makes it easy to share notes via email.

---

## Features

- Upload or paste meeting transcripts.
- Add custom AI instructions (e.g., "Summarize in bullet points" or "Highlight only action items").
- Generate clean and concise summaries.
- Edit summaries before sending.
- Send polished summaries instantly via email.

---

## Functionality

1. Upload a `.txt` transcript file or paste notes directly.
2. Enter an instruction for the AI summarizer.
3. Get a neat, structured summary.
4. Make edits if needed.
5. Send the summary to your email with a single click.

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (lightweight, no frameworks)
- **Backend:** Node.js with Express
- **AI:** Groq API for summarization
- **Email Service:** NodeMailer with SMTP (works with Gmail, Outlook, SendGrid, etc.)

---

## Getting Started

Follow these steps to run the project locally:

```bash
# Clone the repository
git clone https://github.com/Bhartendu-02/AI-powered-meeting-notes-summarizer-and-sharer.git

# Navigate into the project folder
cd AI-powered-meeting-notes-summarizer-and-sharer

# Install dependencies
npm install

# Run the development server
npm start
