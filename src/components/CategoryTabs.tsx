import type { AssetCategory } from '../types';

const CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: 'index', label: 'Indices' },
  { id: 'stock', label: 'Stocks' },
  { id: 'commodity', label: 'Commodities' },
  { id: 'forex', label: 'Forex' },
];

interface CategoryTabsProps {
  selected: AssetCategory;
  onSelect: (category: AssetCategory) => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="category-tabs" role="tablist" aria-label="Asset category">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          role="tab"
          aria-selected={selected === c.id}
          className={`category-tab${selected === c.id ? ' active' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
