import { useEffect, useState } from 'react';
import { ALL_ASSETS } from '../data/assets';
import type { AssetCategory, AssetQuote } from '../types';

const HISTORY_LENGTH = 30;
const TICK_MS = 1500;

// Forex moves the least tick-to-tick, commodities more, single stocks the most.
const MAX_STEP_PCT: Record<AssetCategory, number> = {
  forex: 0.0015,
  commodity: 0.004,
  stock: 0.006,
};

function createInitialQuotes(): AssetQuote[] {
  return ALL_ASSETS.map((meta) => ({
    ...meta,
    price: meta.basePrice,
    prevClose: meta.basePrice,
    change: 0,
    changePercent: 0,
    history: [meta.basePrice],
    updatedAt: Date.now(),
  }));
}

function nextPrice(price: number, category: AssetCategory): number {
  const step = (Math.random() * 2 - 1) * MAX_STEP_PCT[category];
  const next = price * (1 + step);
  const decimals = next < 10 ? 4 : 2;
  return Number(next.toFixed(decimals));
}

/**
 * Simulates a real-time quote feed with a bounded random walk around each
 * asset's base price. This is the single seam to swap for a real data
 * provider (Finnhub for equities, an FX API for forex, a commodities feed)
 * once API keys are wired up — everything downstream only depends on
 * AssetQuote[].
 */
export function useAssetFeed() {
  const [quotes, setQuotes] = useState<AssetQuote[]>(createInitialQuotes);

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          const price = nextPrice(q.price, q.category);
          const change = price - q.prevClose;
          const changePercent = (change / q.prevClose) * 100;
          const history = [...q.history, price].slice(-HISTORY_LENGTH);
          return { ...q, price, change, changePercent, history, updatedAt: Date.now() };
        }),
      );
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return quotes;
}
