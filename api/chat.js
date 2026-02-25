// Server-side Gemini proxy. Keeps API key out of the client and avoids CORS.
// Set GEMINI_API_KEY in Vercel → Project → Settings → Environment Variables.

const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY. Add it in Vercel → Settings → Environment Variables and redeploy." },
        { status: 500 }
      );
    }

    const { messages, systemPrompt } = await request.json();
    if (!messages?.length || !systemPrompt) {
      return Response.json({ error: "messages and systemPrompt required" }, { status: 400 });
    }

    const contents = messages.map((m) => ({
      role: m.role === "ai" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const payload = {
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    // Use FREE-TIER models first. gemini-2.0-flash has limit 0 on free tier and will always quota-error.
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-preview-09-2025",
      "gemini-1.5-flash",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro",
      "gemini-1.5-pro-002",
    ];
    let lastError = null;
    let lastStatus = 404;

    for (const model of modelsToTry) {
      const res = await fetch(`${GEMINI_URL(model)}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return Response.json({ text: text || "No response from model." });
      }

      lastStatus = res.status;
      lastError = data?.error?.message || res.statusText;
      // On auth error, no point trying other models
      if (res.status === 401 || res.status === 403) break;
      // On 429 (quota) or 404 (model not found), try next model—free-tier models vary by account
    }

    return Response.json(
      { error: lastError || "Model not available" },
      { status: lastStatus >= 400 ? lastStatus : 502 }
    );
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
