/**
 * OrderPanel Component
 * Provides interface for opening positions:
 * - Leverage selector (1x-10x)
 * - Position size input in USD
 * - LONG (green) and SHORT (red) market order buttons
 */

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { openPosition } from '../store/slices/tradingSlice';
import { TRADING_CONFIG, POSITION_SIDE } from '../configs/trading.config';
import { formatUSD } from '../utils/calculations';

export const OrderPanel = () => {
  const dispatch = useAppDispatch();
  const { currentPrice } = useAppSelector((state) => state.price);
  const { balance, position } = useAppSelector((state) => state.trading);
  
  // Local state for order inputs
  const [leverage, setLeverage] = useState<number>(1);
  const [positionSize, setPositionSize] = useState<number>(
    balance * (TRADING_CONFIG.DEFAULT_POSITION_SIZE_PERCENT / 100)
  );

  // Check if user can place order
  const canPlaceOrder = !position && currentPrice > 0 && positionSize > 0 && positionSize <= balance;

  // Handle opening a position
  const handleOpenPosition = (side: typeof POSITION_SIDE.LONG | typeof POSITION_SIDE.SHORT) => {
    if (!canPlaceOrder) return;

    dispatch(openPosition({
      side,
      entryPrice: currentPrice,
      size: positionSize,
      leverage,
      timestamp: Date.now(),
    }));
  };

  // Handle leverage change
  const handleLeverageChange = (newLeverage: number) => {
    setLeverage(Math.max(TRADING_CONFIG.MIN_LEVERAGE, Math.min(TRADING_CONFIG.MAX_LEVERAGE, newLeverage)));
  };

  // Handle position size change
  const handleSizeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setPositionSize(numValue);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Open Position</h3>
      
      {/* Balance Display */}
      <div className="mb-4 p-3 bg-gray-700 rounded-lg">
        <div className="text-gray-400 text-xs mb-1">Available Balance</div>
        <div className="text-white text-xl font-bold">{formatUSD(balance)}</div>
      </div>

      {/* Leverage Selector */}
      <div className="mb-4">
        <label className="text-gray-400 text-sm font-medium mb-2 block">
          Leverage: {leverage}x
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 5, 10].map((lev) => (
            <button
              key={lev}
              onClick={() => handleLeverageChange(lev)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                leverage === lev
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
        <input
          type="range"
          min={TRADING_CONFIG.MIN_LEVERAGE}
          max={TRADING_CONFIG.MAX_LEVERAGE}
          value={leverage}
          onChange={(e) => handleLeverageChange(parseInt(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      {/* Position Size Input */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm font-medium mb-2 block">
          Position Size (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input
            type="number"
            value={positionSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter size"
            disabled={!!position}
          />
        </div>
        <div className="flex gap-2 mt-2">
          {[10, 25, 50, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => setPositionSize(balance * (percent / 100))}
              disabled={!!position}
              className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {percent}%
            </button>
          ))}
        </div>
      </div>

      {/* Order Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOpenPosition(POSITION_SIDE.LONG)}
          disabled={!canPlaceOrder}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
        >
          LONG
        </button>
        <button
          onClick={() => handleOpenPosition(POSITION_SIDE.SHORT)}
          disabled={!canPlaceOrder}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
        >
          SHORT
        </button>
      </div>

      {/* Warning Messages */}
      {position && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-sm">
          Close your current position before opening a new one
        </div>
      )}
      {!canPlaceOrder && !position && positionSize > balance && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          Insufficient balance
        </div>
      )}
    </div>
  );
};
