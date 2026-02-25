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
     - **Name:** `GEMINI_API_KEY`
     - **Value:** your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
     - Check **Production** (and **Preview** if you want chat on preview URLs).
   - Click **Deploy**. Wait for the build to finish.

3. **Your site is live** at `https://your-project.vercel.app`.  
   - To enable the AI chat: add `GEMINI_API_KEY` in the project **Settings → Environment Variables** and redeploy if you didn’t add it in step 2.

### Option B: Deploy with Vercel CLI

1. Log in and deploy from the project folder:
   ```bash
   cd "c:\Users\coldb\Desktop\My Portfolio"
   vercel login
   vercel --prod
   ```
2. Add the API key in the Vercel dashboard: **Your project** → **Settings** → **Environment Variables** → add `GEMINI_API_KEY` → **Redeploy** (Deployments → ⋮ → Redeploy).

## Gemini API key (optional)

The site works without a key; the "Interview My AI Clone" chat will show a friendly fallback message. To enable the chat:

- Get a key: [Google AI Studio](https://aistudio.google.com/app/apikey)
- Locally: create a `.env` file with `GEMINI_API_KEY=your_key` (see `.env.example`).
- **Vercel:** add `GEMINI_API_KEY` in the project’s Environment Variables. **Redeploy after adding it** (Deployments → ⋮ → Redeploy)—env vars are baked in at build time.

## Project Media (Google Drive) images

Gallery images use Google Drive. For them to load, each file must be shared **"Anyone with the link"**. The app uses Drive thumbnail URL format; if an image still does not show, check the share setting.

## Duplicate projects on Vercel? / Re-deploying after deleting a project

If you see two projects or you deleted the wrong one, use a single project and redeploy so the API key is used:

1. Go to [vercel.com/new](https://vercel.com/new) (or **Add New** → **Project**).
2. **Import** your repo: `Coldbalouba/Portfolio`. Name the project **portfolio** or **aj-portfolio** (lowercase, no spaces).
3. **Before** clicking Deploy, open **Environment Variables** and add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **Environments:** Production (and Preview if you want).
4. Click **Deploy**. The build will include the key, so the AI chat will work. Media gallery uses Google Drive thumbnail URLs; ensure each Drive file is shared **"Anyone with the link"**.

## Scripts

| Command       | Description                |
|---------------|----------------------------|
| `npm run dev` | Start dev server           |
| `npm run build` | Build for production    |
| `npm run preview` | Preview production build |
