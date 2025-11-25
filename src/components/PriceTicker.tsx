/**
 * PriceTicker Component
 * Displays live BTC/USDT price with 24h change percentage
 * Green for positive change, red for negative change
 */

import { useAppSelector } from '../store/hooks';
import { formatPrice, formatPercentage } from '../utils/calculations';

export const PriceTicker = () => {
  const { currentPrice, priceChangePercent24h } = useAppSelector((state) => state.price);
  
  // Determine color based on price change
  const isPositive = priceChangePercent24h >= 0;
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const bgClass = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-400 text-sm font-medium mb-1">BTC/USDT</h2>
          <div className="flex items-baseline gap-3">
            <span className="text-white text-3xl font-bold">
              {currentPrice > 0 ? formatPrice(currentPrice, 2) : '--'}
            </span>
            <span className={`text-sm font-medium ${colorClass}`}>
              USD
            </span>
          </div>
        </div>
        
        <div className={`${bgClass} ${colorClass} px-4 py-2 rounded-lg`}>
          <div className="text-xs font-medium mb-0.5">24h Change</div>
          <div className="text-lg font-bold">
            {currentPrice > 0 ? formatPercentage(priceChangePercent24h) : '--'}
          </div>
        </div>
      </div>
    </div>
  );
};
