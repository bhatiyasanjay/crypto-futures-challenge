/**
 * Trading configuration constants
 * Contains all the configuration values for the trading dashboard
 */

export const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

// WebSocket stream endpoints
export const WS_STREAMS = {
  MINI_TICKER: `${BINANCE_WS_BASE}/btcusdt@miniTicker`,
  KLINE_1M: `${BINANCE_WS_BASE}/btcusdt@kline_1m`,
} as const;

// Trading constants
export const TRADING_CONFIG = {
  INITIAL_BALANCE: 100000, // $100k virtual balance
  DEFAULT_POSITION_SIZE_PERCENT: 10, // 10% of balance
  MIN_LEVERAGE: 1,
  MAX_LEVERAGE: 10,
  MAINTENANCE_MARGIN_RATE: 0.004, // 0.4% for BTC/USDT perpetual
} as const;

// Position side types
export const POSITION_SIDE = {
  LONG: 'LONG',
  SHORT: 'SHORT',
} as const;

export type PositionSide = typeof POSITION_SIDE[keyof typeof POSITION_SIDE];
