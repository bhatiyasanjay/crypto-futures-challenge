/**
 * Redux store configuration
 * Sets up the Redux store with price and trading slices
 */

import { configureStore } from '@reduxjs/toolkit';
import priceReducer from './slices/priceSlice';
import tradingReducer from './slices/tradingSlice';

export const store = configureStore({
  reducer: {
    price: priceReducer,
    trading: tradingReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
