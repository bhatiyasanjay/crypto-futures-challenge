/**
 * Price calculation utilities
 * Helper functions for calculating PnL, ROE, and liquidation prices
 */

import { Position } from '../types/trading.types';
import { TRADING_CONFIG } from '../configs/trading.config';

/**
 * Calculate unrealized PnL for an open position
 * @param position - The open position
 * @param markPrice - Current mark price
 * @returns PnL in USD
 */
export const calculateUnrealizedPnL = (
  position: Position,
  markPrice: number
): number => {
  const { side, entryPrice, size, leverage } = position;
  const positionSize = size * leverage; // Actual position size with leverage
  const priceChange = markPrice - entryPrice;
  
  // For LONG: profit when price goes up, loss when price goes down
  // For SHORT: profit when price goes down, loss when price goes up
  const pnl = side === 'LONG' 
    ? (priceChange / entryPrice) * positionSize
    : -(priceChange / entryPrice) * positionSize;
  
  return pnl;
};

/**
 * Calculate Return on Equity (ROE) percentage
 * @param position - The open position
 * @param markPrice - Current mark price
 * @returns ROE as a percentage
 */
export const calculateROE = (
  position: Position,
  markPrice: number
): number => {
  const pnl = calculateUnrealizedPnL(position, markPrice);
  const roe = (pnl / position.size) * 100;
  return roe;
};

/**
 * Calculate approximate liquidation price
 * Formula: For LONG: entryPrice * (1 - 1/(leverage * (1 + maintenanceMarginRate)))
 *          For SHORT: entryPrice * (1 + 1/(leverage * (1 + maintenanceMarginRate)))
 * @param position - The open position
 * @returns Liquidation price
 */
export const calculateLiquidationPrice = (position: Position): number => {
  const { side, entryPrice, leverage } = position;
  const mmr = TRADING_CONFIG.MAINTENANCE_MARGIN_RATE;
  
  const liquidationFactor = 1 / (leverage * (1 + mmr));
  
  const liquidationPrice = side === 'LONG'
    ? entryPrice * (1 - liquidationFactor)
    : entryPrice * (1 + liquidationFactor);
  
  return liquidationPrice;
};

/**
 * Format price to appropriate decimal places
 * @param price - Price to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
  return price.toFixed(decimals);
};

/**
 * Format USD value with dollar sign
 * @param value - Value to format
 * @returns Formatted USD string
 */
export const formatUSD = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Format percentage value
 * @param value - Percentage value
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
