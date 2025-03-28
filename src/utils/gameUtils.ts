import { BonusType, BoardCell, Tile, Player, GameState } from '../types/game';

// Letter distribution and values based on standard Scrabble
const LETTER_DISTRIBUTION = {
  'A': { count: 9, value: 1 },
  'B': { count: 2, value: 3 },
  'C': { count: 2, value: 3 },
  'D': { count: 4, value: 2 },
  'E': { count: 12, value: 1 },
  'F': { count: 2, value: 4 },
  'G': { count: 3, value: 2 },
  'H': { count: 2, value: 4 },
  'I': { count: 9, value: 1 },
  'J': { count: 1, value: 8 },
  'K': { count: 1, value: 5 },
  'L': { count: 4, value: 1 },
  'M': { count: 2, value: 3 },
  'N': { count: 6, value: 1 },
  'O': { count: 8, value: 1 },
  'P': { count: 2, value: 3 },
  'Q': { count: 1, value: 10 },
  'R': { count: 6, value: 1 },
  'S': { count: 4, value: 1 },
  'T': { count: 6, value: 1 },
  'U': { count: 4, value: 1 },
  'V': { count: 2, value: 4 },
  'W': { count: 2, value: 4 },
  'X': { count: 1, value: 8 },
  'Y': { count: 2, value: 4 },
  'Z': { count: 1, value: 10 },
  ' ': { count: 2, value: 0 } // Blank tiles
};

// Create initial tile bag
export const createTileBag = (): Tile[] => {
  const tiles: Tile[] = [];
  let id = 0;

  Object.entries(LETTER_DISTRIBUTION).forEach(([letter, { count, value }]) => {
    for (let i = 0; i < count; i++) {
      tiles.push({
        id: `tile-${id++}`,
        letter,
        value,
        isPlaced: false
      });
    }
  });

  // Shuffle the tiles
  return shuffleArray(tiles);
};

// Fisher-Yates shuffle algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Draw tiles from the bag
export const drawTiles = (tileBag: Tile[], count: number): { drawnTiles: Tile[], remainingTiles: Tile[] } => {
  const drawnTiles = tileBag.slice(0, count);
  const remainingTiles = tileBag.slice(count);
  return { drawnTiles, remainingTiles };
};

// Create initial board with bonus squares
export const createBoard = (size: number = 15): BoardCell[][] => {
  const board: BoardCell[][] = [];

  // Define bonus square positions
  const tripleWordSquares = [
    [0, 0], [0, 7], [0, 14],
    [7, 0], [7, 14],
    [14, 0], [14, 7], [14, 14]
  ];

  const doubleWordSquares = [
    [1, 1], [2, 2], [3, 3], [4, 4],
    [1, 13], [2, 12], [3, 11], [4, 10],
    [10, 4], [11, 3], [12, 2], [13, 1],
    [10, 10], [11, 11], [12, 12], [13, 13]
  ];

  const tripleLetterSquares = [
    [1, 5], [1, 9],
    [5, 1], [5, 5], [5, 9], [5, 13],
    [9, 1], [9, 5], [9, 9], [9, 13],
    [13, 5], [13, 9]
  ];

  const doubleLetterSquares = [
    [0, 3], [0, 11],
    [2, 6], [2, 8],
    [3, 0], [3, 7], [3, 14],
    [6, 2], [6, 6], [6, 8], [6, 12],
    [7, 3], [7, 11],
    [8, 2], [8, 6], [8, 8], [8, 12],
    [11, 0], [11, 7], [11, 14],
    [12, 6], [12, 8],
    [14, 3], [14, 11]
  ];

  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      let bonus = BonusType.NONE;

      // Check if this cell is a bonus square
      if (row === 7 && col === 7) {
        bonus = BonusType.CENTER;
      } else if (tripleWordSquares.some(([r, c]) => r === row && c === col)) {
        bonus = BonusType.TRIPLE_WORD;
      } else if (doubleWordSquares.some(([r, c]) => r === row && c === col)) {
        bonus = BonusType.DOUBLE_WORD;
      } else if (tripleLetterSquares.some(([r, c]) => r === row && c === col)) {
        bonus = BonusType.TRIPLE_LETTER;
      } else if (doubleLetterSquares.some(([r, c]) => r === row && c === col)) {
        bonus = BonusType.DOUBLE_LETTER;
      }

      board[row][col] = {
        row,
        col,
        tile: null,
        bonus
      };
    }
  }

  return board;
};

// Initialize players
export const createPlayers = (playerCount: number, tileBag: Tile[]): { players: Player[], remainingTiles: Tile[] } => {
  const players: Player[] = [];
  let remainingTiles = [...tileBag];

  for (let i = 0; i < playerCount; i++) {
    const { drawnTiles, remainingTiles: newRemainingTiles } = drawTiles(remainingTiles, 7);
    remainingTiles = newRemainingTiles;

    players.push({
      id: `player-${i + 1}`,
      name: `Player ${i + 1}`,
      score: 0,
      rack: drawnTiles
    });
  }

  return { players, remainingTiles };
};

// Calculate word score
export const calculateWordScore = (
  word: Tile[], 
  board: BoardCell[][], 
  newlyPlacedTilePositions: { row: number, col: number }[]
): number => {
  let wordMultiplier = 1;
  let wordScore = 0;

  word.forEach((tile, index) => {
    if (!tile.position) return;
    
    const { row, col } = tile.position;
    const cell = board[row][col];
    let letterScore = tile.value;
    
    // Check if this tile was just placed (not already on the board)
    const isNewlyPlaced = newlyPlacedTilePositions.some(pos => pos.row === row && pos.col === col);
    
    if (isNewlyPlaced) {
      // Apply letter multipliers
      if (cell.bonus === BonusType.DOUBLE_LETTER) {
        letterScore *= 2;
      } else if (cell.bonus === BonusType.TRIPLE_LETTER) {
        letterScore *= 3;
      }
      
      // Collect word multipliers to apply at the end
      if (cell.bonus === BonusType.DOUBLE_WORD) {
        wordMultiplier *= 2;
      } else if (cell.bonus === BonusType.TRIPLE_WORD) {
        wordMultiplier *= 3;
      }
    }
    
    wordScore += letterScore;
  });
  
  return wordScore * wordMultiplier;
};

// Check if a word is valid (simplified - in a real game, you'd check against a dictionary)
export const isValidWord = (word: string): boolean => {
  // This is a simplified validation
  // In a real game, you would check against a dictionary
  return word.length >= 2;
};

// Initialize game state
export const initializeGame = (playerCount: number = 2): GameState => {
  const tileBag = createTileBag();
  const { players, remainingTiles } = createPlayers(playerCount, tileBag);
  
  return {
    players,
    currentPlayerIndex: 0,
    board: createBoard(),
    tileBag: remainingTiles,
    selectedTile: null,
    placedTiles: [],
    gameOver: false
  };
};

// Get words formed by placed tiles
export const getFormedWords = (board: BoardCell[][], placedTiles: Tile[]): Tile[][] => {
  // This is a simplified implementation
  // In a real game, you would need to check all words formed by the placed tiles
  
  // For now, we'll just return the placed tiles as a single word
  return [placedTiles];
};
