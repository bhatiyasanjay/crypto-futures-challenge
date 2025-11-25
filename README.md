# Crypto Futures Trading Challenge (2 hours strict)

## Goal
Build a real-time BTC/USDT perpetual futures mini-dashboard with live Binance data.

## Required stack
- React 18 + TypeScript (strict – no `any`)
- Tailwind CSS
- Redux Toolkit
- TradingView Lightweight Charts
- WebSocket (Binance public streams)

## Must-have features
1. Live price ticker (`wss://stream.binance.com:9443/ws/btcusdt@miniTicker`)
   - Current price + 24h % change (green/red)
2. Live 1m candlestick chart using TradingView Lightweight Charts (`btcusdt@kline_1m`)
3. Order panel
   - Leverage selector (1x–10x)
   - Size input in USD (default 10% of $100k virtual balance)
   - LONG (green) & SHORT (red) market buttons
4. Open position view
   - Side, entry price, mark price, leverage, size
   - Live unrealized PnL ($ and %), ROE %
   - Approximate liquidation price
   - Close button (show realized PnL)

## Rules
- 2 hours from the moment you clone
- Submit live CodeSandbox/StackBlitz link OR GitHub repo
- Must run with `npm install && npm run dev`
- Dark mode, responsive, professional trading UI

## Start
```bash
git clone https://github.com/yourusername/crypto-futures-challenge.git
cd crypto-futures-challenge
npm install
npm run dev
