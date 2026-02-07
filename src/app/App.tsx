import { useState } from 'react';
import { CharacterCreation } from './components/character-creation';
import { QuestBoard } from './components/quest-board';
import { TradingInterface } from './components/trading-interface';
import { ReportCard } from './components/report-card';
import { RealityReveal } from './components/reality-reveal';

type GameState = 'character' | 'quest-board' | 'trading' | 'report' | 'reality';

interface PlayerData {
  name: string;
  level: string;
  assetClass: string;
}

interface QuestResults {
  finalGold: number;
  finalSanity: number;
  profit: number;
  grade: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('character');
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: '',
    level: '',
    assetClass: '',
  });
  const [currentQuest, setCurrentQuest] = useState<string>('');
  const [questResults, setQuestResults] = useState<QuestResults | null>(null);

  const handleCharacterComplete = (data: PlayerData) => {
    setPlayerData(data);
    setGameState('quest-board');
  };

  const handleSelectQuest = (questId: string) => {
    setCurrentQuest(questId);
    setGameState('trading');
  };

  const handleQuestComplete = (results: QuestResults) => {
    setQuestResults(results);
    setGameState('report');
  };

  const handleRetry = () => {
    setGameState('trading');
  };

  const handleNext = () => {
    setGameState('reality');
  };

  const handleBackToQuests = () => {
    setGameState('quest-board');
  };

  return (
    <div className="font-['Crimson_Text'] bg-[#0a0a0f] min-h-screen">
      {gameState === 'character' && (
        <CharacterCreation onComplete={handleCharacterComplete} />
      )}

      {gameState === 'quest-board' && (
        <QuestBoard onSelectQuest={handleSelectQuest} playerData={playerData} />
      )}

      {gameState === 'trading' && (
        <TradingInterface questId={currentQuest} onComplete={handleQuestComplete} />
      )}

      {gameState === 'report' && questResults && (
        <ReportCard
          results={questResults}
          onRetry={handleRetry}
          onNext={handleNext}
        />
      )}

      {gameState === 'reality' && <RealityReveal onBack={handleBackToQuests} />}
    </div>
  );
}
