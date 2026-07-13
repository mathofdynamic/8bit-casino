import React from 'react';
import { PlayerState } from '../../lib/pokerEngine';
import { PokerCard } from './PokerCard';
import { PokerGameState } from './pokerGameTypes';
import { PixelAvatar } from '../../lib/avatars';

interface PokerSeatProps {
  player: PlayerState;
  index: number;
  totalPlayers: number;
  state: PokerGameState;
}

export const PokerSeat: React.FC<PokerSeatProps> = ({ player, index, totalPlayers, state }) => {
  const { dealerIndex, currentPlayerIndex, gameStage } = state;
  const isHero = index === 0;
  const isCurrentTurn = currentPlayerIndex === index && gameStage !== 'WAITING_FOR_DEAL' && gameStage !== 'SHOWDOWN';
  const isDealer = dealerIndex === index;

  const sbIndex = (dealerIndex + 1) % totalPlayers;
  const bbIndex = (dealerIndex + 2) % totalPlayers;
  const isSB = index === sbIndex;
  const isBB = index === bbIndex;

  const positions = [
    'bottom-[-16px] left-1/2 -translate-x-1/2', 
    'bottom-[15%] left-[2%] md:left-[5%]',     
    'top-[12%] left-[4%] md:left-[7%]',       
    'top-[-16px] left-1/2 -translate-x-1/2',    
    'top-[12%] right-[4%] md:right-[7%]',      
    'bottom-[15%] right-[2%] md:right-[5%]'    
  ];

  let seatIdx = index;
  if (totalPlayers === 2) {
    seatIdx = index === 0 ? 0 : 3;
  } else if (totalPlayers === 3) {
    if (index === 0) seatIdx = 0;
    else if (index === 1) seatIdx = 2;
    else if (index === 2) seatIdx = 4;
  } else if (totalPlayers === 4) {
    if (index === 0) seatIdx = 0;
    else if (index === 1) seatIdx = 1;
    else if (index === 2) seatIdx = 3;
    else if (index === 3) seatIdx = 5;
  } else if (totalPlayers === 5) {
    if (index === 0) seatIdx = 0;
    else if (index === 1) seatIdx = 1;
    else if (index === 2) seatIdx = 2;
    else if (index === 3) seatIdx = 4;
    else if (index === 4) seatIdx = 5;
  } else {
    seatIdx = index % positions.length;
  }

  const posClass = positions[seatIdx];

  const borderClass = isCurrentTurn 
    ? 'border-[#54D6D9] shadow-[0_0_10px_rgba(84,214,217,0.5)]' 
    : 'border-[#2E3150] shadow-[2px_2px_0_rgba(0,0,0,0.5)]';

  const foldedClass = player.isFolded ? 'opacity-50 grayscale-[50%]' : '';

  return (
    <div className={`absolute ${posClass} flex flex-col items-center ${foldedClass} z-20 pointer-events-auto transition-all duration-300`}>
      {/* Cards */}
      <div className={`flex gap-1 mb-[-12px] relative z-0 transition-transform ${isCurrentTurn && !player.isFolded ? '-translate-y-2' : ''}`}>
        {player.cards && player.cards.length > 0 ? (
          <>
            <div className="rotate-[-6deg] translate-x-2">
              <PokerCard card={player.cards[0]} isFacedown={!isHero && gameStage !== 'SHOWDOWN'} size={isHero ? 'hero' : 'opponent'} />
            </div>
            <div className="rotate-[6deg] -translate-x-2">
              <PokerCard card={player.cards[1]} isFacedown={!isHero && gameStage !== 'SHOWDOWN'} size={isHero ? 'hero' : 'opponent'} />
            </div>
          </>
        ) : (
          <div className="h-[46px] sm:h-[54px]" /> // Placeholder for empty cards
        )}
      </div>

      {/* Seat Info */}
      <div 
        className={`bg-[#15182A] border-2 ${borderClass} p-2 flex flex-col items-center relative z-10 w-28 md:w-32`}
        style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        aria-label={`${player.name}, ${player.stack.toFixed(2)} Coins, ${isCurrentTurn ? 'current turn' : ''}, ${player.lastAction}`}
      >
        {isDealer && (
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center font-jersey text-black text-xs shadow-[2px_2px_0_rgba(0,0,0,0.5)] z-20" aria-label="Dealer">
            D
          </div>
        )}
        {(isSB || isBB) && (
          <div className={`absolute -top-3 -left-3 px-1.5 h-5 ${isSB ? 'bg-[#54D6D9]' : 'bg-[#D95F9A]'} border-2 border-[#15182A] flex items-center justify-center font-jersey text-[#15182A] text-[10px] uppercase shadow-[2px_2px_0_rgba(0,0,0,0.5)] z-20`} style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}>
            {isSB ? 'SB' : 'BB'}
          </div>
        )}

        <div className="flex items-center gap-2 mb-1 w-full justify-center">
          <div className="w-8 h-8 shrink-0 border border-[#2E3150] bg-[#0B0D18] flex items-center justify-center overflow-hidden" style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}>
             <PixelAvatar avatarId={player.avatarId} size={28} className="w-6 h-6 object-contain" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="font-jersey text-xs text-[#F3EBD8] uppercase truncate leading-none">
              {isHero ? 'YOU' : player.name}
            </div>
            <div className="font-jersey text-[10px] text-[#F6B73C] leading-none mt-1 truncate">
              {player.stack.toFixed(2)} COINS
            </div>
          </div>
        </div>
        
        {player.isFolded ? (
          <div className="w-full bg-[#111111] border border-[#2E3150] py-0.5 text-center font-jersey text-[10px] text-[#63657A] uppercase mt-1">
            FOLDED
          </div>
        ) : player.isAllIn ? (
          <div className="w-full bg-[#E85D68]/20 border border-[#E85D68] py-0.5 text-center font-jersey text-[10px] text-[#E85D68] uppercase mt-1">
            ALL-IN
          </div>
        ) : player.lastAction ? (
          <div className="w-full bg-[#222744] border border-[#44476B] py-0.5 text-center font-jersey text-[10px] text-[#54D6D9] uppercase mt-1 truncate px-1">
            {player.lastAction}
          </div>
        ) : isCurrentTurn ? (
          <div className="w-full bg-[#54D6D9]/20 border border-[#54D6D9] py-0.5 text-center font-jersey text-[10px] text-[#54D6D9] uppercase mt-1">
            TURN
          </div>
        ) : (
          <div className="w-full h-[18px] mt-1" />
        )}
      </div>

      {/* Bet amount floating near seat */}
      {player.bet > 0 && !player.isFolded && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111111]/80 border border-[#2E3150] px-2 py-0.5 flex items-center gap-1 shadow-[2px_2px_0_rgba(0,0,0,0.5)] z-30" style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}>
          <span className="font-jersey text-xs text-[#F6B73C]">BET {player.bet.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};
