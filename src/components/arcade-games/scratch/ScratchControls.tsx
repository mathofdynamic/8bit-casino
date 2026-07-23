import React from 'react';
import { CasinoButton } from '../../ui-v2';
import { ScratchGamePhase } from './scratchTypes';
import { Sparkles, HelpCircle, RefreshCw } from 'lucide-react';

interface ScratchControlsProps {
  cardPrice: number;
  gamePhase: ScratchGamePhase;
  onPriceChange: (price: number) => void;
  onBuyCard: () => void;
  onAutoReveal: () => void;
  onRetryPayout: () => void;
  onOpenPaytable: () => void;
}

export const ScratchControls: React.FC<ScratchControlsProps> = ({
  cardPrice,
  gamePhase,
  onPriceChange,
  onBuyCard,
  onAutoReveal,
  onRetryPayout,
  onOpenPaytable,
}) => {
  const isBusy =
    gamePhase === 'active' ||
    gamePhase === 'auto-revealing' ||
    gamePhase === 'crediting' ||
    gamePhase === 'payout-error';

  return (
    <div className="w-full max-w-[440px] space-y-4 font-jersey uppercase">
      {/* Price Selector Bar */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] p-3 filter drop-shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#9A9AB5]">SELECT CARD PRICE TIER</span>
          <span className="text-xs text-[#F6B73C] font-bold">
            {cardPrice.toFixed(2)} COINS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0.05, 0.10, 0.25].map((price) => {
            const isSelected = cardPrice === price;
            return (
              <button
                key={price}
                type="button"
                disabled={isBusy}
                aria-pressed={isSelected}
                onClick={() => onPriceChange(price)}
                className={`py-2 text-sm font-bold border transition-none cursor-pointer ${
                  isSelected
                    ? 'bg-[#222744] border-[#F6B73C] text-[#F6B73C]'
                    : 'bg-[#15182A] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {price.toFixed(2)} COINS
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Action Triggers */}
      <div className="flex flex-col sm:flex-row gap-3">
        {gamePhase === 'payout-error' ? (
          <CasinoButton
            type="button"
            variant="magenta"
            soundType="none"
            onClick={onRetryPayout}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2 py-1">
              <RefreshCw className="w-5 h-5 text-[#F3EBD8]" />
              <span className="text-2xl tracking-widest">RETRY PAYOUT</span>
            </div>
          </CasinoButton>
        ) : gamePhase === 'active' || gamePhase === 'auto-revealing' ? (
          <CasinoButton
            type="button"
            variant="cyan"
            soundType="none"
            disabled={gamePhase === 'auto-revealing'}
            onClick={onAutoReveal}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2 py-1">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="text-2xl tracking-widest text-black font-bold">
                {gamePhase === 'auto-revealing' ? 'REVEALING...' : 'AUTO REVEAL'}
              </span>
            </div>
          </CasinoButton>
        ) : (
          <CasinoButton
            type="button"
            variant="gold"
            soundType="none"
            disabled={gamePhase === 'crediting'}
            onClick={onBuyCard}
            className="flex-1"
          >
            <div className="flex items-center justify-center gap-2 py-1">
              <Sparkles className="w-5 h-5 text-black" />
              <span className="text-2xl tracking-widest text-black font-bold">
                {gamePhase === 'crediting'
                  ? 'CREDITING PAYOUT...'
                  : gamePhase === 'win' || gamePhase === 'loss'
                  ? `BUY ANOTHER CARD — ${cardPrice.toFixed(2)}`
                  : `BUY CARD — ${cardPrice.toFixed(2)} COINS`}
              </span>
            </div>
          </CasinoButton>
        )}

        <CasinoButton
          type="button"
          variant="dark"
          onClick={onOpenPaytable}
          className="shrink-0"
        >
          <div className="flex items-center justify-center gap-1.5 py-1">
            <HelpCircle className="w-5 h-5 text-[#F3EBD8]" />
            <span className="text-lg">PAYTABLE</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
