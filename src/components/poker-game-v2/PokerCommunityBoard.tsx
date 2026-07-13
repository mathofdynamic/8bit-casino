import React from 'react';
import { PokerCard } from './PokerCard';
import { PokerGameState } from './pokerGameTypes';
import { Coins } from 'lucide-react';

interface PokerCommunityBoardProps {
  state: PokerGameState;
}

export const PokerCommunityBoard: React.FC<PokerCommunityBoardProps> = ({ state }) => {
  const { communityCards, pot } = state;
  const placeholders = ['FLOP', 'FLOP', 'FLOP', 'TURN', 'RIVER'];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Pot Display */}
      <div className="flex flex-col items-center select-none bg-[#111111]/80 px-4 py-2 rounded-lg border border-[#2E3150]">
        <span className="font-jersey text-xs text-[#9A9AB5] uppercase tracking-wider mb-1">Total Pot</span>
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-[#F6B73C]" />
          <span className="font-jersey text-2xl text-[#F6B73C]" style={{ textShadow: '2px 2px 0 #000' }}>
            {pot.toFixed(2)} COINS
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex items-center justify-center gap-2">
        {placeholders.map((label, idx) => {
          const card = communityCards[idx];
          if (card) {
            return (
              <div key={idx} className="animate-in slide-in-from-top-4 duration-300">
                <PokerCard card={card} size="community" />
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="w-[42px] h-[60px] sm:w-[52px] sm:h-[74px] border-2 border-[#2E3150] bg-[#111111]/50 flex items-center justify-center shadow-inner"
              style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
            >
              <span className="font-jersey text-[10px] text-[#44476B] uppercase rotate-90 sm:rotate-0 tracking-widest">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
