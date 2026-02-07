import { useState } from 'react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface RealityRevealProps {
  onBack: () => void;
}

export function RealityReveal({ onBack }: RealityRevealProps) {
  const [sliderValue, setSliderValue] = useState([50]);

  // Generate fantasy vs reality data
  const generateData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      // Fantasy: gradual decline
      const fantasy = 1000 - i * 8 + Math.random() * 20;
      
      // Reality: sharp crash then recovery (S&P 500 March 2020)
      let reality;
      if (i < 15) {
        reality = 1000 - i * 60; // Sharp crash
      } else if (i < 25) {
        reality = 100 + (i - 15) * 20; // Slow recovery start
      } else {
        reality = 300 + (i - 25) * 30; // Strong recovery
      }

      data.push({
        time: i,
        fantasy: Math.max(200, fantasy),
        reality: Math.max(50, reality),
      });
    }
    return data;
  };

  const chartData = generateData();
  const opacity = sliderValue[0] / 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-amber-500 hover:text-amber-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quest Board
          </Button>
          
          <h1 className="text-5xl font-['Cinzel'] text-center mb-4 text-amber-500">
            Reality Check
          </h1>
          <p className="text-center font-['Crimson_Text'] text-amber-500/70 text-lg">
            What actually happened during the S&P 500 crash of March 2020
          </p>
        </div>

        {/* Comparison Chart */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-[#1a1a24] border-4 border-amber-500/30 rounded-lg p-8 shadow-2xl"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            }}
          >
            {/* Legend */}
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded" />
                <span className="font-['Cinzel'] text-amber-500">Your Fantasy Chart</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white rounded" />
                <span className="font-['Cinzel'] text-white">Real S&P 500 Data</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F59E0B20" />
                  <XAxis
                    dataKey="time"
                    stroke="#F59E0B"
                    label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#F59E0B' }}
                  />
                  <YAxis
                    stroke="#F59E0B"
                    label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#F59E0B' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a24',
                      border: '2px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <ReferenceLine y={500} stroke="#F59E0B40" strokeDasharray="3 3" />
                  
                  {/* Fantasy line */}
                  <Line
                    type="monotone"
                    dataKey="fantasy"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={false}
                    opacity={1 - opacity}
                  />
                  
                  {/* Reality line */}
                  <Line
                    type="monotone"
                    dataKey="reality"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                    dot={false}
                    opacity={opacity}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Slider Control */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="font-['Cinzel'] text-amber-500">Fantasy</span>
                <span className="font-['Cinzel'] text-white">Reality</span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
                className="[&>span]:bg-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Analysis Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-8"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
            }}
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-['Cinzel'] text-amber-500 mb-4">
                  What Really Happened
                </h3>
                <div className="space-y-4 font-['Crimson_Text'] text-amber-100/80">
                  <p>
                    <strong className="text-amber-500">March 2020:</strong> The COVID-19 pandemic triggered one of the fastest market crashes in history. The S&P 500 fell 34% in just 23 days.
                  </p>
                  <p>
                    <strong className="text-red-500">You Bought Here:</strong> Many traders thought they were "buying the dip" early in the crash, only to watch their positions fall another 20-30%.
                  </p>
                  <p>
                    <strong className="text-green-500">Market Actually Crashed Here:</strong> The bottom occurred on March 23, 2020. Traders who waited or dollar-cost averaged saw incredible returns as the market recovered to new highs by August.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Lessons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-4">
                <h4 className="font-['Cinzel'] text-amber-500 mb-2">Lesson 1</h4>
                <p className="text-sm font-['Crimson_Text'] text-amber-100/70">
                  Catching falling knives is dangerous. Wait for signs of stabilization.
                </p>
              </div>
              <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-4">
                <h4 className="font-['Cinzel'] text-amber-500 mb-2">Lesson 2</h4>
                <p className="text-sm font-['Crimson_Text'] text-amber-100/70">
                  Markets can fall faster and further than you expect. Risk management is crucial.
                </p>
              </div>
              <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-4">
                <h4 className="font-['Cinzel'] text-amber-500 mb-2">Lesson 3</h4>
                <p className="text-sm font-['Crimson_Text'] text-amber-100/70">
                  Historical crashes often present generational buying opportunities—if you have the capital and patience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
