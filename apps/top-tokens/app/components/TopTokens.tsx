import { TrendingDown, TrendingUp } from "lucide-react";

const mockTokens = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 67834.45,
    change24h: 2.34,
    marketCap: 1340000000000,
    volume: 25600000000,
    rank: 1,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3542.12,
    change24h: -1.23,
    marketCap: 426000000000,
    volume: 15200000000,
    rank: 2,
  },
  { name: "Tether", symbol: "USDT", price: 1.0, change24h: 0.02, marketCap: 95800000000, volume: 31400000000, rank: 3 },
  { name: "BNB", symbol: "BNB", price: 593.45, change24h: 3.67, marketCap: 88900000000, volume: 2100000000, rank: 4 },
  {
    name: "Solana",
    symbol: "SOL",
    price: 178.23,
    change24h: 5.89,
    marketCap: 81200000000,
    volume: 3800000000,
    rank: 5,
  },
  { name: "XRP", symbol: "XRP", price: 0.6234, change24h: -0.45, marketCap: 35400000000, volume: 1900000000, rank: 6 },
  { name: "USDC", symbol: "USDC", price: 0.9998, change24h: 0.01, marketCap: 32100000000, volume: 7200000000, rank: 7 },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.4523,
    change24h: 4.12,
    marketCap: 15900000000,
    volume: 650000000,
    rank: 8,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.1234,
    change24h: -2.34,
    marketCap: 18100000000,
    volume: 1200000000,
    rank: 9,
  },
  { name: "TRON", symbol: "TRX", price: 0.1789, change24h: 1.78, marketCap: 15400000000, volume: 980000000, rank: 10 },
  {
    name: "Polygon",
    symbol: "MATIC",
    price: 0.8945,
    change24h: 6.23,
    marketCap: 8900000000,
    volume: 420000000,
    rank: 11,
  },
  {
    name: "Polkadot",
    symbol: "DOT",
    price: 6.234,
    change24h: -3.45,
    marketCap: 8200000000,
    volume: 180000000,
    rank: 12,
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    price: 89.45,
    change24h: 0.89,
    marketCap: 6700000000,
    volume: 890000000,
    rank: 13,
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    price: 0.000024,
    change24h: 12.45,
    marketCap: 14200000000,
    volume: 560000000,
    rank: 14,
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    price: 34.56,
    change24h: -1.89,
    marketCap: 13800000000,
    volume: 320000000,
    rank: 15,
  },
  {
    name: "Wrapped Bitcoin",
    symbol: "WBTC",
    price: 67789.12,
    change24h: 2.23,
    marketCap: 10500000000,
    volume: 280000000,
    rank: 16,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    price: 14.67,
    change24h: 3.45,
    marketCap: 8600000000,
    volume: 450000000,
    rank: 17,
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    price: 8.234,
    change24h: -0.67,
    marketCap: 6200000000,
    volume: 190000000,
    rank: 18,
  },
  {
    name: "Bitcoin Cash",
    symbol: "BCH",
    price: 456.78,
    change24h: 1.23,
    marketCap: 9000000000,
    volume: 340000000,
    rank: 19,
  },
  { name: "Stellar", symbol: "XLM", price: 0.1145, change24h: -2.1, marketCap: 3400000000, volume: 78000000, rank: 20 },
];

export const TopTokens = () => {
  return (
    <div className="space-y-4">
      {mockTokens.slice(0, 4).map((token) => {
        const isPositive = token.change24h >= 0;
        return (
          <div
            key={token.symbol}
            className="glass-card p-6 rounded-2xl token-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{token.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">{token.name}</h3>
                  <p className="text-sm text-text-secondary">{token.symbol}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${isPositive ? "text-success" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">Price</span>
                <span className="price-highlight">${token.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">24h Change</span>
                <span className={`font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? "+" : ""}
                  {token.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
