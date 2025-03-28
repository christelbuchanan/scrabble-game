import React from 'react';
import { RefreshCw, Check, RotateCcw, HelpCircle } from 'lucide-react';

interface GameControlsProps {
  onPlayWord: () => void;
  onShuffleRack: () => void;
  onRecallTiles: () => void;
  onShowRules: () => void;
  canPlayWord: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onPlayWord,
  onShuffleRack,
  onRecallTiles,
  onShowRules,
  canPlayWord
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      <button
        onClick={onPlayWord}
        disabled={!canPlayWord}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-colors
                   ${canPlayWord 
                     ? 'bg-green-600 text-white hover:bg-green-700' 
                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        <Check size={18} />
        Play Word
      </button>
      
      <button
        onClick={onShuffleRack}
        className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-md font-semibold shadow-md hover:bg-amber-700 transition-colors"
      >
        <RefreshCw size={18} />
        Shuffle Rack
      </button>
      
      <button
        onClick={onRecallTiles}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow-md hover:bg-blue-700 transition-colors"
      >
        <RotateCcw size={18} />
        Recall Tiles
      </button>
      
      <button
        onClick={onShowRules}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md font-semibold shadow-md hover:bg-purple-700 transition-colors"
      >
        <HelpCircle size={18} />
        Rules
      </button>
    </div>
  );
};

export default GameControls;
