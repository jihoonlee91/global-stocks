# Global Market Pulse

A real-time-style dashboard for global stocks, commodities, and forex — built as
the first step toward a fintech product. React 19 + TypeScript on Vite.

## Current state (demo)

There is no real market data feed wired up yet. `src/hooks/useAssetFeed.ts`
generates a bounded random walk around each asset's base price every 1.5s, so
the UI, filtering, search, watchlist, and "insights" panel can all be built
and tested end-to-end without an API key or backend.

Data covered:

- **Stocks** — US, Korea, Japan, Europe, Hong Kong, China (`src/data/stocks.ts`)
- **Commodities** — gold, silver, crude oil (WTI/Brent), natural gas, copper,
  wheat, corn (`src/data/commodities.ts`)
- **Forex** — major pairs incl. USD/KRW, EUR/USD, USD/JPY (`src/data/forex.ts`)

## Key Commands

```bash
npm install         # install dependencies
npm run dev          # run the dev server
npm run build        # type-check (tsc -b), then vite build
npm run preview      # preview the built output locally
npm run lint          # run oxlint
```

## Architecture

- `src/types.ts` — the `AssetMeta`/`AssetQuote` shape shared by all three
  asset categories, so stocks/commodities/forex flow through one pipeline.
- `src/data/*.ts` — static seed metadata per category, combined in
  `src/data/assets.ts`.
- `src/hooks/useAssetFeed.ts` — the single seam to replace with a real
  provider (see below). Everything downstream only depends on `AssetQuote[]`.
- `src/components/` — `CategoryTabs`, `MarketFilter`, `InsightsBar`,
  `AssetTable`, `Sparkline`.
- `src/format.ts` — currency/percentage/time formatting, locale-aware per
  quote currency.

## Roadmap: replacing demo data with a real feed

Swap the body of `useAssetFeed`'s interval for real fetches, keeping the
`AssetQuote` shape:

- **Stocks**: [Finnhub](https://finnhub.io) has a free tier (60 req/min) that
  covers real-time-ish US quotes; most other free tiers are end-of-day or
  15-20 min delayed. A paid feed (Polygon.io, Twelve Data, IEX) is the next
  step for true low-latency global coverage.
- **Forex**: exchangerate.host / Frankfurter are free and keyless but update
  once a day; a paid feed (Twelve Data, OpenExchangeRates) is needed for
  intraday movement.
- **Commodities**: usually bundled into the same paid feeds as forex/equities
  (Twelve Data, Alpha Vantage premium).

Because there's no backend yet, a live provider will also need a small proxy
(API keys can't live in client-side code) — a natural point to introduce a
serverless function or lightweight backend.

## Product direction (fintech angle)

The current UI is intentionally structured so these can be layered on without
a rewrite:

- **Insights**: `InsightsBar` today only computes top gainer/loser and
  breadth client-side; a real backend could compute richer signals (sector
  moves, volatility alerts, correlation with FX) over historical data.
- **Personalization**: watchlist is in-memory only; the next step is
  persisting it (localStorage, then per-user accounts).
- **i18n**: currency/locale formatting is already centralized in
  `src/format.ts`, making it straightforward to add a language switcher.
