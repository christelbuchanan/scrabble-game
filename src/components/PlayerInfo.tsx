import React from 'react';
import { Player } from '../types/game';
import { User } from 'lucide-react';

interface PlayerInfoProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ players, currentPlayerIndex }) => {
  return (
    <div className="flex flex-col space-y-4 bg-amber-50 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center border-b border-amber-200 pb-2">Players</h2>
      
      {players.map((player, index) => (
        <div 
          key={player.id}
          className={`flex items-center space-x-3 p-2 rounded-md ${
            index === currentPlayerIndex 
              ? 'bg-amber-200 shadow-sm' 
              : 'bg-transparent'
          }`}
        >
          <div className="bg-amber-600 text-white p-2 rounded-full">
            <User size={20} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-gray-600">Tiles: {player.rack.length}</div>
          </div>
          <div className="text-xl font-bold">{player.score}</div>
          {index === currentPlayerIndex && (
            <div className="absolute -left-2 w-2 h-8 bg-amber-500 rounded-r-md"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerInfo;
