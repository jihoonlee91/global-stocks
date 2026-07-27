import { INDICES } from './indices';
import { STOCKS } from './stocks';
import { COMMODITIES } from './commodities';
import { FOREX } from './forex';
import type { AssetMeta } from '../types';

export const ALL_ASSETS: AssetMeta[] = [...INDICES, ...STOCKS, ...COMMODITIES, ...FOREX];
