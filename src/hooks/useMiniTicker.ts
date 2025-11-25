/**
 * WebSocket hook for Binance mini ticker stream
 * Connects to Binance WebSocket and updates price data in Redux store
 */

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updatePrice } from '../store/slices/priceSlice';
import { WS_STREAMS } from '../configs/trading.config';
import { MiniTickerData } from '../types/binance.types';

export const useMiniTicker = () => {
  const dispatch = useAppDispatch();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(WS_STREAMS.MINI_TICKER);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Mini ticker WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data: MiniTickerData = JSON.parse(event.data);
        
        // Parse price data and dispatch to Redux
        const currentPrice = parseFloat(data.c);
        const openPrice = parseFloat(data.o);
        
        dispatch(updatePrice({ currentPrice, openPrice }));
      } catch (error) {
        console.error('Error parsing mini ticker data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Mini ticker WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Mini ticker WebSocket disconnected');
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [dispatch]);
};
