import type { AssetQuote } from '../types';
import { formatPercent } from '../format';

interface InsightsBarProps {
  quotes: AssetQuote[];
}

/**
 * A first cut at "financial insight" surfacing on top of the raw quote feed:
 * biggest mover and overall breadth. Kept intentionally small (no ranking
 * config, no personalization) since it will grow into an insights service of
 * its own once there's a real backend to compute over full history.
 */
export function InsightsBar({ quotes }: InsightsBarProps) {
  if (quotes.length === 0) return null;

  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const topGainer = sorted[0];
  const topLoser = sorted[sorted.length - 1];
  const upCount = quotes.filter((q) => q.change >= 0).length;
  const downCount = quotes.length - upCount;

  return (
    <div className="insights-bar">
      <div className="insight-card">
        <span className="insight-label">Top Gainer</span>
        <span className="insight-value up">
          {topGainer.name} {formatPercent(topGainer.changePercent)}
        </span>
      </div>
      <div className="insight-card">
        <span className="insight-label">Top Loser</span>
        <span className="insight-value down">
          {topLoser.name} {formatPercent(topLoser.changePercent)}
        </span>
      </div>
      <div className="insight-card">
        <span className="insight-label">Market Pulse</span>
        <span className="insight-value">
          <span className="up">{upCount} up</span> / <span className="down">{downCount} down</span>
        </span>
      </div>
    </div>
  );
}
