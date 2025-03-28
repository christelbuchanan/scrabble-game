import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Player } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  players: Player[];
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, players, onPlayAgain }) => {
  if (!isOpen) return null;

  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isTie = sortedPlayers.length > 1 && sortedPlayers[0].score === sortedPlayers[1].score;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-amber-600 p-6 text-white text-center">
          <Trophy size={64} className="mx-auto mb-2" />
          <h2 className="text-2xl font-bold">
            {isTie ? 'Game Over - It\'s a Tie!' : 'Game Over - We Have a Winner!'}
          </h2>
        </div>
        
        <div className="p-6">
          {isTie ? (
            <p className="text-center text-lg mb-4">
              Multiple players tied with {winner.score} points!
            </p>
          ) : (
            <p className="text-center text-lg mb-4">
              <span className="font-bold">{winner.name}</span> wins with <span className="font-bold">{winner.score}</span> points!
            </p>
          )}
          
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-center">Final Scores</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    {index === 0 && !isTie && (
                      <span className="text-amber-500 mr-2">👑</span>
                    )}
                    <span>{player.name}</span>
                  </div>
                  <span className="font-bold">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={onPlayAgain}
            className="w-full py-3 bg-amber-600 text-white rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
          >
            <RefreshCw size={18} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
