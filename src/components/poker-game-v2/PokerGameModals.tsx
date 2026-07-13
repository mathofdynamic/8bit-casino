import React, { useState } from 'react';
import { PixelPanel, PixelButton } from '../PixelUI';
import { PokerGameState, PokerGameActions } from './pokerGameTypes';
import { PokerCard } from './PokerCard';

interface PokerGameModalsProps {
  state: PokerGameState;
  actions: PokerGameActions;
  isRebuyOpen: boolean;
  onCloseRebuy: () => void;
  walletBalance: number;
}

export const PokerGameModals: React.FC<PokerGameModalsProps> = ({ state, actions, isRebuyOpen, onCloseRebuy, walletBalance }) => {
  const { table, winners, gameStage } = state;

  return (
    <>
      {/* Rebuy Modal */}
      {isRebuyOpen && table && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <PixelPanel title="REBUY CHIPS" onBack={onCloseRebuy} className="w-full max-w-sm">
            <div className="flex flex-col gap-4 text-center">
               <p className="font-jersey text-lg text-[#F3EBD8]">
                 Top up to the maximum buy-in of {table.maxBuyIn.toFixed(2)} COINS?
               </p>
               <p className="font-jersey text-sm text-[#9A9AB5]">
                 WALLET BALANCE: {walletBalance.toFixed(2)} COINS
               </p>
               <div className="flex gap-4 justify-center mt-4">
                 <PixelButton onClick={onCloseRebuy}>CANCEL</PixelButton>
                 <PixelButton variant="gold" onClick={actions.onConfirmRebuy}>CONFIRM REBUY</PixelButton>
               </div>
            </div>
          </PixelPanel>
        </div>
      )}

      {/* Winner Overlay */}
      {gameStage === 'SHOWDOWN' && winners.length > 0 && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#15182A] border-4 border-[#F6B73C] p-6 flex flex-col items-center animate-in zoom-in duration-300" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
            <h2 className="font-jersey text-4xl text-[#F6B73C] mb-2 uppercase" style={{ textShadow: '3px 3px 0 #000' }}>
              WINNER!
            </h2>
            {winners.map((w, i) => (
              <div key={i} className="flex flex-col items-center mb-4 last:mb-0">
                <span className="font-jersey text-2xl text-[#F3EBD8] uppercase">{w.name} WINS {w.prize.toFixed(2)} COINS</span>
                <span className="font-jersey text-lg text-[#54D6D9] uppercase mb-3">{w.handName}</span>
                <div className="flex gap-2 justify-center">
                  {w.cards && w.cards.map((c, j) => (
                    <PokerCard key={j} card={c} size="hero" />
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-8">
              <PixelButton variant="gold" onClick={actions.onNextHand}>
                NEXT HAND
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
