import { useEffect, useState } from 'react';
import { ALL_ASSETS } from '../data/assets';
import { deriveForexPrice, fetchUsdRates } from '../services/frankfurter';
import { fetchMetalPrice } from '../services/goldApi';
import type { AssetCategory, AssetQuote } from '../types';

const HISTORY_LENGTH = 30;
const TICK_MS = 1500;
const LIVE_POLL_MS = 60_000;

// Simulated-tick volatility, used for every asset until (if ever) a live
// value for it arrives. Forex/indices move less tick-to-tick than a single
// stock; commodities sit in between.
const MAX_STEP_PCT: Record<AssetCategory, number> = {
  forex: 0.0015,
  index: 0.003,
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
    isLive: false,
  }));
}

function nextPrice(price: number, category: AssetCategory): number {
  const step = (Math.random() * 2 - 1) * MAX_STEP_PCT[category];
  const next = price * (1 + step);
  const decimals = next < 10 ? 4 : 2;
  return Number(next.toFixed(decimals));
}

/**
 * Quote feed for the whole asset universe. Two independent update paths feed
 * the same AssetQuote[] state:
 *
 * 1. A fast (1.5s) simulated random walk, used for every asset that has no
 *    key-free real data source (all stocks/indices, most commodities).
 * 2. A slower (60s) poll against key-free providers (Frankfurter for forex,
 *    gold-api.com for gold/silver) that overwrites price/history for the
 *    assets they cover and flips `isLive: true`. Once an asset is live, the
 *    random walk leaves it alone — no more fake jitter on real numbers.
 *
 * If a live provider is unreachable (offline, CORS, rate-limited) the asset
 * simply keeps its last known value until the next successful poll; it never
 * silently falls back to fabricated numbers once it has gone live.
 */
export function useAssetFeed() {
  const [quotes, setQuotes] = useState<AssetQuote[]>(createInitialQuotes);

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          if (q.isLive) return q;
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

  useEffect(() => {
    let cancelled = false;

    async function pollLive() {
      const [usdRates, gold, silver] = await Promise.all([
        fetchUsdRates(),
        fetchMetalPrice('XAU'),
        fetchMetalPrice('XAG'),
      ]);
      if (cancelled) return;

      setQuotes((prev) =>
        prev.map((q) => {
          let livePrice: number | null = null;
          if (q.category === 'forex' && usdRates) {
            livePrice = deriveForexPrice(q.symbol, usdRates);
          } else if (q.symbol === 'XAUUSD') {
            livePrice = gold;
          } else if (q.symbol === 'XAGUSD') {
            livePrice = silver;
          }
          if (livePrice == null) return q;

          const prevClose = q.isLive ? q.prevClose : livePrice;
          const change = livePrice - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;
          const history = q.isLive ? [...q.history, livePrice].slice(-HISTORY_LENGTH) : [livePrice];
          return {
            ...q,
            price: livePrice,
            prevClose,
            change,
            changePercent,
            history,
            updatedAt: Date.now(),
            isLive: true,
          };
        }),
      );
    }

    pollLive();
    const id = setInterval(pollLive, LIVE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return quotes;
}
