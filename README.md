# AJ Portfolio

Portfolio of Ahmed Jouini (AJ): educator, developer and AI consultant in Phnom Penh, and founder of [Wonderkids Network](https://wonderkidsnetwork.com).

Live at **https://ajsportfolio.vercel.app**

## What's on it

- **Projects**: MyBot, SchoAI, BizOps AI, DeskUP, TeachHelp, Helper Bot and Wonderkids Network, most with a video walkthrough and screenshots.
- **Experience**: teaching at international schools in Cambodia, business consulting and freelance AI work.
- **Interview my AI clone**: a chat that answers questions about my work, powered by Google Gemini.

## Built with

React, Vite and Tailwind CSS, hosted on Vercel. The chat runs through a small serverless function (`api/chat.js`). The function holds the Gemini key and the clone's instructions (`api/_profile.js`), so neither ever reaches the browser.

The chat profile contains public professional information only. API credentials belong in Vercel environment variables; personal contact details and private documents do not belong in this repository. Source files remain visible on GitHub even when they execute only on the server.

## Run it locally

```bash
npm install
npm run dev
```

The chat needs `GEMINI_API_KEY`. Use `vercel dev` with the key in `.env.local`, or set it in the Vercel project settings.
