import React from 'react';
import { BoardCell as BoardCellType, BonusType, Tile as TileType } from '../types/game';

interface BoardProps {
  board: BoardCellType[][];
  onCellClick: (row: number, col: number) => void;
}

const getBonusColor = (bonus: BonusType): string => {
  switch (bonus) {
    case BonusType.DOUBLE_LETTER:
      return 'bg-blue-200';
    case BonusType.TRIPLE_LETTER:
      return 'bg-blue-400';
    case BonusType.DOUBLE_WORD:
      return 'bg-pink-200';
    case BonusType.TRIPLE_WORD:
      return 'bg-red-400';
    case BonusType.CENTER:
      return 'bg-pink-300';
    default:
      return 'bg-amber-50';
  }
};

const getBonusText = (bonus: BonusType): string => {
  switch (bonus) {
    case BonusType.DOUBLE_LETTER:
      return 'DL';
    case BonusType.TRIPLE_LETTER:
      return 'TL';
    case BonusType.DOUBLE_WORD:
      return 'DW';
    case BonusType.TRIPLE_WORD:
      return 'TW';
    case BonusType.CENTER:
      return '★';
    default:
      return '';
  }
};

const BoardCell: React.FC<{
  cell: BoardCellType;
  onClick: () => void;
}> = ({ cell, onClick }) => {
  const bonusColor = getBonusColor(cell.bonus);
  const bonusText = getBonusText(cell.bonus);

  return (
    <div
      className={`w-10 h-10 border border-gray-300 flex items-center justify-center relative ${bonusColor} hover:bg-amber-100 cursor-pointer transition-colors`}
      onClick={onClick}
    >
      {cell.tile ? (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-100 shadow-md rounded-sm">
          <span className="text-xl font-bold">{cell.tile.letter}</span>
          <span className="absolute bottom-0.5 right-1 text-xs font-semibold">{cell.tile.value}</span>
        </div>
      ) : (
        <span className="text-xs font-semibold text-gray-600">{bonusText}</span>
      )}
    </div>
  );
};

const Board: React.FC<BoardProps> = ({ board, onCellClick }) => {
  return (
    <div className="grid grid-cols-15 gap-0 border-2 border-gray-400 bg-amber-50 shadow-lg rounded-md overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
