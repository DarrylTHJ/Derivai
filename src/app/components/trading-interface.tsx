import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Skull, Coins, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { api, MarketDay } from '../api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TradingInterfaceProps {
  questId: string;
  onComplete: (results: any) => void;
}

export function TradingInterface({ questId, onComplete }: TradingInterfaceProps) {
  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayIndex, setDayIndex] = useState(0);
  const [fullHistory, setFullHistory] = useState<MarketDay[]>([]);
  const [displayedData, setDisplayedData] = useState<MarketDay[]>([]);
  
  // Player Stats
  const [gold, setGold] = useState(10000);
  const [sanity, setSanity] = useState(100);
  const [position, setPosition] = useState<'none' | 'long' | 'short'>('none');
  const [entryPrice, setEntryPrice] = useState(0);
  const [narrativeLog, setNarrativeLog] = useState<string[]>([
    'Initializing connection to the Guild Archives...',
  ]);

  // 1. Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Map questId to level file (default to level_1)
        const levelMap: Record<string, string> = {
          'quest-1': 'level_1',
          'quest-2': 'level_2',
          'quest-3': 'level_3'
        };
        const levelFile = levelMap[questId] || 'level_1';
        
        addNarrative(`Loading scroll: ${levelFile}...`);
        const data = await api.loadLevel(levelFile);
        
        setFullHistory(data.market_data);
        // Start with first 30 days so chart isn't empty
        setDisplayedData(data.market_data.slice(0, 30));
        setDayIndex(30);
        addNarrative("Market Open. The simulation begins.");
        setIsPlaying(true);
      } catch (e) {
        addNarrative("Error: Could not load market data. Is the backend running?");
      }
    };
    loadData();
  }, [questId]);

  // 2. The Game Loop (Ticker)
  useEffect(() => {
    let interval: any;
    if (isPlaying && dayIndex < fullHistory.length) {
      interval = setInterval(() => {
        setDayIndex(prev => {
          const next = prev + 1;
          // Update Chart
          setDisplayedData(fullHistory.slice(0, next));
          
          // Check for Events (every 5 days)
          if (next % 5 === 0) {
            const today = fullHistory[next - 1];
            // Trigger AI Narrative
            api.analyzeTurn(today.change).then(res => {
               if (res.narrative) addNarrative(`Day ${next}: ${res.narrative}`);
            });
          }
          return next;
        });
      }, 500); // Speed: 0.5s per day
    } else if (dayIndex >= fullHistory.length && fullHistory.length > 0) {
      setIsPlaying(false);
      addNarrative("Simulation Ended.");
    }
    return () => clearInterval(interval);
  }, [isPlaying, dayIndex, fullHistory]);

  // Helpers
  const getCurrentPrice = () => {
    if (displayedData.length === 0) return 0;
    return displayedData[displayedData.length - 1].price;
  }

  const addNarrative = (text: string) => {
    setNarrativeLog((prev) => [...prev, text]);
  };

  // Actions
  const handleBuy = () => {
    const price = getCurrentPrice();
    if (position === 'none' && gold >= price) {
      setPosition('long');
      setEntryPrice(price);
      setGold((g) => g - price);
      addNarrative(`💰 You BOUGHT at ${price.toFixed(2)} gold.`);
    }
  };

  const handleSell = () => {
    const price = getCurrentPrice();
    if (position === 'long') {
      const profit = price - entryPrice;
      setGold((g) => g + price); // Return principal + profit
      setPosition('none');
      setEntryPrice(0);
      addNarrative(profit > 0 ? `📈 SOLD! Profit: +${profit.toFixed(0)}` : `📉 SOLD. Loss: ${profit.toFixed(0)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-amber-500 font-['Cinzel'] p-4 flex gap-4">
      {/* Left Panel */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="bg-[#1a1a24] p-4 rounded border border-amber-900/50 h-[200px] overflow-auto">
           <h3 className="text-xl mb-2 border-b border-amber-900">Narrative Log</h3>
           <div className="flex flex-col-reverse">
             {narrativeLog.slice(-6).map((msg, i) => (
               <p key={i} className="text-sm text-amber-100/70 font-sans">{msg}</p>
             ))}
           </div>
        </div>

        <div className="bg-[#1a1a24] p-6 rounded border border-amber-900/50 flex flex-col gap-3">
           <div className="flex justify-between text-2xl">
             <span>Gold: {gold.toFixed(0)}</span>
             <span>Sanity: {sanity}%</span>
           </div>
           <div className="grid grid-cols-2 gap-2 mt-4">
             <Button onClick={handleBuy} disabled={position !== 'none'} className="bg-green-700 hover:bg-green-600">BUY</Button>
             <Button onClick={handleSell} disabled={position !== 'long'} className="bg-red-700 hover:bg-red-600">SELL</Button>
           </div>
           <Button onClick={() => setIsPlaying(!isPlaying)} variant="outline" className="mt-2 border-amber-500">
             {isPlaying ? <Pause className="mr-2"/> : <Play className="mr-2"/>} {isPlaying ? "Pause" : "Resume"}
           </Button>
        </div>
      </div>

      {/* Right Panel (Chart) */}
      <div className="w-2/3 bg-[#1a1a24] p-4 rounded border border-amber-900/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayedData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" hide />
            <YAxis domain={['auto', 'auto']} stroke="#F59E0B" />
            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #F59E0B' }} />
            <Area type="monotone" dataKey="price" stroke="#F59E0B" fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}