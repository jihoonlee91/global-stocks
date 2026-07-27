# Global Market Pulse

A real-time-style dashboard for global indices, stocks, commodities, and
forex — built as the first step toward a fintech product. React 19 +
TypeScript on Vite.

Live demo: https://jihoonlee91.github.io/global-stocks/

## Current state

Two key-free public APIs are wired in for real data; everything else the
dashboard shows is a simulated random walk, since a genuinely free +
key-free + real-time feed doesn't exist for those categories:

| Category | Source | Notes |
|---|---|---|
| Forex | [Frankfurter](https://frankfurter.dev) | Real ECB reference rates, no key. Updates once per business day (no intraday ticks) — that's the tradeoff for needing no key. |
| Gold / Silver | [gold-api.com](https://gold-api.com) | Real live spot price, no key. |
| Indices, individual stocks, other commodities (oil, gas, copper, wheat, corn) | simulated | No free + key-free real-time source exists; `src/hooks/useAssetFeed.ts` generates a bounded random walk instead so the UI is fully testable. |

Each row shows a small dot (green = live, gray = demo) so it's always clear
which numbers are real. The header badge counts how many assets are
currently live.

If a live provider is unreachable (offline, CORS, rate-limited), the affected
asset just keeps its last known value until the next successful poll — it
never silently reverts to fabricated numbers once it has gone live.

## Key Commands

```bash
npm install         # install dependencies
npm run dev          # run the dev server
npm run build        # type-check (tsc -b), then vite build
npm run preview      # preview the built output locally
npm run lint          # run oxlint
```

## Architecture

- `src/types.ts` — the `AssetMeta`/`AssetQuote` shape shared by all four
  asset categories, so indices/stocks/commodities/forex flow through one
  pipeline.
- `src/data/*.ts` — static seed metadata per category, combined in
  `src/data/assets.ts`.
- `src/services/frankfurter.ts`, `src/services/goldApi.ts` — the two
  key-free live data providers.
- `src/hooks/useAssetFeed.ts` — combines the simulated tick and the live poll
  into one `AssetQuote[]`. This is the seam to extend when a paid provider
  is added later.
- `src/components/` — `CategoryTabs`, `MarketFilter`, `InsightsBar`,
  `AssetTable`, `Sparkline`.
- `src/format.ts` — currency/percentage/time formatting, locale-aware per
  quote currency.

## Deployment

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages
on every push to `main` (via the official `actions/configure-pages` +
`actions/deploy-pages` flow). `vite.config.ts` sets `base: '/global-stocks/'`
to match the Pages URL path.

One-time manual step: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions** (only needed once — the workflow handles every deploy
after that).

## Roadmap: replacing demo data with a real feed

- **Stocks**: [Finnhub](https://finnhub.io) has a free tier (60 req/min,
  ~20 min delay) that's the best free option once an API key is acceptable;
  a paid feed (Polygon.io, Twelve Data, IEX) is the next step for true
  low-latency global coverage.
- **Indices**: bundled into the same paid feeds as equities.
- **Other commodities** (oil, gas, copper, wheat, corn): no free tier at all;
  cheapest paid options are Twelve Data / Alpha Vantage premium /
  CommodityPriceAPI.

Any of these needs an API key, which can't live in client-side code — so
adding them is also the point where a small backend/serverless proxy becomes
necessary.

## Product direction (fintech angle)

The current UI is intentionally structured so these can be layered on
without a rewrite:

- **Insights**: `InsightsBar` today only computes top gainer/loser and
  breadth client-side, with no LLM involved — it's meant to stay a simple,
  deterministic computation over the quote list rather than growing into an
  AI feature. A real backend could extend this with richer signals (sector
  moves, volatility alerts, correlation with FX) computed the same way, over
  full historical data.
- **Personalization**: watchlist is in-memory only; the next step is
  persisting it (localStorage, then per-user accounts).
- **i18n**: currency/locale formatting is already centralized in
  `src/format.ts`, making it straightforward to add a language switcher.
