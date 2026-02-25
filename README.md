# AJ Portfolio

Portfolio site for Ahmed Jouini (AJ) — Whole Stack Developer, AI Consultant & Business Strategist. Built with React, Vite, and Tailwind CSS. Includes an "Interview My AI Clone" chat powered by Google Gemini.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deploy to Vercel (get fully live)

### Option A: Deploy with GitHub (recommended)

1. **Push to GitHub**
   - Create a new repo on [github.com](https://github.com) (e.g. `aj-portfolio`).
   - In your project folder run:
   ```bash
   git init
   git add .
   git commit -m "Portfolio ready for Vercel"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aj-portfolio.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com) → Sign in with **GitHub**.
   - Click **Add New** → **Project**.
   - **Import** your repo (e.g. `aj-portfolio`). Vercel will detect Vite.
   - Before clicking Deploy, open **Environment Variables** and add:
     - **Name:** `VITE_GEMINI_API_KEY`
     - **Value:** your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
     - Check **Production** (and **Preview** if you want chat on preview URLs).
   - Click **Deploy**. Wait for the build to finish.

3. **Your site is live** at `https://your-project.vercel.app`.  
   - To enable the AI chat: add `VITE_GEMINI_API_KEY` in the project **Settings → Environment Variables** and redeploy if you didn’t add it in step 2.

### Option B: Deploy with Vercel CLI

1. Log in and deploy from the project folder:
   ```bash
   cd "c:\Users\coldb\Desktop\My Portfolio"
   vercel login
   vercel --prod
   ```
2. Add the API key in the Vercel dashboard: **Your project** → **Settings** → **Environment Variables** → add `VITE_GEMINI_API_KEY` → **Redeploy** (Deployments → ⋮ → Redeploy).

## Gemini API key (optional)

The site works without a key; the "Interview My AI Clone" chat will show a friendly fallback message. To enable the chat:

- Get a key: [Google AI Studio](https://aistudio.google.com/app/apikey)
- Locally: create a `.env` file with `VITE_GEMINI_API_KEY=your_key` (see `.env.example`).
- Vercel: set `VITE_GEMINI_API_KEY` in the project’s Environment Variables.

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Start dev server           |
| `npm run build` | Build for production    |
| `npm run preview` | Preview production build |
