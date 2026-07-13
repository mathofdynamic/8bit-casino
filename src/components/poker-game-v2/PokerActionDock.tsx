import React, { useState } from 'react';
import { PokerGameState, PokerGameActions } from './pokerGameTypes';
import { CasinoButton } from '../ui-v2';
import { audio } from '../../lib/audio';
import { Coins } from 'lucide-react';

interface PokerActionDockProps {
  state: PokerGameState;
  actions: PokerGameActions;
  userRaiseAmount: number;
  minRaise: number;
}

export const PokerActionDock: React.FC<PokerActionDockProps> = ({ state, actions, userRaiseAmount, minRaise }) => {
  const { players, currentPlayerIndex, gameStage, currentBet } = state;
  const [isRaising, setIsRaising] = useState(false);
  
  const hero = players[0];
  if (!hero) return null;

  const isHeroTurn = currentPlayerIndex === 0 && gameStage !== 'WAITING_FOR_DEAL' && gameStage !== 'SHOWDOWN';
  const toCall = currentBet - hero.bet;
  const canCheck = toCall === 0;

  const getStepSize = (min: number, max: number) => {
    const range = max - min;
    if (range <= 1.5) return 0.05;
    if (range <= 10.0) return 0.50;
    if (range <= 100.0) return 5.00;
    return 25.00;
  };

  const maxAvailable = hero.stack + hero.bet;
  const effectiveMinRaise = Math.min(minRaise + currentBet, maxAvailable);

  const handleStep = (dir: 'up' | 'down') => {
    const step = getStepSize(effectiveMinRaise, maxAvailable);
    let next = dir === 'up' ? userRaiseAmount + step : userRaiseAmount - step;
    next = Math.max(effectiveMinRaise, Math.min(maxAvailable, next));
    actions.onRaiseChange(Number(next.toFixed(2)));
    audio.playClick();
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-[#0B0D18]/95 border-t-2 border-[#44476B] p-4 flex flex-col md:flex-row items-center justify-between gap-4 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
      
      {/* Hero Status */}
      <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
           <div className="flex flex-col text-center md:text-left">
             <span className="font-jersey text-lg text-[#F3EBD8] uppercase leading-none">{hero.name}</span>
             <div className="flex items-center gap-1 text-[#F6B73C] mt-1">
               <Coins className="w-4 h-4" />
               <span className="font-jersey text-md leading-none">{hero.stack.toFixed(2)} COINS</span>
             </div>
           </div>
        </div>
      </div>

      {/* Action Controls */}
      {gameStage === 'SHOWDOWN' ? (
        <div className="flex-1 flex justify-center">
          <span className="font-jersey text-xl text-[#F6B73C] uppercase tracking-widest">SHOWDOWN</span>
        </div>
      ) : !isHeroTurn ? (
        <div className="flex-1 flex justify-center">
          <span className="font-jersey text-xl text-[#9A9AB5] uppercase tracking-widest">
            WAITING FOR {players[currentPlayerIndex]?.name || 'OPPONENT'}
          </span>
        </div>
      ) : isRaising ? (
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 w-full">
           <div className="flex items-center gap-4 w-full md:w-auto">
             <button onClick={() => handleStep('down')} className="w-10 h-10 bg-[#15182A] border-2 border-[#2E3150] text-[#F3EBD8] font-jersey text-xl flex items-center justify-center hover:bg-[#1D2036] active:translate-y-1 transition-transform" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
               -
             </button>
             <div className="flex-1 md:w-48 text-center bg-[#111111] border-2 border-[#15182A] p-2" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
               <span className="font-jersey text-xl text-[#F6B73C]">{userRaiseAmount.toFixed(2)} COINS</span>
             </div>
             <button onClick={() => handleStep('up')} className="w-10 h-10 bg-[#15182A] border-2 border-[#2E3150] text-[#F3EBD8] font-jersey text-xl flex items-center justify-center hover:bg-[#1D2036] active:translate-y-1 transition-transform" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
               +
             </button>
           </div>
           
           <div className="flex gap-2">
             <CasinoButton variant="dark" onClick={() => { setIsRaising(false); audio.playClick(); }}>CANCEL</CasinoButton>
             <CasinoButton variant="gold" onClick={() => { actions.onPlayerAction('RAISE', userRaiseAmount); setIsRaising(false); }}>CONFIRM RAISE</CasinoButton>
           </div>
        </div>
      ) : (
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <CasinoButton variant="danger" onClick={() => actions.onPlayerAction('FOLD')} disabled={!isHeroTurn}>
            FOLD
          </CasinoButton>
          
          <CasinoButton variant={canCheck ? "cyan" : "dark"} onClick={() => actions.onPlayerAction('CHECK')} disabled={!isHeroTurn || !canCheck}>
            CHECK
          </CasinoButton>

          <CasinoButton variant={!canCheck ? "gold" : "dark"} onClick={() => actions.onPlayerAction('CALL')} disabled={!isHeroTurn || canCheck || hero.stack <= 0}>
            CALL {toCall > 0 ? toCall.toFixed(2) : ''}
          </CasinoButton>

          <CasinoButton variant="dark" onClick={() => setIsRaising(true)} disabled={!isHeroTurn || hero.stack <= 0 || maxAvailable < effectiveMinRaise}>
            RAISE
          </CasinoButton>
        </div>
      )}

      {/* Decorative Right End */}
      <div className="hidden md:block shrink-0 w-24"></div>
    </div>
  );
};
