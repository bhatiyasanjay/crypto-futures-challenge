/**
 * Trading types
 * Type definitions for positions and trading state
 */

import { PositionSide } from '../configs/trading.config';

// Open position interface
export interface Position {
  side: PositionSide;
  entryPrice: number;
  size: number; // Size in USD
  leverage: number;
  timestamp: number;
}

// Closed position interface for history
export interface ClosedPosition {
  id: string; // Unique identifier
  side: PositionSide;
  entryPrice: number;
  exitPrice: number;
  size: number;
  leverage: number;
  realizedPnL: number;
  pnlPercent: number;
  openedAt: number; // Timestamp when opened
  closedAt: number; // Timestamp when closed
  duration: number; // Duration in milliseconds
}

// Price ticker state
export interface PriceState {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

// Trading state
export interface TradingState {
  balance: number;
  position: Position | null;
  realizedPnL: number;
  tradeHistory: ClosedPosition[]; // Array of closed positions
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}
