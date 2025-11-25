/**
 * TradeHistory Component
 * Displays a table of all closed positions with detailed statistics
 */

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearHistory } from '../store/slices/tradingSlice';
import { formatUSD, formatPercentage, formatPrice } from '../utils/calculations';

export const TradeHistory = () => {
  const dispatch = useAppDispatch();
  const { 
    tradeHistory, 
    totalTrades, 
    winningTrades, 
    losingTrades,
    realizedPnL 
  } = useAppSelector((state) => state.trading);

  // Calculate statistics
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalProfit = tradeHistory
    .filter((trade) => trade.realizedPnL > 0)
    .reduce((sum, trade) => sum + trade.realizedPnL, 0);
  const totalLoss = tradeHistory
    .filter((trade) => trade.realizedPnL < 0)
    .reduce((sum, trade) => sum + trade.realizedPnL, 0);

  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Handle clear history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all trade history? This cannot be undone.')) {
      dispatch(clearHistory());
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Trade History</h2>
        {tradeHistory.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Statistics Summary */}
      {totalTrades > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total P&L */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${
              realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatUSD(realizedPnL)}
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-white">
              {winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {winningTrades}W / {losingTrades}L
            </div>
          </div>

          {/* Total Profit */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total Profit</div>
            <div className="text-2xl font-bold text-green-500">
              {formatUSD(totalProfit)}
            </div>
          </div>

          {/* Total Loss */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total Loss</div>
            <div className="text-2xl font-bold text-red-500">
              {formatUSD(totalLoss)}
            </div>
          </div>
        </div>
      )}

      {/* Trade History Table */}
      {tradeHistory.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">No trade history yet</p>
          <p className="text-sm mt-2">Open and close positions to see your trading history</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 font-medium py-3 px-2">Time</th>
                <th className="text-left text-gray-400 font-medium py-3 px-2">Side</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">Entry</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">Exit</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">Size</th>
                <th className="text-center text-gray-400 font-medium py-3 px-2">Lev</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">P&L</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">P&L %</th>
                <th className="text-right text-gray-400 font-medium py-3 px-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((trade) => (
                <tr 
                  key={trade.id} 
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  {/* Timestamp */}
                  <td className="py-3 px-2 text-gray-300 text-xs">
                    {formatTimestamp(trade.closedAt)}
                  </td>

                  {/* Side */}
                  <td className="py-3 px-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      trade.side === 'LONG'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {trade.side}
                    </span>
                  </td>

                  {/* Entry Price */}
                  <td className="py-3 px-2 text-right text-white font-medium">
                    ${formatPrice(trade.entryPrice, 2)}
                  </td>

                  {/* Exit Price */}
                  <td className="py-3 px-2 text-right text-white font-medium">
                    ${formatPrice(trade.exitPrice, 2)}
                  </td>

                  {/* Size */}
                  <td className="py-3 px-2 text-right text-gray-300">
                    {formatUSD(trade.size)}
                  </td>

                  {/* Leverage */}
                  <td className="py-3 px-2 text-center text-gray-300">
                    {trade.leverage}x
                  </td>

                  {/* P&L */}
                  <td className={`py-3 px-2 text-right font-bold ${
                    trade.realizedPnL >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatUSD(trade.realizedPnL)}
                  </td>

                  {/* P&L % */}
                  <td className={`py-3 px-2 text-right font-semibold ${
                    trade.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPercentage(trade.pnlPercent)}
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-2 text-right text-gray-400 text-xs">
                    {formatDuration(trade.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
