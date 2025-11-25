/**
 * Main App Component
 * Assembles all components into a responsive dark mode trading dashboard
 * Initializes WebSocket connections for live data
 */

import { useMiniTicker } from './hooks/useMiniTicker';
import { PriceTicker } from './components/PriceTicker';
import { TradingViewChart } from './components/TradingViewChart';
import { OrderPanel } from './components/OrderPanel';
import { PositionView } from './components/PositionView';
import { TradeHistory } from './components/TradeHistory';

function App() {
  // Initialize mini ticker WebSocket connection
  useMiniTicker();

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-white text-3xl font-bold mb-2">
            BTC/USDT Perpetual Futures
          </h1>
          <p className="text-gray-400 text-sm">
            Real-time trading dashboard with live Binance data
          </p>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Chart and Price */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Ticker */}
            <PriceTicker />
            
            {/* Trading Chart */}
            <TradingViewChart />
          </div>

          {/* Right Column - Order Panel and Position */}
          <div className="space-y-6">
            {/* Order Panel */}
            <OrderPanel />
            
            {/* Position View */}
            <PositionView />
          </div>
        </div>

        {/* Trade History Section - Full Width */}
        <div className="mb-6">
          <TradeHistory />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Demo Trading Dashboard • Virtual Balance: $100,000</p>
          <p className="mt-1">Data provided by Binance WebSocket Streams</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
