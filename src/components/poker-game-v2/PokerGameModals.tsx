import React from 'react';
import { CasinoPanel, CasinoButton, CasinoSlider } from '../ui-v2';
import { PokerGameState, PokerGameActions, PokerGameUiState } from './pokerGameTypes';
import { PokerCard } from './PokerCard';
import { audio } from '../../lib/audio';

interface PokerGameModalsProps {
  state: PokerGameState;
  uiState: PokerGameUiState;
  actions: PokerGameActions;
  walletBalance: number;
}

export const PokerGameModals: React.FC<PokerGameModalsProps> = ({ state, uiState, actions, walletBalance }) => {
  const { table, winners, gameStage, players } = state;
  const { isRebuyOpen, rebuyAmount, isRebuyPending, isExitConfirmOpen, isExitPending } = uiState;

  const hero = players[0];

  return (
    <>
      {/* Rebuy Modal */}
      {isRebuyOpen && table && hero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <CasinoPanel title="BUY IN CHIPS" onClose={actions.onCloseRebuy} className="w-full max-w-sm">
            <div className="flex flex-col gap-6 text-center mt-2">
               <p className="font-jersey text-lg text-[#F3EBD8]">
                 Top up your stack for this table.
               </p>
               
               <div className="bg-[#111111] border-2 border-[#15182A] p-4 flex flex-col gap-2" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                 <div className="flex justify-between font-jersey text-sm uppercase">
                   <span className="text-[#9A9AB5]">Wallet: {walletBalance.toFixed(2)}</span>
                   <span className="text-[#54D6D9]">Stack: {hero.stack.toFixed(2)}</span>
                 </div>
                 
                 <div className="text-3xl font-jersey text-[#F6B73C] my-2">
                   {rebuyAmount.toFixed(2)} COINS
                 </div>

                 <CasinoSlider
                   value={rebuyAmount}
                   min={0}
                   max={Math.min(walletBalance, Math.max(0, table.maxBuyIn - hero.stack))}
                   step={table.bigBlind}
                   onChange={actions.onRebuyAmountChange}
                   disabled={isRebuyPending}
                 />
                 
                 <div className="flex justify-between font-jersey text-xs text-[#63657A] uppercase mt-1">
                   <span>MIN: 0</span>
                   <span>MAX: {Math.min(walletBalance, Math.max(0, table.maxBuyIn - hero.stack)).toFixed(2)}</span>
                 </div>
               </div>

               <div className="flex gap-4 justify-center mt-2">
                 <CasinoButton variant="dark" onClick={actions.onCloseRebuy} disabled={isRebuyPending}>CANCEL</CasinoButton>
                 <CasinoButton variant="gold" onClick={actions.onConfirmRebuy} disabled={isRebuyPending || rebuyAmount <= 0}>
                   {isRebuyPending ? 'PROCESSING...' : 'CONFIRM'}
                 </CasinoButton>
               </div>
            </div>
          </CasinoPanel>
        </div>
      )}

      {/* Exit Confirm Modal */}
      {isExitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <CasinoPanel title="STAND UP & EXIT?" onClose={actions.onCancelExit} className="w-full max-w-sm">
            <div className="flex flex-col gap-6 text-center mt-2">
               <p className="font-jersey text-lg text-[#F3EBD8]">
                 Are you sure you want to leave the table?
               </p>
               {hero && hero.stack > 0 && (
                 <p className="font-jersey text-md text-[#54D6D9]">
                   {hero.stack.toFixed(2)} COINS will be returned to your wallet.
                 </p>
               )}
               <div className="flex gap-4 justify-center mt-4">
                 <CasinoButton variant="dark" onClick={actions.onCancelExit} disabled={isExitPending}>CANCEL</CasinoButton>
                 <CasinoButton variant="danger" onClick={actions.onConfirmExit} disabled={isExitPending}>
                   {isExitPending ? 'LEAVING...' : 'CONFIRM EXIT'}
                 </CasinoButton>
               </div>
            </div>
          </CasinoPanel>
        </div>
      )}

      {/* Winner Overlay */}
      {gameStage === 'SHOWDOWN' && winners.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-[#15182A] border-4 border-[#F6B73C] p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-300 shadow-[8px_8px_0_rgba(0,0,0,0.8)]" style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}>
            <h2 className="font-jersey text-4xl md:text-5xl text-[#F6B73C] mb-4 uppercase" style={{ textShadow: '4px 4px 0 #000' }}>
              {winners.length > 1 ? 'SPLIT POT!' : 'WINNER!'}
            </h2>
            {winners.map((w, i) => (
              <div key={i} className="flex flex-col items-center mb-6 last:mb-0">
                <span className="font-jersey text-2xl md:text-3xl text-[#F3EBD8] uppercase">{w.name} WINS {w.prize.toFixed(2)}</span>
                <span className="font-jersey text-lg md:text-xl text-[#54D6D9] uppercase mb-4">{w.handName}</span>
                <div className="flex gap-2 justify-center">
                  {w.cards && w.cards.map((c, j) => (
                    <PokerCard key={j} card={c} size="hero" />
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-8">
              <CasinoButton variant="gold" onClick={actions.onNextHand}>
                NEXT HAND
              </CasinoButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
