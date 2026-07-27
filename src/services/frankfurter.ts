// Frankfurter (https://frankfurter.dev) is a free, key-free exchange-rate API
// backed by European Central Bank reference rates. It publishes one rate per
// business day (no intraday ticks), which is the tradeoff for needing no key.
const QUOTE_CURRENCIES = ['KRW', 'JPY', 'CNY', 'HKD', 'CHF', 'EUR', 'GBP', 'AUD'];

export type UsdRates = Partial<Record<(typeof QUOTE_CURRENCIES)[number], number>>;

export async function fetchUsdRates(): Promise<UsdRates | null> {
  try {
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${QUOTE_CURRENCIES.join(',')}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: UsdRates };
    return data.rates ?? null;
  } catch {
    return null;
  }
}

/** Maps a forex pair symbol (e.g. "EUR/USD") to a rate derived from USD-base quotes. */
export function deriveForexPrice(symbol: string, usdRates: UsdRates): number | null {
  switch (symbol) {
    case 'USD/KRW':
      return usdRates.KRW ?? null;
    case 'USD/JPY':
      return usdRates.JPY ?? null;
    case 'USD/CNY':
      return usdRates.CNY ?? null;
    case 'USD/HKD':
      return usdRates.HKD ?? null;
    case 'USD/CHF':
      return usdRates.CHF ?? null;
    case 'EUR/USD':
      return usdRates.EUR ? 1 / usdRates.EUR : null;
    case 'GBP/USD':
      return usdRates.GBP ? 1 / usdRates.GBP : null;
    case 'AUD/USD':
      return usdRates.AUD ? 1 / usdRates.AUD : null;
    default:
      return null;
  }
}
