import { Lock, Trophy, Star, Zap } from 'lucide-react';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface QuestBoardProps {
  onSelectQuest: (questId: string) => void;
  playerData: { name: string; level: string; assetClass: string };
}

export function QuestBoard({ onSelectQuest, playerData }: QuestBoardProps) {
  const quests = [
    {
      id: 'flash-crash',
      title: 'The Flash Crash',
      description: 'May 6, 2010 - Navigate the sudden market collapse',
      difficulty: 'Beginner',
      locked: false,
      image: 'lightning storm financial',
    },
    {
      id: 'dotcom-bubble',
      title: 'The Dot-Com Bubble',
      description: '2000-2002 - Survive the tech market burst',
      difficulty: 'Intermediate',
      locked: true,
      image: 'bubble burst technology',
    },
    {
      id: 'crypto-winter',
      title: 'The Crypto Winter',
      description: '2018 - Endure the cryptocurrency bear market',
      difficulty: 'Advanced',
      locked: true,
      image: 'winter frozen cryptocurrency',
    },
  ];

  const achievements = ['Trophy', 'Star', 'Zap', 'Trophy', 'Star'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-['Cinzel'] text-center mb-8 text-amber-500">
            The Quest Board
          </h1>
          
          {/* Top navigation bar */}
          <div className="bg-[#1a1a24] border-2 border-amber-500/30 rounded-lg p-6 shadow-lg"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E")',
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Player Info */}
              <div className="flex items-center gap-4">
                <div className="text-amber-100 font-['Cinzel']">
                  <span className="text-amber-500">Trader:</span> {playerData.name}
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-['Cinzel'] text-amber-500">Level 1</span>
                  <span className="text-sm font-['Crimson_Text'] text-amber-500/70">350 / 1000 XP</span>
                </div>
                <Progress value={35} className="h-3 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-amber-600" />
              </div>

              {/* Achievement Badges */}
              <div className="flex gap-2">
                {achievements.map((icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-500/20 to-amber-900/20 border-2 border-amber-500/40 flex items-center justify-center"
                  >
                    {icon === 'Trophy' && <Trophy className="w-5 h-5 text-amber-500" />}
                    {icon === 'Star' && <Star className="w-5 h-5 text-amber-500" />}
                    {icon === 'Zap' && <Zap className="w-5 h-5 text-amber-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`relative rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                quest.locked
                  ? 'border-slate-700 opacity-60'
                  : 'border-amber-500/50 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20'
              }`}
            >
              {/* Quest Image */}
              <div className="h-64 bg-gradient-to-b from-amber-500/10 to-slate-900/80 relative overflow-hidden">
                {quest.locked ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Lock className="w-20 h-20 text-slate-600" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-32 h-32 text-amber-500/30" />
                  </div>
                )}
              </div>

              {/* Quest Content */}
              <div
                className="p-6 bg-[#1a1a24]"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E")',
                }}
              >
                <h3 className="text-2xl font-['Cinzel'] mb-3 text-amber-100">
                  {quest.title}
                </h3>
                <p className="text-amber-500/70 font-['Crimson_Text'] mb-4 min-h-[3rem]">
                  {quest.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-['Cinzel'] px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30">
                    {quest.difficulty}
                  </span>
                </div>
                <Button
                  onClick={() => !quest.locked && onSelectQuest(quest.id)}
                  disabled={quest.locked}
                  className={`w-full font-['Cinzel'] ${
                    quest.locked
                      ? 'bg-slate-700 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/30'
                  }`}
                >
                  {quest.locked ? 'Locked' : 'Start Mission'}
                </Button>
              </div>

              {/* Locked overlay effect */}
              {quest.locked && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
