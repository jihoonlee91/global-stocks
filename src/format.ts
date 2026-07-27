import type { AssetQuote } from './types';

const CURRENCY_LOCALE: Record<string, string> = {
  USD: 'en-US',
  KRW: 'ko-KR',
  JPY: 'ja-JP',
  EUR: 'de-DE',
  CHF: 'de-CH',
  HKD: 'zh-HK',
  CNY: 'zh-CN',
  GBP: 'en-GB',
};

function formatCurrency(price: number, currency: string): string {
  const locale = CURRENCY_LOCALE[currency] ?? 'en-US';
  const fractionDigits = ['JPY', 'KRW'].includes(currency) ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(price);
}

export function formatAssetPrice(asset: AssetQuote): string {
  if (asset.category === 'forex') {
    const digits = asset.price < 10 ? 4 : 2;
    return asset.price.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  if (asset.category === 'index') {
    return asset.price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  const base = formatCurrency(asset.price, asset.currency);
  return asset.unit ? `${base} / ${asset.unit}` : base;
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
