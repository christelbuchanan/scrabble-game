import React from 'react';
import { X } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-amber-800">Scrabble Rules</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">Game Objective</h3>
            <p>Form words on the board using your letter tiles. Score points based on the letters used and bonus squares.</p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Game Play</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Each player starts with 7 random tiles.</li>
              <li>Players take turns forming words on the board.</li>
              <li>The first word must cover the center star.</li>
              <li>Subsequent words must connect to existing words.</li>
              <li>After playing a word, draw new tiles to replace those used.</li>
              <li>The game ends when all tiles have been drawn and one player uses all their tiles.</li>
            </ol>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Scoring</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Each letter has a point value (shown on the tile).</li>
              <li>Double Letter Score (DL): Doubles the value of a letter.</li>
              <li>Triple Letter Score (TL): Triples the value of a letter.</li>
              <li>Double Word Score (DW): Doubles the value of the entire word.</li>
              <li>Triple Word Score (TW): Triples the value of the entire word.</li>
              <li>Using all 7 tiles in one turn earns a 50-point bonus.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-2">Special Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Blank tiles can represent any letter but are worth 0 points.</li>
              <li>Players can exchange tiles instead of playing a word (costs a turn).</li>
              <li>Words must be in the dictionary to be valid.</li>
            </ul>
          </section>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
