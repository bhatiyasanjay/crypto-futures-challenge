/**
 * TradingViewChart Component
 * Displays real-time candlestick chart using TradingView Lightweight Charts
 * Connected to Binance kline WebSocket stream for live 1m candles
 */

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData as LWCCandlestickData } from 'lightweight-charts';
import { useKlineStream } from '../hooks/useKlineStream';
import { CandlestickData } from '../types/binance.types';

export const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Handle incoming kline updates from WebSocket
  const handleKlineUpdate = (candle: CandlestickData) => {
    if (candlestickSeriesRef.current) {
      // Update the chart with new candle data
      const chartData: LWCCandlestickData = {
        time: candle.time as LWCCandlestickData['time'],
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      };
      candlestickSeriesRef.current.update(chartData);
    }
  };

  // Connect to kline WebSocket stream
  useKlineStream({ onKlineUpdate: handleKlineUpdate });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1f2937' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-white text-sm font-medium mb-3">BTC/USDT 1m Chart</h3>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
