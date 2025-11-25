/**
 * PositionView Component
 * Displays open position details with live updates:
 * - Side, entry price, mark price, leverage, size
 * - Unrealized PnL ($ and %)
 * - ROE %
 * - Approximate liquidation price
 * - Close position button (opens confirmation modal)
 */

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { closePosition } from '../store/slices/tradingSlice';
import {
  calculateUnrealizedPnL,
  calculateROE,
  calculateLiquidationPrice,
  formatPrice,
  formatUSD,
  formatPercentage,
} from '../utils/calculations';
import { ClosePositionModal } from './ClosePositionModal';

export const PositionView = () => {
  const dispatch = useAppDispatch();
  const { position } = useAppSelector((state) => state.trading);
  const { currentPrice } = useAppSelector((state) => state.price);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If no position, show empty state
  if (!position) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-white text-lg font-semibold mb-4">Open Position</h3>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>No open position</p>
        </div>
      </div>
    );
  }

  // Calculate live metrics
  const unrealizedPnL = calculateUnrealizedPnL(position, currentPrice);
  const roe = calculateROE(position, currentPrice);
  const liquidationPrice = calculateLiquidationPrice(position);
  const pnlPercent = (unrealizedPnL / position.size) * 100;

  // Determine colors based on PnL
  const isProfitable = unrealizedPnL >= 0;
  const pnlColorClass = isProfitable ? 'text-green-500' : 'text-red-500';
  const pnlBgClass = isProfitable ? 'bg-green-500/10' : 'bg-red-500/10';

  // Handle confirming position close
  const handleConfirmClose = () => {
    dispatch(closePosition({ 
      pnl: unrealizedPnL,
      exitPrice: currentPrice,
    }));
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-semibold">Open Position</h3>
          <span
            className={`px-3 py-1 rounded-lg font-bold ${
              position.side === 'LONG'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {position.side}
          </span>
        </div>

        {/* Position Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Entry Price */}
          <div>
            <div className="text-gray-400 text-xs mb-1">Entry Price</div>
            <div className="text-white text-lg font-semibold">
              ${formatPrice(position.entryPrice, 2)}
            </div>
          </div>

          {/* Mark Price */}
          <div>
            <div className="text-gray-400 text-xs mb-1">Mark Price</div>
            <div className="text-white text-lg font-semibold">
              ${formatPrice(currentPrice, 2)}
            </div>
          </div>

          {/* Position Size */}
          <div>
            <div className="text-gray-400 text-xs mb-1">Size</div>
            <div className="text-white text-lg font-semibold">
              {formatUSD(position.size)}
            </div>
          </div>

          {/* Leverage */}
          <div>
            <div className="text-gray-400 text-xs mb-1">Leverage</div>
            <div className="text-white text-lg font-semibold">
              {position.leverage}x
            </div>
          </div>
        </div>

        {/* Unrealized PnL - Highlighted */}
        <div className={`${pnlBgClass} rounded-lg p-4 mb-4`}>
          <div className="text-gray-400 text-xs mb-1">Unrealized PnL</div>
          <div className="flex items-baseline gap-2">
            <span className={`${pnlColorClass} text-2xl font-bold`}>
              {formatUSD(unrealizedPnL)}
            </span>
            <span className={`${pnlColorClass} text-lg font-semibold`}>
              ({formatPercentage(pnlPercent)})
            </span>
          </div>
        </div>

        {/* ROE and Liquidation Price */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* ROE */}
          <div>
            <div className="text-gray-400 text-xs mb-1">ROE</div>
            <div className={`${pnlColorClass} text-lg font-semibold`}>
              {formatPercentage(roe)}
            </div>
          </div>

          {/* Liquidation Price */}
          <div>
            <div className="text-gray-400 text-xs mb-1">Liq. Price</div>
            <div className="text-yellow-500 text-lg font-semibold">
              ${formatPrice(liquidationPrice, 2)}
            </div>
          </div>
        </div>

        {/* Close Position Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Close Position
        </button>
      </div>

      {/* Close Position Modal */}
      <ClosePositionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmClose}
        position={position}
        currentPrice={currentPrice}
      />
    </>
  );
};
