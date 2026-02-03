const BASE_URL = "https://api.coingecko.com/api/v3";

async function fetchJson(url, { timeoutMs = 6000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchCoins(query) {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
  const data = await fetchJson(url, { timeoutMs: 5000 });
  return Array.isArray(data?.coins) ? data.coins : [];
}

async function searchCoinId(query) {
  const coins = await searchCoins(query);
  const exactSymbol = coins.find(
    (coin) => coin.symbol && coin.symbol.toLowerCase() === query.toLowerCase()
  );
  return exactSymbol?.id || coins[0]?.id || null;
}

async function fetchMarkets(ids) {
  if (!ids.length) return [];
  const url = `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
  return await fetchJson(url, { timeoutMs: 6000 });
}

async function fetchMarketChart(id, days) {
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  return await fetchJson(url, { timeoutMs: 6000 });
}

function computeChartStats(prices) {
  if (!Array.isArray(prices) || !prices.length) {
    return { periodMin: null, periodMax: null, periodChangePct: null };
  }
  const values = prices.map((entry) => entry[1]).filter((v) => Number.isFinite(v));
  if (!values.length) {
    return { periodMin: null, periodMax: null, periodChangePct: null };
  }
  const first = values[0];
  const last = values[values.length - 1];
  const periodMin = Math.min(...values);
  const periodMax = Math.max(...values);
  const periodChangePct = first ? ((last - first) / first) * 100 : null;
  return { periodMin, periodMax, periodChangePct };
}

export async function fetchMarketData({ symbols, days }) {
  const resolved = [];
  const ids = [];

  for (const symbol of symbols) {
    const id = await searchCoinId(symbol);
    if (!id) {
      resolved.push({ symbol, error: "not_found" });
      continue;
    }
    resolved.push({ symbol, id });
    ids.push(id);
  }

  const markets = await fetchMarkets(ids);
  const marketById = new Map(
    markets.map((entry) => [entry.id, entry])
  );

  const assets = [];
  for (const item of resolved) {
    if (item.error) {
      assets.push({ symbol: item.symbol, error: item.error });
      continue;
    }

    const market = marketById.get(item.id);
    if (!market) {
      assets.push({ symbol: item.symbol, error: "market_data_missing" });
      continue;
    }

    let chartStats = { periodMin: null, periodMax: null, periodChangePct: null };
    try {
      const chart = await fetchMarketChart(item.id, days);
      chartStats = computeChartStats(chart?.prices);
    } catch {
      chartStats = { periodMin: null, periodMax: null, periodChangePct: null };
    }

    assets.push({
      id: item.id,
      symbol: market.symbol?.toUpperCase() || item.symbol,
      name: market.name,
      currentPrice: market.current_price ?? null,
      marketCap: market.market_cap ?? null,
      totalVolume: market.total_volume ?? null,
      circulatingSupply: market.circulating_supply ?? null,
      maxSupply: market.max_supply ?? null,
      marketCapRank: market.market_cap_rank ?? null,
      change24h: market.price_change_percentage_24h ?? null,
      ...chartStats
    });
  }

  return { assets };
}
