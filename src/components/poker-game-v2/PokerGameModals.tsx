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
          <CasinoPanel title="REBUY" onClose={actions.onCloseRebuy} className="w-full max-w-sm">
            <div className="flex flex-col gap-6 text-center mt-2">
               <div className="bg-[#111111] border-2 border-[#15182A] p-4 flex flex-col gap-2" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                 <div className="flex justify-between font-jersey text-sm uppercase">
                   <span className="text-[#9A9AB5]">Wallet: {walletBalance.toFixed(2)}</span>
                   <span className="text-[#54D6D9]">Stack: {hero.stack.toFixed(2)}</span>
                 </div>
                 
                 <div className="text-3xl font-jersey text-[#F6B73C] my-2">
                   {rebuyAmount.toFixed(2)} COINS
                 </div>

                 <div className="flex items-center gap-4">
                   <CasinoButton 
                     variant="dark" 
                     onClick={() => actions.onRebuyAmountChange(Math.max(0, rebuyAmount - table.bigBlind))}
                     disabled={isRebuyPending || rebuyAmount <= 0}
                     aria-label="Decrease rebuy amount"
                   >
                     -
                   </CasinoButton>
                   <div className="flex-1">
                     <CasinoSlider
                       value={rebuyAmount}
                       min={0}
                       max={Math.max(0, Math.min(walletBalance, table.maxBuyIn - hero.stack))}
                       step={table.bigBlind}
                       onChange={actions.onRebuyAmountChange}
                       disabled={isRebuyPending}
                       aria-label="Rebuy amount"
                     />
                   </div>
                   <CasinoButton 
                     variant="dark" 
                     onClick={() => actions.onRebuyAmountChange(Math.min(Math.max(0, Math.min(walletBalance, table.maxBuyIn - hero.stack)), rebuyAmount + table.bigBlind))}
                     disabled={isRebuyPending || rebuyAmount >= Math.max(0, Math.min(walletBalance, table.maxBuyIn - hero.stack))}
                     aria-label="Increase rebuy amount"
                   >
                     +
                   </CasinoButton>
                 </div>
                 
                 <div className="flex justify-between items-center font-jersey text-xs text-[#63657A] uppercase mt-1">
                   <span>MIN: 0</span>
                   <button 
                     onClick={() => actions.onRebuyAmountChange(Math.max(0, Math.min(walletBalance, table.maxBuyIn - hero.stack)))}
                     disabled={isRebuyPending}
                     className="text-[#54D6D9] hover:text-white underline cursor-pointer"
                     aria-label="Set maximum rebuy amount"
                   >
                     MAX: {Math.max(0, Math.min(walletBalance, table.maxBuyIn - hero.stack)).toFixed(2)}
                   </button>
                 </div>
                 
                 <div className="flex justify-between font-jersey text-sm uppercase mt-4 pt-2 border-t border-[#2E3150]">
                   <span className="text-[#9A9AB5]">NEW STACK: {(hero.stack + rebuyAmount).toFixed(2)}</span>
                   <span className="text-[#9A9AB5]">NEW WALLET: {(walletBalance - rebuyAmount).toFixed(2)}</span>
                 </div>
               </div>

               <div className="flex gap-4 justify-center mt-2">
                 <CasinoButton variant="dark" onClick={actions.onCloseRebuy} disabled={isRebuyPending}>CANCEL</CasinoButton>
                 <CasinoButton 
                   variant="gold" 
                   onClick={actions.onConfirmRebuy} 
                   disabled={isRebuyPending || rebuyAmount <= 0 || rebuyAmount > walletBalance || hero.stack + rebuyAmount > table.maxBuyIn}
                 >
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
          <CasinoPanel title="LEAVE TABLE?" onClose={actions.onCancelExit} className="w-full max-w-sm">
            <div className="flex flex-col gap-6 text-center mt-2">
               <p className="font-jersey text-lg text-[#F3EBD8]">
                 Your remaining table stack will be returned to your casino wallet.
               </p>
               
               <div className="bg-[#111111] border-2 border-[#15182A] p-4 flex flex-col gap-3 font-jersey uppercase" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
                 <div className="flex justify-between text-[#54D6D9]">
                   <span>TABLE STACK</span>
                   <span>{hero?.stack.toFixed(2) || '0.00'} COINS</span>
                 </div>
                 <div className="flex justify-between text-[#9A9AB5]">
                   <span>CURRENT WALLET</span>
                   <span>{walletBalance.toFixed(2)} COINS</span>
                 </div>
                 <div className="flex justify-between text-[#F6B73C] pt-2 border-t border-[#2E3150]">
                   <span>WALLET AFTER CASH-OUT</span>
                   <span>{(walletBalance + (hero?.stack || 0)).toFixed(2)} COINS</span>
                 </div>
               </div>

               <div className="flex gap-4 justify-center mt-4">
                 <CasinoButton variant="dark" onClick={actions.onCancelExit} disabled={isExitPending}>CANCEL</CasinoButton>
                 <CasinoButton variant="danger" onClick={actions.onConfirmExit} disabled={isExitPending}>
                   {isExitPending ? 'PROCESSING...' : 'STAND & CASH OUT'}
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
            <div className="mt-8 flex gap-4">
              <CasinoButton variant="danger" onClick={actions.onRequestExit}>
                STAND & EXIT
              </CasinoButton>
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
