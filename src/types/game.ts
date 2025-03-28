export interface Tile {
  id: string;
  letter: string;
  value: number;
  isPlaced: boolean;
  position?: {
    row: number;
    col: number;
  };
}

export interface Player {
  id: string;
  name: string;
  score: number;
  rack: Tile[];
}

export interface BoardCell {
  row: number;
  col: number;
  tile: Tile | null;
  bonus: BonusType;
}

export enum BonusType {
  NONE = "NONE",
  DOUBLE_LETTER = "DOUBLE_LETTER",
  TRIPLE_LETTER = "TRIPLE_LETTER",
  DOUBLE_WORD = "DOUBLE_WORD",
  TRIPLE_WORD = "TRIPLE_WORD",
  CENTER = "CENTER"
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  board: BoardCell[][];
  tileBag: Tile[];
  selectedTile: Tile | null;
  placedTiles: Tile[];
  gameOver: boolean;
}
