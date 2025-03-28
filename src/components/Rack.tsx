import React from 'react';
import Tile from './Tile';
import { Tile as TileType } from '../types/game';

interface RackProps {
  tiles: TileType[];
  selectedTileId: string | null;
  onTileClick: (tile: TileType) => void;
}

const Rack: React.FC<RackProps> = ({ tiles, selectedTileId, onTileClick }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Your Rack</h2>
      <div className="bg-amber-800 p-4 rounded-lg shadow-inner flex space-x-2 min-h-20">
        {tiles.length === 0 ? (
          <div className="text-amber-100 italic">Your rack is empty</div>
        ) : (
          tiles.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              isSelected={tile.id === selectedTileId}
              onClick={() => onTileClick(tile)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Rack;
