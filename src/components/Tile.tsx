import React from 'react';
import { Tile as TileType } from '../types/game';

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  onClick: () => void;
  isDraggable?: boolean;
}

const Tile: React.FC<TileProps> = ({ tile, isSelected, onClick, isDraggable = true }) => {
  return (
    <div
      className={`relative w-12 h-12 flex items-center justify-center rounded-md cursor-pointer select-none
                 ${isSelected ? 'ring-2 ring-blue-500 transform scale-105' : ''}
                 ${isDraggable ? 'cursor-grab' : 'cursor-pointer'}
                 bg-amber-100 shadow-md transition-all duration-150 hover:shadow-lg`}
      onClick={onClick}
    >
      <span className="text-2xl font-bold text-gray-800">{tile.letter}</span>
      <span className="absolute bottom-1 right-1 text-xs font-semibold text-gray-600">{tile.value}</span>
    </div>
  );
};

export default Tile;
