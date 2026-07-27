import type { Market } from '../types';

const MARKETS: { id: Market | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'US', label: 'US' },
  { id: 'KR', label: 'Korea' },
  { id: 'JP', label: 'Japan' },
  { id: 'EU', label: 'Europe' },
  { id: 'HK', label: 'Hong Kong' },
  { id: 'CN', label: 'China' },
];

interface MarketFilterProps {
  selected: Market | 'ALL';
  onSelect: (market: Market | 'ALL') => void;
}

export function MarketFilter({ selected, onSelect }: MarketFilterProps) {
  return (
    <div className="market-filter" role="tablist" aria-label="Market filter">
      {MARKETS.map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={selected === m.id}
          className={`market-chip${selected === m.id ? ' active' : ''}`}
          onClick={() => onSelect(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
