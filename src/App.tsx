import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Rack from './components/Rack';
import GameControls from './components/GameControls';
import PlayerInfo from './components/PlayerInfo';
import RulesModal from './components/RulesModal';
import GameOverModal from './components/GameOverModal';
import { GameState, Tile, BoardCell } from './types/game';
import { 
  initializeGame, 
  shuffleArray, 
  drawTiles, 
  calculateWordScore, 
  getFormedWords 
} from './utils/gameUtils';
import { BookOpen, Heart } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>(initializeGame(2));
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'info' | 'success' | 'error' }>({ 
    text: 'Welcome to Scrabble! Place tiles to form words.', 
    type: 'info' 
  });

  // Handle tile selection
  const handleTileSelect = (tile: Tile) => {
    setGameState(prev => ({
      ...prev,
      selectedTile: prev.selectedTile?.id === tile.id ? null : tile
    }));
  };

  // Handle board cell click
  const handleCellClick = (row: number, col: number) => {
    const { selectedTile, board, placedTiles } = gameState;
    
    // If no tile is selected, check if there's a tile on the cell to remove
    if (!selectedTile) {
      const cellTile = board[row][col].tile;
      
      // Only allow removing tiles that were just placed (not from previous turns)
      if (cellTile && placedTiles.some(t => t.id === cellTile.id)) {
        // Remove the tile from the board
        const newBoard = [...board];
        newBoard[row][col] = { ...newBoard[row][col], tile: null };
        
        // Return the tile to the player's rack
        const currentPlayer = { ...gameState.players[gameState.currentPlayerIndex] };
        const updatedRack = [...currentPlayer.rack, { ...cellTile, isPlaced: false }];
        currentPlayer.rack = updatedRack;
        
        const updatedPlayers = [...gameState.players];
        updatedPlayers[gameState.currentPlayerIndex] = currentPlayer;
        
        // Remove the tile from placedTiles
        const updatedPlacedTiles = placedTiles.filter(t => t.id !== cellTile.id);
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          players: updatedPlayers,
          placedTiles: updatedPlacedTiles
        }));
      }
      return;
    }
    
    // Check if the cell is already occupied
    if (board[row][col].tile) {
      setMessage({ text: 'This cell is already occupied!', type: 'error' });
      return;
    }
    
    // Place the selected tile on the board
    const newBoard = [...board];
    const tileWithPosition = { 
      ...selectedTile, 
      isPlaced: true,
      position: { row, col } 
    };
    newBoard[row][col] = { ...newBoard[row][col], tile: tileWithPosition };
    
    // Remove the tile from the player's rack
    const currentPlayer = { ...gameState.players[gameState.currentPlayerIndex] };
    const updatedRack = currentPlayer.rack.filter(t => t.id !== selectedTile.id);
    currentPlayer.rack = updatedRack;
    
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = currentPlayer;
    
    // Add the tile to placedTiles
    const updatedPlacedTiles = [...placedTiles, tileWithPosition];
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      players: updatedPlayers,
      selectedTile: null,
      placedTiles: updatedPlacedTiles
    }));
  };

  // Handle playing a word
  const handlePlayWord = () => {
    const { placedTiles, board, players, currentPlayerIndex, tileBag } = gameState;
    
    if (placedTiles.length === 0) {
      setMessage({ text: 'You need to place at least one tile!', type: 'error' });
      return;
    }
    
    // Get words formed by the placed tiles
    const formedWords = getFormedWords(board, placedTiles);
    
    // Calculate score for each word
    let totalScore = 0;
    const placedPositions = placedTiles.map(tile => tile.position!);
    
    formedWords.forEach(word => {
      const wordScore = calculateWordScore(word, board, placedPositions);
      totalScore += wordScore;
    });
    
    // Update player's score
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      score: updatedPlayers[currentPlayerIndex].score + totalScore
    };
    
    // Draw new tiles
    const tilesNeeded = Math.min(placedTiles.length, tileBag.length);
    const { drawnTiles, remainingTiles } = drawTiles(tileBag, tilesNeeded);
    
    updatedPlayers[currentPlayerIndex].rack = [
      ...updatedPlayers[currentPlayerIndex].rack,
      ...drawnTiles
    ];
    
    // Check if game is over
    const isGameOver = remainingTiles.length === 0 && updatedPlayers.some(p => p.rack.length === 0);
    
    // Move to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      tileBag: remainingTiles,
      placedTiles: [],
      gameOver: isGameOver
    }));
    
    setMessage({ 
      text: `You scored ${totalScore} points! ${isGameOver ? 'Game Over!' : ''}`, 
      type: 'success' 
    });
  };

  // Handle shuffling the rack
  const handleShuffleRack = () => {
    const currentPlayer = { ...gameState.players[gameState.currentPlayerIndex] };
    currentPlayer.rack = shuffleArray(currentPlayer.rack);
    
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = currentPlayer;
    
    setGameState(prev => ({
      ...prev,
      players: updatedPlayers
    }));
    
    setMessage({ text: 'Rack shuffled!', type: 'info' });
  };

  // Handle recalling tiles
  const handleRecallTiles = () => {
    const { placedTiles, board, players, currentPlayerIndex } = gameState;
    
    if (placedTiles.length === 0) {
      setMessage({ text: 'No tiles to recall!', type: 'info' });
      return;
    }
    
    // Remove placed tiles from the board
    const newBoard = [...board];
    placedTiles.forEach(tile => {
      if (tile.position) {
        const { row, col } = tile.position;
        newBoard[row][col] = { ...newBoard[row][col], tile: null };
      }
    });
    
    // Return tiles to player's rack
    const currentPlayer = { ...players[currentPlayerIndex] };
    const tilesForRack = placedTiles.map(tile => ({ ...tile, isPlaced: false, position: undefined }));
    currentPlayer.rack = [...currentPlayer.rack, ...tilesForRack];
    
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = currentPlayer;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      players: updatedPlayers,
      placedTiles: [],
      selectedTile: null
    }));
    
    setMessage({ text: 'Tiles recalled to your rack!', type: 'info' });
  };

  // Handle starting a new game
  const handleNewGame = () => {
    setGameState(initializeGame(gameState.players.length));
    setMessage({ text: 'New game started!', type: 'info' });
  };

  // Clear message after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(prev => ({ ...prev, text: '' }));
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [message]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 flex flex-col">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-amber-800 flex items-center justify-center gap-2">
          <BookOpen className="text-amber-600" />
          Scrabble Game
        </h1>
        <p className="text-amber-700">Form words, score points, have fun!</p>
      </header>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-md text-center ${
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <PlayerInfo 
            players={gameState.players} 
            currentPlayerIndex={gameState.currentPlayerIndex} 
          />
          
          <div className="mt-6 bg-amber-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-center border-b border-amber-200 pb-2 mb-2">Game Info</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Tiles in bag:</span> {gameState.tileBag.length}</p>
              <p><span className="font-semibold">Current turn:</span> {currentPlayer.name}</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3 order-1 lg:order-2 flex flex-col items-center">
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-max">
              <Board 
                board={gameState.board} 
                onCellClick={handleCellClick} 
              />
            </div>
          </div>
          
          <div className="w-full max-w-2xl mt-6">
            <Rack 
              tiles={currentPlayer.rack} 
              selectedTileId={gameState.selectedTile?.id || null} 
              onTileClick={handleTileSelect} 
            />
            
            <GameControls 
              onPlayWord={handlePlayWord}
              onShuffleRack={handleShuffleRack}
              onRecallTiles={handleRecallTiles}
              onShowRules={() => setShowRulesModal(true)}
              canPlayWord={gameState.placedTiles.length > 0}
            />
          </div>
        </div>
      </div>
      
      <footer className="mt-8 py-4 text-center text-amber-700 border-t border-amber-200">
        <p className="flex items-center justify-center gap-1">
          Made with love <Heart className="text-red-500 fill-red-500 h-5 w-5" /> using <a href="https://chatandbuild.com" target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:underline font-medium">chatandbuild.com</a>
        </p>
      </footer>
      
      <RulesModal 
        isOpen={showRulesModal} 
        onClose={() => setShowRulesModal(false)} 
      />
      
      <GameOverModal 
        isOpen={gameState.gameOver} 
        players={gameState.players} 
        onPlayAgain={handleNewGame} 
      />
    </div>
  );
}

export default App;
