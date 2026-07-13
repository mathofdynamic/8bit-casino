import React from 'react';
import { PokerGameState } from './pokerGameTypes';
import { PokerSeat } from './PokerSeat';
import { PokerCommunityBoard } from './PokerCommunityBoard';
import { audio } from '../../lib/audio';

interface PokerTableArenaProps {
  state: PokerGameState;
}

export const PokerTableArena: React.FC<PokerTableArenaProps> = ({ state }) => {
  const { table, players } = state;
  if (!table) return null;

  // Derive colors from theme
  let feltColor = 'bg-[#1e5631]';
  let railColor = 'border-[#7a4b28]';
  let innerRailColor = 'border-[#133c21]';
  
  if (table.theme === 'red') {
    feltColor = 'bg-[#5a1820]';
    railColor = 'border-[#2d0c10]';
    innerRailColor = 'border-[#3a0f14]';
  } else if (table.theme === 'gold') {
    feltColor = 'bg-[#153a21]';
    railColor = 'border-[#d4af37]';
    innerRailColor = 'border-[#0a1d10]';
  } else if (table.theme === 'orange') {
    feltColor = 'bg-[#3d1c04]';
    railColor = 'border-[#7a3808]';
    innerRailColor = 'border-[#241002]';
  }

  return (
    <div className="relative w-full max-w-[1050px] mx-auto min-h-[400px] md:min-h-[560px] flex items-center justify-center pointer-events-none mt-8 md:mt-12 z-0">
      
      {/* Table Surface */}
      <div 
        className={`absolute inset-4 sm:inset-10 md:inset-16 ${feltColor} border-8 ${railColor} rounded-[100px] md:rounded-[200px] shadow-[0_10px_0_rgba(0,0,0,0.5),0_20px_20px_rgba(0,0,0,0.5)] overflow-hidden`}
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 15%, transparent 15%)',
          backgroundSize: '16px 16px',
        }}
      >
        <div className={`absolute inset-4 md:inset-8 border-4 border-dashed ${innerRailColor} rounded-[80px] md:rounded-[160px] opacity-50`} />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" />
      </div>

      {/* Community Area */}
      <div className="relative z-10 pointer-events-auto pb-8 md:pb-0">
        <PokerCommunityBoard state={state} />
      </div>

      {/* Seats */}
      {players.map((p, idx) => (
        <PokerSeat key={p.id} player={p} index={idx} totalPlayers={players.length} state={state} />
      ))}
      
    </div>
  );
};
