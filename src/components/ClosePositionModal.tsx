/**
 * ClosePositionModal Component
 * Confirmation modal for closing positions with detailed P&L information
 */

import { Modal } from './Modal';
import { Position } from '../types/trading.types';
import {
  calculateUnrealizedPnL,
  calculateROE,
  formatUSD,
  formatPercentage,
  formatPrice,
} from '../utils/calculations';

interface ClosePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  position: Position;
  currentPrice: number;
}

export const ClosePositionModal = ({
  isOpen,
  onClose,
  onConfirm,
  position,
  currentPrice,
}: ClosePositionModalProps) => {
  // Calculate final P&L
  const unrealizedPnL = calculateUnrealizedPnL(position, currentPrice);
  const roe = calculateROE(position, currentPrice);
  const pnlPercent = (unrealizedPnL / position.size) * 100;
  const isProfitable = unrealizedPnL >= 0;
  
  // Calculate duration
  const duration = Date.now() - position.timestamp;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Close Position" size="md">
      <div className="space-y-6">
        {/* Warning Message */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-500 font-medium mb-1">Confirm Position Close</p>
              <p className="text-gray-400 text-sm">
                You are about to close your {position.side} position. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">Side</div>
            <div className={`text-lg font-bold ${
              position.side === 'LONG' ? 'text-green-500' : 'text-red-500'
            }`}>
              {position.side}
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm mb-1">Leverage</div>
            <div className="text-white text-lg font-semibold">{position.leverage}x</div>
          </div>

          <div>
            <div className="text-gray-400 text-sm mb-1">Entry Price</div>
            <div className="text-white text-lg font-semibold">${formatPrice(position.entryPrice, 2)}</div>
          </div>

          <div>
            <div className="text-gray-400 text-sm mb-1">Exit Price</div>
            <div className="text-white text-lg font-semibold">${formatPrice(currentPrice, 2)}</div>
          </div>

          <div>
            <div className="text-gray-400 text-sm mb-1">Position Size</div>
            <div className="text-white text-lg font-semibold">{formatUSD(position.size)}</div>
          </div>

          <div>
            <div className="text-gray-400 text-sm mb-1">Duration</div>
            <div className="text-white text-lg font-semibold">
              {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`}
            </div>
          </div>
        </div>

        {/* P&L Summary - Highlighted */}
        <div className={`${
          isProfitable ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        } border rounded-lg p-6`}>
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Realized P&L</div>
            <div className={`${
              isProfitable ? 'text-green-500' : 'text-red-500'
            } text-4xl font-bold mb-2`}>
              {formatUSD(unrealizedPnL)}
            </div>
            <div className={`${
              isProfitable ? 'text-green-500' : 'text-red-500'
            } text-2xl font-semibold`}>
              {formatPercentage(pnlPercent)}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-gray-400 text-xs mb-1">Return on Equity (ROE)</div>
              <div className={`${
                isProfitable ? 'text-green-500' : 'text-red-500'
              } text-xl font-bold`}>
                {formatPercentage(roe)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 font-bold py-3 rounded-lg transition-colors ${
              isProfitable
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Confirm Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
