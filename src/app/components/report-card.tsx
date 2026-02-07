import { Button } from './ui/button';
import { Trophy, TrendingUp, Activity, Heart } from 'lucide-react';

interface ReportCardProps {
  results: {
    finalGold: number;
    finalSanity: number;
    profit: number;
    grade: string;
  };
  onRetry: () => void;
  onNext: () => void;
}

export function ReportCard({ results, onRetry, onNext }: ReportCardProps) {
  const feedback = results.profit > 0
    ? "Impressive work, trader. You've demonstrated patience and discipline. The markets reward those who can keep their composure when chaos reigns. However, remember that past success does not guarantee future results."
    : "Your losses teach you more than any victory could. The market is a harsh teacher, but those who learn from their mistakes become the most formidable traders. Study what went wrong, and return stronger.";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full bg-[#1a1a24] border-4 border-amber-500 rounded-lg shadow-2xl shadow-amber-500/30 overflow-hidden"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.05"/%3E%3C/svg%3E")',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-8 text-center border-b-2 border-amber-500/30">
          <div className="mb-4">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
          </div>
          <h2 className="text-4xl font-['Cinzel'] text-amber-500 mb-2">Mission Complete</h2>
          <div className="inline-block transform -rotate-3 bg-red-600 text-white px-8 py-3 rounded-lg shadow-lg">
            <span className="text-5xl font-['Cinzel']">Grade: {results.grade}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-sm font-['Cinzel'] text-amber-500/70 mb-2">Total Profit</div>
              <div className={`text-2xl font-['Cinzel'] ${results.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {results.profit >= 0 ? '+' : ''}{results.profit.toFixed(0)}
              </div>
            </div>

            <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-6 text-center">
              <Activity className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <div className="text-sm font-['Cinzel'] text-amber-500/70 mb-2">Max Drawdown</div>
              <div className="text-2xl font-['Cinzel'] text-red-400">
                -15%
              </div>
            </div>

            <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <div className="text-sm font-['Cinzel'] text-red-500/70 mb-2">Sanity Remaining</div>
              <div className="text-2xl font-['Cinzel'] text-amber-100">
                {results.finalSanity}%
              </div>
            </div>
          </div>

          {/* Guildmaster's Feedback */}
          <div className="bg-[#0a0a0f] border-2 border-amber-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-500 to-amber-700 flex items-center justify-center">
                <span className="text-xl">🧙</span>
              </div>
              <div>
                <h3 className="font-['Cinzel'] text-amber-500">Guildmaster's Feedback</h3>
                <p className="text-xs font-['Crimson_Text'] text-amber-500/60">Ancient wisdom from the trading halls</p>
              </div>
            </div>
            <p className="font-['Crimson_Text'] text-amber-100/80 leading-relaxed italic">
              "{feedback}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onRetry}
              variant="outline"
              className="font-['Cinzel'] border-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
            >
              Retry Level
            </Button>
            <Button
              onClick={onNext}
              className="font-['Cinzel'] bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/30"
            >
              Next Chapter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
