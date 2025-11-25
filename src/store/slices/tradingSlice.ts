/**
 * Trading slice
 * Manages the state for positions, balance, and trading operations
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TradingState, Position, ClosedPosition } from '../../types/trading.types';
import { TRADING_CONFIG } from '../../configs/trading.config';

const initialState: TradingState = {
  balance: TRADING_CONFIG.INITIAL_BALANCE,
  position: null,
  realizedPnL: 0,
  tradeHistory: [],
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
};

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    // Open a new position
    openPosition: (state, action: PayloadAction<Position>) => {
      state.position = action.payload;
    },
    
    // Close the current position and update balance
    closePosition: (state, action: PayloadAction<{ 
      pnl: number;
      exitPrice: number;
    }>) => {
      const { pnl, exitPrice } = action.payload;
      
      if (state.position) {
        // Update balance
        state.balance += pnl;
        state.realizedPnL += pnl;
        
        // Calculate statistics
        const pnlPercent = (pnl / state.position.size) * 100;
        const duration = Date.now() - state.position.timestamp;
        
        // Create closed position record
        const closedPosition: ClosedPosition = {
          id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          side: state.position.side,
          entryPrice: state.position.entryPrice,
          exitPrice: exitPrice,
          size: state.position.size,
          leverage: state.position.leverage,
          realizedPnL: pnl,
          pnlPercent: pnlPercent,
          openedAt: state.position.timestamp,
          closedAt: Date.now(),
          duration: duration,
        };
        
        // Add to history (most recent first)
        state.tradeHistory.unshift(closedPosition);
        
        // Update statistics
        state.totalTrades += 1;
        if (pnl > 0) {
          state.winningTrades += 1;
        } else if (pnl < 0) {
          state.losingTrades += 1;
        }
        
        // Clear current position
        state.position = null;
      }
    },
    
    // Reset trading state (for demo purposes)
    resetTrading: (state) => {
      state.balance = TRADING_CONFIG.INITIAL_BALANCE;
      state.position = null;
      state.realizedPnL = 0;
      state.tradeHistory = [];
      state.totalTrades = 0;
      state.winningTrades = 0;
      state.losingTrades = 0;
    },
    
    // Clear trade history
    clearHistory: (state) => {
      state.tradeHistory = [];
      state.totalTrades = 0;
      state.winningTrades = 0;
      state.losingTrades = 0;
    },
  },
});

export const { openPosition, closePosition, resetTrading, clearHistory } = tradingSlice.actions;
export default tradingSlice.reducer;
