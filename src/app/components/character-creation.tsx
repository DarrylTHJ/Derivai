import { useState } from 'react';
import { User } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface CharacterCreationProps {
  onComplete: (data: { name: string; level: string; assetClass: string }) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const experienceLevels = [
    { id: 'apprentice', name: 'Apprentice', description: 'New to the markets' },
    { id: 'journeyman', name: 'Journeyman', description: 'Some experience' },
    { id: 'guildmaster', name: 'Guildmaster', description: 'Seasoned trader' },
  ];

  const assetClasses = [
    { id: 'stocks', name: 'Stocks', description: 'Equity markets' },
    { id: 'crypto', name: 'Crypto', description: 'Digital assets' },
    { id: 'forex', name: 'Forex', description: 'Currency trading' },
  ];

  const handleSubmit = () => {
    if (name && selectedLevel && selectedAsset) {
      onComplete({ name, level: selectedLevel, assetClass: selectedAsset });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Magical particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-500/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl">
          <h1 className="text-5xl font-['Cinzel'] text-center mb-16 text-amber-500">
            The Awakening
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Experience Level */}
            <div className="space-y-4">
              <h3 className="text-xl font-['Cinzel'] text-amber-500/80 mb-6 text-center lg:text-left">
                Experience Level
              </h3>
              {experienceLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedLevel === level.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                      : 'border-amber-500/30 bg-[#1a1a24] hover:border-amber-500/50'
                  }`}
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E")',
                  }}
                >
                  <div className="font-['Cinzel'] text-lg mb-2 text-amber-100">
                    {level.name}
                  </div>
                  <div className="text-sm text-amber-900/60 font-['Crimson_Text']">
                    {level.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Center: Avatar and Name */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-64 h-64 rounded-full border-4 border-amber-500 bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <div className="absolute inset-0 rounded-full animate-pulse bg-amber-500/10" />
                  <User className="w-32 h-32 text-amber-500/40" strokeWidth={1} />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
              </div>

              <div className="w-full max-w-sm">
                <label className="block text-center mb-3 font-['Cinzel'] text-amber-500/80">
                  Enter Your Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name..."
                  className="text-center bg-[#1a1a24] border-2 border-amber-500/30 text-amber-100 placeholder:text-amber-500/30 focus:border-amber-500 font-['Crimson_Text']"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E")',
                  }}
                />
              </div>
            </div>

            {/* Right: Asset Class */}
            <div className="space-y-4">
              <h3 className="text-xl font-['Cinzel'] text-amber-500/80 mb-6 text-center lg:text-left">
                Asset Class
              </h3>
              {assetClasses.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`w-full p-6 rounded-lg border-2 transition-all duration-300 ${
                    selectedAsset === asset.id
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                      : 'border-amber-500/30 bg-[#1a1a24] hover:border-amber-500/50'
                  }`}
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E")',
                  }}
                >
                  <div className="font-['Cinzel'] text-lg mb-2 text-amber-100">
                    {asset.name}
                  </div>
                  <div className="text-sm text-amber-900/60 font-['Crimson_Text']">
                    {asset.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!name || !selectedLevel || !selectedAsset}
              className="px-16 py-6 text-xl font-['Cinzel'] bg-amber-500 hover:bg-amber-600 text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-amber-500/30 border-2 border-amber-600"
            >
              Enter Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
