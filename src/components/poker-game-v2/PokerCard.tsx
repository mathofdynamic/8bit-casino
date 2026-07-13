import React from 'react';
import { Card, SUIT_SYMBOLS } from '../../lib/pokerEngine';
import { formatRank } from '../../lib/pokerEngine';

interface PokerCardProps {
  card?: Card;
  isFacedown?: boolean;
  size?: 'hero' | 'opponent' | 'community';
}

export const PokerCard: React.FC<PokerCardProps> = ({ card, isFacedown = false, size = 'community' }) => {
  const sizeClasses = {
    hero: 'w-[48px] h-[68px] sm:w-[58px] sm:h-[82px]',
    opponent: 'w-[32px] h-[46px] sm:w-[38px] sm:h-[54px]',
    community: 'w-[42px] h-[60px] sm:w-[52px] sm:h-[74px]',
  };

  const textClasses = {
    hero: 'text-lg',
    opponent: 'text-xs',
    community: 'text-base',
  };

  const symbolClasses = {
    hero: 'text-3xl',
    opponent: 'text-xl',
    community: 'text-2xl',
  };

  const smallSymbolClasses = {
    hero: 'text-[12px]',
    opponent: 'text-[8px]',
    community: 'text-[10px]',
  };

  if (isFacedown || !card) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-[#1D2036] border-2 border-[#44476B] flex items-center justify-center relative overflow-hidden shadow-[2px_2px_0px_rgba(0,0,0,0.5)]`}
        style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        aria-label="Hidden card"
      >
        <div className="absolute inset-1 border border-[#2E3150] bg-[#15182A] flex flex-wrap justify-center items-center gap-1 p-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-[#44476B]/30 rotate-45" />
          ))}
        </div>
      </div>
    );
  }

  const isRed = card.suit === 'H' || card.suit === 'D';
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <div 
      className={`${sizeClasses[size]} bg-[#F3EBD8] border-2 border-[#15182A] flex flex-col justify-between p-1 relative shadow-[2px_2px_0px_rgba(0,0,0,0.5)]`}
      style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
      aria-label={`${formatRank(card.rank)} of ${card.suit === 'H' ? 'Hearts' : card.suit === 'D' ? 'Diamonds' : card.suit === 'S' ? 'Spades' : 'Clubs'}`}
    >
      <div className={`font-jersey ${textClasses[size]} leading-none flex justify-between items-center ${isRed ? 'text-[#E85D68]' : 'text-[#15182A]'}`}>
        <span>{formatRank(card.rank)}</span>
        <span className={smallSymbolClasses[size]}>{symbol}</span>
      </div>
      <div className={`font-jersey ${symbolClasses[size]} self-center leading-none ${isRed ? 'text-[#E85D68]' : 'text-[#15182A]'}`}>
        {symbol}
      </div>
      <div className={`font-jersey ${textClasses[size]} leading-none flex justify-between items-center rotate-180 ${isRed ? 'text-[#E85D68]' : 'text-[#15182A]'}`}>
        <span>{formatRank(card.rank)}</span>
        <span className={smallSymbolClasses[size]}>{symbol}</span>
      </div>
    </div>
  );
};
