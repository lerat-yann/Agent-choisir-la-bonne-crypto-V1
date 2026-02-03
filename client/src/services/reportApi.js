const API_BASE = "http://localhost:3001/api";

export async function requestReport(payload) {
  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.details?.join?.(" ") || data?.error || "Erreur API.";
    throw new Error(message);
  }
  return data;
}

export async function searchAssets(query) {
  const res = await fetch(`${API_BASE}/assets/search?query=${encodeURIComponent(query)}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.error || "Erreur API.";
    throw new Error(message);
  }
  return data?.results || [];
}
