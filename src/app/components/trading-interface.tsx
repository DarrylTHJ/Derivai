import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Skull, Coins, ArrowRight, Activity } from 'lucide-react';
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
  // --- STATE ---
  const [dayIndex, setDayIndex] = useState(0);
  const [fullHistory, setFullHistory] = useState<MarketDay[]>([]);
  const [displayedData, setDisplayedData] = useState<MarketDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Player Stats
  const [gold, setGold] = useState(10000);
  const [sanity, setSanity] = useState(100);
  const [position, setPosition] = useState<'none' | 'long'>('none');
  const [entryPrice, setEntryPrice] = useState(0);
  const [narrativeLog, setNarrativeLog] = useState<string[]>([
    'Initializing Guild Archives...',
  ]);

  // --- INITIALIZATION ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const levelMap: Record<string, string> = {
          'quest-1': 'level_1', // The Crash
          'quest-2': 'level_2', // The Bubble
          'quest-3': 'level_3'  // The Winter
        };
        const levelFile = levelMap[questId] || 'level_1';
        
        addNarrative(`Loading Historical Scroll: ${levelFile}...`);
        const data = await api.loadLevel(levelFile);
        
        if (data && data.market_data) {
          setFullHistory(data.market_data);
          // Start with 30 days of context
          setDisplayedData(data.market_data.slice(0, 30));
          setDayIndex(30);
          setLoading(false);
          addNarrative("Market Open. The simulation awaits your command.");
        } else {
          addNarrative("Error: The scroll is blank (No Data).");
        }
      } catch (e) {
        addNarrative("Error: Could not connect to the Guild Archives (Backend Offline).");
      }
    };
    loadData();
  }, [questId]);

  // --- HELPERS ---
  const getCurrentPrice = () => {
    if (displayedData.length === 0) return 0;
    return displayedData[displayedData.length - 1].price;
  };

  const getDayChange = () => {
    if (displayedData.length === 0) return 0;
    return displayedData[displayedData.length - 1].change;
  };

  const addNarrative = (text: string) => {
    setNarrativeLog((prev) => [...prev, text]);
  };

  // --- THE GAME ENGINE (TURN BASED) ---
  const advanceTurn = async (action: 'buy' | 'sell' | 'hold') => {
    if (dayIndex >= fullHistory.length - 1) {
      handleComplete();
      return;
    }

    const nextDayIndex = dayIndex + 1;
    const nextDayData = fullHistory[nextDayIndex];
    const currentPrice = nextDayData.price;

    // 1. Process The Action
    if (action === 'buy') {
      setPosition('long');
      setEntryPrice(currentPrice);
      setGold(g => g - currentPrice); // Deduct cost
      addNarrative(`Day ${nextDayIndex}: You BOUGHT at ${currentPrice.toFixed(2)}.`);
    } 
    else if (action === 'sell') {
      const profit = currentPrice - entryPrice;
      setGold(g => g + currentPrice); // Return principal + profit
      setPosition('none');
      setEntryPrice(0);
      
      // Sanity Mechanic: Winning restores sanity, losing drains it
      if (profit > 0) setSanity(s => Math.min(100, s + 10));
      else setSanity(s => Math.max(0, s - 15));

      addNarrative(`Day ${nextDayIndex}: SOLD. P/L: ${profit > 0 ? '+' : ''}${profit.toFixed(0)} Gold.`);
    } 
    else if (action === 'hold') {
      // Passive Sanity Drain if holding a losing position
      if (position === 'long' && currentPrice < entryPrice) {
        setSanity(s => Math.max(0, s - 2)); 
      }
    }

    // 2. Advance Time
    setDayIndex(nextDayIndex);
    setDisplayedData(fullHistory.slice(0, nextDayIndex + 1));

    // 3. Trigger Events (AI Narrator)
    // Only check for narrative every 5 turns OR if price moves drastically (>3%)
    if (nextDayIndex % 5 === 0 || Math.abs(nextDayData.change) > 3) {
      const aiResponse = await api.analyzeTurn(nextDayData.change);
      if (aiResponse?.narrative) {
        addNarrative(`> ${aiResponse.narrative}`);
      }
    }

    // 4. Check Game Over
    if (sanity <= 0) {
      addNarrative("⚠️ Your mind has shattered. The Guild removes you from the floor.");
      handleComplete();
    }
  };

  const handleComplete = () => {
    const finalVal = gold + (position === 'long' ? getCurrentPrice() : 0);
    onComplete({
      finalGold: finalVal,
      finalSanity: sanity,
      profit: finalVal - 10000,
      grade: finalVal > 12000 ? 'S' : finalVal > 10500 ? 'A' : finalVal > 9000 ? 'B' : 'C',
    });
  };

  // --- RENDER ---
  const currentPrice = getCurrentPrice();
  const currentChange = getDayChange();
  
  // Calculate unrealized P/L for display
  const unrealizedPL = position === 'long' ? (currentPrice - entryPrice) : 0;
  const unrealizedPLPercent = position === 'long' ? ((currentPrice - entryPrice) / entryPrice) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex">
      
      {/* LEFT COLUMN: CONTROL DECK (30%) */}
      <div className="w-[30%] border-r border-amber-900/30 flex flex-col bg-[#0f0f16]">
        
        {/* Header */}
        <div className="p-6 border-b border-amber-900/20">
          <h2 className="text-2xl font-['Cinzel'] text-amber-500 flex items-center gap-2">
            <Activity className="w-5 h-5"/> TradeQuest
          </h2>
          <p className="text-xs font-['Crimson_Text'] text-amber-500/50 uppercase tracking-widest mt-1">
            Day {dayIndex} / {fullHistory.length}
          </p>
        </div>

        {/* Narrative Scroll */}
        <div className="flex-1 p-4 overflow-hidden relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"/>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {narrativeLog.map((text, i) => (
                <div key={i} className={`text-sm font-['Crimson_Text'] border-l-2 pl-3 py-1 ${
                  text.includes('BOUGHT') ? 'border-green-600 text-green-100/80' :
                  text.includes('SOLD') ? 'border-red-600 text-red-100/80' :
                  text.includes('Error') ? 'border-red-500 text-red-500' :
                  'border-amber-500/30 text-amber-100/70'
                }`}>
                  {text}
                </div>
              ))}
              {/* Invisible anchor for auto-scroll */}
              <div id="narrative-anchor" />
            </div>
          </ScrollArea>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-[#14141b] border-t border-amber-900/30">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button 
              onClick={() => advanceTurn('buy')} 
              disabled={loading || position !== 'none' || gold < currentPrice}
              className="h-12 bg-green-900/20 border border-green-800 hover:bg-green-900/40 text-green-400 font-['Cinzel'] tracking-widest"
            >
              BUY
            </Button>
            
            <Button 
              onClick={() => advanceTurn('sell')} 
              disabled={loading || position !== 'long'}
              className="h-12 bg-red-900/20 border border-red-800 hover:bg-red-900/40 text-red-400 font-['Cinzel'] tracking-widest"
            >
              SELL
            </Button>
          </div>
          
          <Button 
            onClick={() => advanceTurn('hold')}
            disabled={loading} 
            className="w-full h-12 bg-amber-900/10 border border-amber-800/50 hover:bg-amber-900/20 text-amber-200 font-['Cinzel'] tracking-widest flex items-center justify-center gap-2"
          >
            HOLD <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-center text-xs text-amber-500/30 mt-2 font-sans">
            (Advance 1 Day)
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: CHART & STATS (70%) */}
      <div className="w-[70%] flex flex-col bg-[#0a0a0f] p-6 gap-6">
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#14141b] border border-amber-900/30 p-4 rounded relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Coins className="w-12 h-12 text-amber-500" />
            </div>
            <p className="text-xs text-amber-500/50 uppercase tracking-widest">Liquid Gold</p>
            <p className="text-2xl font-['Cinzel'] text-amber-400">{gold.toFixed(0)}</p>
          </div>

          <div className="bg-[#14141b] border border-amber-900/30 p-4 rounded relative overflow-hidden">
            <p className="text-xs text-amber-500/50 uppercase tracking-widest">Sanity</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={sanity} className="h-2 bg-slate-800" />
              <span className={`text-sm font-bold ${sanity < 50 ? 'text-red-500' : 'text-green-500'}`}>{sanity}%</span>
            </div>
          </div>

          <div className={`bg-[#14141b] border p-4 rounded relative overflow-hidden ${position === 'long' ? 'border-amber-500/30' : 'border-slate-800'}`}>
            <p className="text-xs text-amber-500/50 uppercase tracking-widest">Current Position</p>
            {position === 'long' ? (
               <div>
                 <p className="text-lg font-['Cinzel'] text-amber-100">LONG @ {entryPrice.toFixed(0)}</p>
                 <p className={`text-sm ${unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {unrealizedPL >= 0 ? '+' : ''}{unrealizedPL.toFixed(0)} ({unrealizedPLPercent.toFixed(2)}%)
                 </p>
               </div>
            ) : (
               <p className="text-lg font-['Cinzel'] text-slate-500 italic">Flat</p>
            )}
          </div>
        </div>

        {/* The Main Chart */}
        <div className="flex-1 bg-[#14141b] border border-amber-900/30 rounded p-4 relative shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis 
                domain={['auto', 'auto']} 
                orientation="right" 
                tick={{fill: '#78350f', fontSize: 12}} 
                stroke="#451a03"
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f0f16', border: '1px solid #78350f', color: '#fcd34d' }}
                itemStyle={{ color: '#fcd34d' }}
                labelStyle={{ display: 'none' }}
              />
              <Area 
                type="step" 
                dataKey="price" 
                stroke="#d97706" 
                strokeWidth={2} 
                fill="url(#colorPrice)" 
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
          
          {/* Price Tag Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded border border-amber-500/20">
            <span className="text-2xl font-['Cinzel'] text-amber-500">{currentPrice.toFixed(2)}</span>
            <span className={`ml-2 text-sm ${currentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentChange >= 0 ? '▲' : '▼'} {Math.abs(currentChange).toFixed(2)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}