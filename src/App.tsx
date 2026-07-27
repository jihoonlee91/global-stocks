import { useMemo, useState } from 'react';
import { useAssetFeed } from './hooks/useAssetFeed';
import { CategoryTabs } from './components/CategoryTabs';
import { MarketFilter } from './components/MarketFilter';
import { InsightsBar } from './components/InsightsBar';
import { AssetTable } from './components/AssetTable';
import type { AssetCategory, Market } from './types';
import './App.css';

function App() {
  const quotes = useAssetFeed();
  const [category, setCategory] = useState<AssetCategory>('stock');
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

  const categoryQuotes = useMemo(
    () => quotes.filter((q) => q.category === category),
    [quotes, category],
  );

  const visibleQuotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categoryQuotes.filter((q) => {
      if (category === 'stock' && market !== 'ALL' && q.market !== market) return false;
      if (watchlistOnly && !watchlist.has(q.symbol)) return false;
      if (!term) return true;
      return q.name.toLowerCase().includes(term) || q.symbol.toLowerCase().includes(term);
    });
  }, [categoryQuotes, category, market, query, watchlistOnly, watchlist]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <h1>Global Market Pulse</h1>
          <p className="tagline">Stocks · Commodities · Forex, worldwide</p>
        </div>
        <span className="demo-badge" title="Simulated random-walk data, not a live market feed">
          DEMO DATA
        </span>
      </header>

      <InsightsBar quotes={quotes} />

      <div className="controls">
        <CategoryTabs selected={category} onSelect={setCategory} />
        {category === 'stock' && <MarketFilter selected={market} onSelect={setMarket} />}
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
          Prices are simulated for demo purposes. See the README for the plan to plug in a real
          market data provider.
        </p>
      </footer>
    </div>
  );
}

export default App;
