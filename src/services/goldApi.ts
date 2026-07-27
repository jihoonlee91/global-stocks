// gold-api.com is a free, key-free JSON API for live gold/silver spot prices
// (USD per troy ounce). No signup, no rate-limit tier to manage.
export async function fetchMetalPrice(symbol: 'XAU' | 'XAG'): Promise<number | null> {
  try {
    const res = await fetch(`https://api.gold-api.com/price/${symbol}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { price?: unknown };
    return typeof data.price === 'number' ? data.price : null;
  } catch {
    return null;
  }
}
