export type Market = 'US' | 'KR' | 'JP' | 'EU' | 'HK' | 'CN';
export type AssetCategory = 'index' | 'stock' | 'commodity' | 'forex';

export interface AssetMeta {
  symbol: string;
  name: string;
  category: AssetCategory;
  /** Only set for stocks; commodities/forex are treated as global. */
  market?: Market;
  /** Quote currency (ISO 4217) used to format the price. */
  currency: string;
  /** Only set for commodities, e.g. "oz", "barrel", "bushel". */
  unit?: string;
  basePrice: number;
}

export interface AssetQuote extends AssetMeta {
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  history: number[];
  updatedAt: number;
  /** True once at least one real fetch from a key-free provider has landed. */
  isLive: boolean;
}
