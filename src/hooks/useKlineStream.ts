/**
 * WebSocket hook for Binance kline (candlestick) stream
 * Connects to Binance WebSocket and provides real-time candlestick data
 */

import { useEffect, useRef, useCallback } from 'react';
import { WS_STREAMS } from '../configs/trading.config';
import { KlineData, CandlestickData } from '../types/binance.types';

interface UseKlineStreamProps {
  onKlineUpdate: (candle: CandlestickData) => void;
}

export const useKlineStream = ({ onKlineUpdate }: UseKlineStreamProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  // Memoize the callback to prevent unnecessary reconnections
  const handleKlineUpdate = useCallback(onKlineUpdate, []);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(WS_STREAMS.KLINE_1M);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Kline WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data: KlineData = JSON.parse(event.data);
        const kline = data.k;
        
        // Convert kline data to candlestick format
        const candle: CandlestickData = {
          time: Math.floor(kline.t / 1000), // Convert to seconds
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        };
        
        handleKlineUpdate(candle);
      } catch (error) {
        console.error('Error parsing kline data:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('Kline WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Kline WebSocket disconnected');
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [handleKlineUpdate]);
};
