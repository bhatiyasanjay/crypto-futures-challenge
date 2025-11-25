/**
 * Price slice
 * Manages the state for BTC/USDT price data from mini ticker stream
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PriceState } from '../../types/trading.types';

const initialState: PriceState = {
  currentPrice: 0,
  priceChange24h: 0,
  priceChangePercent24h: 0,
};

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {
    // Update price data from mini ticker
    updatePrice: (state, action: PayloadAction<{
      currentPrice: number;
      openPrice: number;
    }>) => {
      const { currentPrice, openPrice } = action.payload;
      state.currentPrice = currentPrice;
      state.priceChange24h = currentPrice - openPrice;
      state.priceChangePercent24h = ((currentPrice - openPrice) / openPrice) * 100;
    },
  },
});

export const { updatePrice } = priceSlice.actions;
export default priceSlice.reducer;
