import type { AssetQuote } from '../types';
import { formatAssetPrice, formatPercent, formatTime } from '../format';
import { Sparkline } from './Sparkline';

interface AssetTableProps {
  quotes: AssetQuote[];
  watchlist: Set<string>;
  onToggleWatch: (symbol: string) => void;
}

function tagFor(quote: AssetQuote): string {
  if (quote.category === 'index' || quote.category === 'stock') return quote.market ?? '';
  if (quote.category === 'commodity') return quote.unit ?? '';
  return 'FX';
}

export function AssetTable({ quotes, watchlist, onToggleWatch }: AssetTableProps) {
  if (quotes.length === 0) {
    return <p className="empty-state">No results match your search.</p>;
  }

  return (
    <div className="stock-table" role="table">
      <div className="stock-row stock-row--head" role="row">
        <span role="columnheader" className="col-star" />
        <span role="columnheader" className="col-name">
          Name
        </span>
        <span role="columnheader" className="col-market">
          Tag
        </span>
        <span role="columnheader" className="col-chart">
          Trend
        </span>
        <span role="columnheader" className="col-price">
          Price
        </span>
        <span role="columnheader" className="col-change">
          Change
        </span>
        <span role="columnheader" className="col-updated">
          Updated
        </span>
      </div>
      {quotes.map((q) => {
        const positive = q.change >= 0;
        return (
          <div key={q.symbol} className="stock-row" role="row">
            <span className="col-star">
              <button
                type="button"
                className={`star-btn${watchlist.has(q.symbol) ? ' active' : ''}`}
                onClick={() => onToggleWatch(q.symbol)}
                aria-label={watchlist.has(q.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                ★
              </button>
            </span>
            <span className="col-name">
              <span className="stock-name">
                {q.name}
                <span
                  className={`live-dot ${q.isLive ? 'live' : 'demo'}`}
                  title={q.isLive ? 'Live (key-free API)' : 'Simulated demo data'}
                />
              </span>
              <span className="stock-symbol">{q.symbol}</span>
            </span>
            <span className="col-market">
              <span className="market-badge">{tagFor(q)}</span>
            </span>
            <span className="col-chart">
              <Sparkline values={q.history} positive={positive} />
            </span>
            <span className="col-price">{formatAssetPrice(q)}</span>
            <span className={`col-change ${positive ? 'up' : 'down'}`}>
              {positive ? '▲' : '▼'} {formatPercent(q.changePercent)}
            </span>
            <span className="col-updated">{formatTime(q.updatedAt)}</span>
          </div>
        );
      })}
    </div>
  );
}
