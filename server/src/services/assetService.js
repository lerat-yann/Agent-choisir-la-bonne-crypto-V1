import { searchCoins } from "../adapters/coingecko.js";

export async function searchAssets(query) {
  const results = await searchCoins(query);
  const normalized = query.trim().toLowerCase();
  const mapped = results.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol?.toUpperCase(),
    name: coin.name
  }));
  const filtered = mapped.filter((coin) => {
    const symbol = coin.symbol?.toLowerCase() || "";
    const name = coin.name?.toLowerCase() || "";
    return symbol.startsWith(normalized) || name.startsWith(normalized);
  });
  return filtered.length ? filtered : mapped;
}
