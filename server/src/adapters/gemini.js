const DEFAULT_MODEL = "gemini-1.5-flash";
const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function fetchJson(url, { timeoutMs = 4000, payload } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini error: ${res.status} ${text}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateSummary({ prompt, timeoutMs = 4000 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY manquante");
  }

  const baseUrl = process.env.GEMINI_API_URL || DEFAULT_BASE_URL;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 300
    }
  };

  const data = await fetchJson(url, { timeoutMs, payload });
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Reponse Gemini vide");
  }
  return text.trim();
}
