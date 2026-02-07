import { useState, useEffect } from 'react';
import { TrendingUp, Skull, Coins } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface TradingInterfaceProps {
  questId: string;
  onComplete: (results: any) => void;
}

export function TradingInterface({ questId, onComplete }: TradingInterfaceProps) {
  const [gold, setGold] = useState(10000);
  const [sanity, setSanity] = useState(100);
  const [position, setPosition] = useState<'none' | 'long' | 'short'>('none');
  const [narrativeLog, setNarrativeLog] = useState<string[]>([
    'You enter the trading floor. The air is thick with tension...',
    'Market opens at 1000. Your gold purse weighs heavy.',
    'What will you do, trader?',
  ]);

  // Generate mock chart data
  const [chartData, setChartData] = useState(() => {
    const data = [];
    let price = 1000;
    for (let i = 0; i < 50; i++) {
      price += (Math.random() - 0.48) * 50; // Slight downward bias
      data.push({
        time: i,
        price: Math.max(500, price),
      });
    }
    return data;
  });

  const addNarrative = (text: string) => {
    setNarrativeLog((prev) => [...prev, text]);
  };

  const handleBuy = () => {
    if (position === 'none' && gold >= 1000) {
      setPosition('long');
      setGold((g) => g - 1000);
      setSanity((s) => Math.max(0, s - 5));
      addNarrative('⚔️ You BOUGHT at current price! Your fate is sealed...');
    }
  };

  const handleSell = () => {
    if (position === 'long') {
      const currentPrice = chartData[chartData.length - 1]?.price || 1000;
      const profit = currentPrice - 1000;
      setGold((g) => g + 1000 + profit);
      setPosition('none');
      setSanity((s) => Math.max(0, s - 3));
      addNarrative(
        profit > 0
          ? `💰 SOLD for profit of ${profit.toFixed(0)} gold!`
          : `💀 SOLD for loss of ${Math.abs(profit).toFixed(0)} gold...`
      );
    } else if (position === 'none') {
      setPosition('short');
      setSanity((s) => Math.max(0, s - 8));
      addNarrative('🔻 You SHORTED the market! Risky move, trader...');
    }
  };

  const handleUseItem = () => {
    setSanity((s) => Math.min(100, s + 15));
    addNarrative('🧪 You used a Potion of Clarity. Your mind clears...');
  };

  const handleComplete = () => {
    onComplete({
      finalGold: gold,
      finalSanity: sanity,
      profit: gold - 10000,
      grade: gold > 11000 ? 'A' : gold > 10000 ? 'B+' : 'C',
    });
  };

  // Auto-scroll narrative
  useEffect(() => {
    const narrative = document.getElementById('narrative-log');
    if (narrative) {
      narrative.scrollTop = narrative.scrollHeight;
    }
  }, [narrativeLog]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="relative z-10 h-screen flex">
        {/* Left Column - Narrative & Actions (30%) */}
        <div className="w-full lg:w-[30%] flex flex-col border-r-2 border-amber-500/20 p-6 space-y-4">
          {/* Quest Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-['Cinzel'] text-amber-500">The Flash Crash</h2>
            <p className="text-sm font-['Crimson_Text'] text-amber-500/60">May 6, 2010</p>
          </div>

          {/* Narrative Log */}
          <div className="flex-1 bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-4 overflow-hidden"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            }}
          >
            <h3 className="text-lg font-['Cinzel'] text-amber-500 mb-3">Narrative Log</h3>
            <ScrollArea className="h-[calc(100%-2rem)]" id="narrative-log">
              <div className="space-y-2 pr-4">
                {narrativeLog.map((text, i) => (
                  <p
                    key={i}
                    className="text-sm font-['Crimson_Text'] text-amber-100/80 leading-relaxed"
                  >
                    {text}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Action Panel */}
          <div className="bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-4"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            }}
          >
            <h3 className="text-lg font-['Cinzel'] text-amber-500 mb-4">Action Panel</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleBuy}
                disabled={position !== 'none'}
                className="bg-green-600 hover:bg-green-700 text-white font-['Cinzel'] disabled:opacity-50"
              >
                Buy
              </Button>
              <Button
                onClick={handleSell}
                className="bg-red-600 hover:bg-red-700 text-white font-['Cinzel']"
              >
                Sell
              </Button>
              <Button
                onClick={handleUseItem}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-['Cinzel']"
              >
                Use Item
              </Button>
              <Button
                onClick={handleComplete}
                className="col-span-2 bg-amber-500 hover:bg-amber-600 text-black font-['Cinzel']"
              >
                Complete Quest
              </Button>
            </div>

            {/* Position indicator */}
            {position !== 'none' && (
              <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-center">
                <span className="text-sm font-['Cinzel'] text-amber-500">
                  Position: {position.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Chart & Status (70%) */}
        <div className="hidden lg:flex w-[70%] flex-col p-6 space-y-4">
          {/* Chart */}
          <div className="flex-1 bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F59E0B20" />
                <XAxis dataKey="time" stroke="#F59E0B" />
                <YAxis stroke="#F59E0B" domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a24',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '0.5rem',
                    fontFamily: 'Cinzel',
                  }}
                  labelStyle={{ color: '#F59E0B' }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Wizard Avatar */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-b from-amber-500/20 to-purple-900/20 border-2 border-amber-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-6"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Gold */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span className="font-['Cinzel'] text-amber-500">Gold</span>
                </div>
                <div className="text-3xl font-['Cinzel'] text-amber-100">{gold.toFixed(0)}</div>
              </div>

              {/* Sanity */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skull className="w-5 h-5 text-red-500" />
                  <span className="font-['Cinzel'] text-red-500">Sanity</span>
                </div>
                <Progress
                  value={sanity}
                  className="h-6 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-red-600 [&>div]:to-red-500"
                />
                <div className="text-sm font-['Cinzel'] text-red-400 mt-1">{sanity}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
