import { useMemo, useState } from 'react';
import { useAssetFeed } from './hooks/useAssetFeed';
import { CategoryTabs } from './components/CategoryTabs';
import { MarketFilter } from './components/MarketFilter';
import { InsightsBar } from './components/InsightsBar';
import { AssetTable } from './components/AssetTable';
import type { AssetCategory, Market } from './types';
import './App.css';

const MARKET_FILTER_CATEGORIES: AssetCategory[] = ['index', 'stock'];

function App() {
  const quotes = useAssetFeed();
  const [category, setCategory] = useState<AssetCategory>('index');
  const [market, setMarket] = useState<Market | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  function toggleWatch(symbol: string) {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  }

  const showMarketFilter = MARKET_FILTER_CATEGORIES.includes(category);
  const liveCount = useMemo(() => quotes.filter((q) => q.isLive).length, [quotes]);

  const categoryQuotes = useMemo(
    () => quotes.filter((q) => q.category === category),
    [quotes, category],
  );

  const visibleQuotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categoryQuotes.filter((q) => {
      if (showMarketFilter && market !== 'ALL' && q.market !== market) return false;
      if (watchlistOnly && !watchlist.has(q.symbol)) return false;
      if (!term) return true;
      return q.name.toLowerCase().includes(term) || q.symbol.toLowerCase().includes(term);
    });
  }, [categoryQuotes, showMarketFilter, market, query, watchlistOnly, watchlist]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <h1>Global Market Pulse</h1>
          <p className="tagline">Indices · Stocks · Commodities · Forex, worldwide</p>
        </div>
        <span
          className="demo-badge"
          title="Forex and gold/silver are polled live from Frankfurter and gold-api.com (both key-free); indices, individual stocks, and other commodities are simulated"
        >
          {liveCount > 0 ? `${liveCount} LIVE / REST DEMO` : 'DEMO DATA'}
        </span>
      </header>

      <InsightsBar quotes={quotes} />

      <div className="controls">
        <CategoryTabs selected={category} onSelect={setCategory} />
        {showMarketFilter && <MarketFilter selected={market} onSelect={setMarket} />}
        <div className="controls-right">
          <input
            type="search"
            className="search-input"
            placeholder="Search by name or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="watchlist-toggle">
            <input
              type="checkbox"
              checked={watchlistOnly}
              onChange={(e) => setWatchlistOnly(e.target.checked)}
            />
            Watchlist only
          </label>
        </div>
      </div>

      <AssetTable quotes={visibleQuotes} watchlist={watchlist} onToggleWatch={toggleWatch} />

      <footer className="app-footer">
        <p>
          <span className="live-dot live" /> live (key-free API) &nbsp;
          <span className="live-dot demo" /> simulated demo data. See the README for the data-source
          roadmap.
        </p>
      </footer>
    </div>
  );
}

export default App;
