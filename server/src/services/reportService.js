import { fetchMarketData } from "../adapters/coingecko.js";
import { generateSummary } from "../adapters/gemini.js";
import { buildReportMarkdown } from "../templates/reportTemplate.js";

const PERIOD_DAYS = {
  "2a": 730,
  "3a": 1095,
  "5a": 1825
};

function formatUsd(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1 ? 2 : 6
  }).format(value);
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value);
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "n/a";
  return `${value.toFixed(2)}%`;
}

function buildMarketSection(data, periodLabel) {
  const lines = ["## Marche"];

  data.assets.forEach((asset) => {
    if (asset.error) {
      lines.push(`- ${asset.symbol}: introuvable sur CoinGecko.`);
      return;
    }

    lines.push(
      `- ${asset.name} (${asset.symbol}): prix ${formatUsd(asset.currentPrice)}, market cap ${formatUsd(asset.marketCap)}, volume 24h ${formatUsd(asset.totalVolume)}, variation 24h ${formatPercent(asset.change24h)}.`
    );
    if (asset.periodChangePct !== null) {
      lines.push(
        `  - Variation approx. sur ${periodLabel}: ${formatPercent(asset.periodChangePct)} (min ${formatUsd(asset.periodMin)}, max ${formatUsd(asset.periodMax)}).`
      );
    }
  });

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildFundamentalsSection(data) {
  const lines = ["## Fondamentaux"];

  data.assets.forEach((asset) => {
    if (asset.error) return;
    lines.push(
      `- ${asset.name} (${asset.symbol}): rang ${asset.marketCapRank || "n/a"}, supply circulante ${formatNumber(asset.circulatingSupply)}, supply max ${formatNumber(asset.maxSupply)}.`
    );
  });

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildRisksSection(data) {
  const lines = ["## Risques"];

  data.assets.forEach((asset) => {
    if (asset.error) return;
    lines.push(
      `- ${asset.name} (${asset.symbol}): volatilite courte periode (24h) ${formatPercent(asset.change24h)}.`
    );
  });

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildScenariosSection(data, periodLabel) {
  const lines = ["## Scenarios"];

  data.assets.forEach((asset) => {
    if (asset.error || asset.periodMin === null || asset.periodMax === null) return;
    lines.push(
      `- ${asset.name} (${asset.symbol}): plage constatee sur ${periodLabel} -> min ${formatUsd(asset.periodMin)}, max ${formatUsd(asset.periodMax)}.`
    );
  });

  return lines.length > 1 ? lines.join("\n") : "";
}

function buildComparisonSection(data) {
  if (data.assets.length < 2) return "";
  const header = "| Actif | Prix | Market cap | Volume 24h | Var 24h | Var periode |";
  const sep = "| --- | --- | --- | --- | --- | --- |";
  const rows = data.assets
    .filter((asset) => !asset.error)
    .map((asset) => {
      const period = asset.periodChangePct !== null ? formatPercent(asset.periodChangePct) : "n/a";
      return `| ${asset.symbol} | ${formatUsd(asset.currentPrice)} | ${formatUsd(asset.marketCap)} | ${formatUsd(asset.totalVolume)} | ${formatPercent(asset.change24h)} | ${period} |`;
    });

  if (!rows.length) return "";
  return ["## Comparaison", header, sep, ...rows].join("\n");
}

function buildLlmSection(text) {
  if (!text) return "";
  return ["## Synthese IA", text].join("\n");
}

export async function createReport(payload) {
  const startedAt = Date.now();
  const periodDays = PERIOD_DAYS[payload.PERIODE] || PERIOD_DAYS["5a"];
  const periodLabel = payload.PERIODE;

  const marketStart = Date.now();
  const marketData = await fetchMarketData({
    symbols: payload.ASSETS,
    days: periodDays
  });
  const marketMs = Date.now() - marketStart;

  const sections = {
    market: buildMarketSection(marketData, periodLabel),
    fundamentals: buildFundamentalsSection(marketData),
    risks: buildRisksSection(marketData),
    scenarios: buildScenariosSection(marketData, periodLabel),
    comparison: payload.INCLUDE.COMPARE ? buildComparisonSection(marketData) : ""
  };

  let llmUsed = false;
  let fallback = false;
  let llmMs = 0;

  if (payload.INCLUDE.LLM_ADVISORY) {
    const llmStart = Date.now();
    try {
      const prompt = [
        "Tu es un assistant neutre.",
        "Resume les donnees suivantes de maniere pedagogique.",
        "Interdictions: aucun conseil financier, aucune recommandation.",
        "",
        JSON.stringify(
          {
            objectif: payload.OBJECTIF,
            niveau: payload.NIVEAU,
            actifs: marketData.assets.map((asset) => ({
              symbol: asset.symbol,
              name: asset.name,
              currentPrice: asset.currentPrice,
              marketCap: asset.marketCap,
              change24h: asset.change24h,
              periodChangePct: asset.periodChangePct
            }))
          },
          null,
          2
        )
      ].join("\n");

      const summary = await generateSummary({ prompt, timeoutMs: 4000 });
      sections.llm = buildLlmSection(summary);
      llmUsed = true;
    } catch (err) {
      fallback = true;
      sections.llm = buildLlmSection(
        "Synthese IA indisponible. Fallback data-only."
      );
    } finally {
      llmMs = Date.now() - llmStart;
    }
  }

  const reportMarkdown = buildReportMarkdown({
    sections,
    meta: { generatedAt: new Date().toISOString() }
  });

  const totalMs = Date.now() - startedAt;
  const sources = ["CoinGecko"];
  if (llmUsed) sources.push("Gemini");

  return {
    reportMarkdown,
    sections,
    meta: {
      generatedAt: new Date().toISOString(),
      sources,
      fallback,
      timings: {
        totalMs,
        marketDataMs: marketMs,
        llmMs
      },
      llmUsed,
      dataOnly: !llmUsed || fallback
    }
  };
}
