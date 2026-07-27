import type { AssetMeta } from '../types';

export const COMMODITIES: AssetMeta[] = [
  { symbol: 'XAUUSD', name: 'Gold', category: 'commodity', currency: 'USD', unit: 'oz', basePrice: 2658.4 },
  { symbol: 'XAGUSD', name: 'Silver', category: 'commodity', currency: 'USD', unit: 'oz', basePrice: 30.85 },
  { symbol: 'WTI', name: 'Crude Oil (WTI)', category: 'commodity', currency: 'USD', unit: 'barrel', basePrice: 68.9 },
  { symbol: 'BRENT', name: 'Crude Oil (Brent)', category: 'commodity', currency: 'USD', unit: 'barrel', basePrice: 72.4 },
  { symbol: 'NATGAS', name: 'Natural Gas', category: 'commodity', currency: 'USD', unit: 'MMBtu', basePrice: 3.42 },
  { symbol: 'HG', name: 'Copper', category: 'commodity', currency: 'USD', unit: 'lb', basePrice: 4.28 },
  { symbol: 'ZW', name: 'Wheat', category: 'commodity', currency: 'USD', unit: 'bushel', basePrice: 545.0 },
  { symbol: 'ZC', name: 'Corn', category: 'commodity', currency: 'USD', unit: 'bushel', basePrice: 431.5 },
];
