import type { AssetMeta } from '../types';

export const INDICES: AssetMeta[] = [
  { symbol: '^GSPC', name: 'S&P 500', category: 'index', market: 'US', currency: 'USD', basePrice: 5865.4 },
  { symbol: '^IXIC', name: 'Nasdaq Composite', category: 'index', market: 'US', currency: 'USD', basePrice: 19218.2 },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', category: 'index', market: 'US', currency: 'USD', basePrice: 43297.0 },
  { symbol: '^KS11', name: 'KOSPI', category: 'index', market: 'KR', currency: 'KRW', basePrice: 2712.5 },
  { symbol: '^N225', name: 'Nikkei 225', category: 'index', market: 'JP', currency: 'JPY', basePrice: 39181.0 },
  { symbol: '^GDAXI', name: 'DAX', category: 'index', market: 'EU', currency: 'EUR', basePrice: 19571.0 },
  { symbol: '^FTSE', name: 'FTSE 100', category: 'index', market: 'EU', currency: 'GBP', basePrice: 8223.0 },
  { symbol: '^HSI', name: 'Hang Seng', category: 'index', market: 'HK', currency: 'HKD', basePrice: 19548.0 },
  { symbol: '000001.SS', name: 'Shanghai Composite', category: 'index', market: 'CN', currency: 'CNY', basePrice: 3231.0 },
];
