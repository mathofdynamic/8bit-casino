/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { PokerTable } from './pokerTypes';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../ui-v2';
import { useStore } from '../../store';
import { PokerMiniTablePreview } from './PokerMiniTablePreview';
import { Lock, Play, Star, X, Eye, Heart } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerTableDetailsProps {
  table: PokerTable | null;
  buyInAmount: number;
  setBuyInAmount: (amount: number) => void;
  onJoinTable: (table: PokerTable, buyIn: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (tableId: string, e: React.MouseEvent) => void;
  onClearSelection: () => void;
}

export const PokerTableDetails: React.FC<PokerTableDetailsProps> = ({
  table,
  buyInAmount,
  setBuyInAmount,
  onJoinTable,
  isFavorite,
  onToggleFavorite,
  onClearSelection,
}) => {
  const { profile, triggerToast } = useStore();

  if (!table) {
    return (
      <CasinoPanel 
        title="TABLE DETAILS" 
        subtitle="No table linked"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center select-none min-h-[300px] font-jersey">
          <span className="text-[#63657A] text-5xl mb-4 leading-none">🖥️</span>
          <p className="font-jersey text-lg text-[#9A9AB5] uppercase leading-none">NO ACTIVE CABINET LINK</p>
          <p className="font-jersey text-xs text-[#63657A] uppercase mt-2 max-w-xs leading-tight">
            Click on any available poker table from the main cabinet browser list to inspect stakes, seats, and buy-in meters.
          </p>
        </div>
      </CasinoPanel>
    );
  }

  const isAffordable = profile.chips >= table.minBuyIn;
  const isFull = table.seatsFilled >= table.maxSeats;
  const isDisabled = table.isLocked || isFull || !isAffordable;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBuyInAmount(Number(val.toFixed(2)));
  };

  const handleMin = () => {
    audio.playClick();
    setBuyInAmount(table.minBuyIn);
  };

  const handleMax = () => {
    audio.playClick();
    const maxVal = Math.min(table.maxBuyIn, profile.chips);
    setBuyInAmount(Number(maxVal.toFixed(2)));
  };

  const handleDecrement = () => {
    audio.playClick();
    const step = 1.00;
    const newVal = Math.max(table.minBuyIn, buyInAmount - step);
    setBuyInAmount(Number(newVal.toFixed(2)));
  };

  const handleIncrement = () => {
    audio.playClick();
    const step = 1.00;
    const maxVal = Math.min(table.maxBuyIn, profile.chips);
    const newVal = Math.min(maxVal, buyInAmount + step);
    setBuyInAmount(Number(newVal.toFixed(2)));
  };

  const handleJoinClick = () => {
    if (isDisabled) return;
    onJoinTable(table, buyInAmount);
  };

  const handleWatchClick = () => {
    audio.playClick();
    triggerToast(`SPECTATOR MODE ACTIVATED FOR ${table.name}. OBSERVING SEAT ACTIONS...`, 'info');
  };

  const balanceAfter = Math.max(0, profile.chips - buyInAmount);

  return (
    <CasinoPanel 
      title={`CABINET: ${table.name}`} 
      subtitle={table.gameType}
      borderColor="strong"
      headerRight={
        <div className="flex items-center gap-2 -mr-1">
          {/* Favorite Star Icon with correct accessible attributes and V2 colors */}
          <button
            onClick={(e) => onToggleFavorite(table.id, e)}
            className="p-1 text-[#63657A] hover:text-[#F6B73C] cursor-pointer"
            aria-label={isFavorite ? `Remove ${table.name} from favorites` : `Add ${table.name} to favorites`}
            aria-pressed={isFavorite}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-[#F6B73C] text-[#F6B73C]' : ''}`} />
          </button>
          {/* Clear / Close selection */}
          <button
            onClick={() => { audio.playClick(); onClearSelection(); }}
            className="p-1 text-[#63657A] hover:text-[#E85D68] cursor-pointer"
            aria-label="Clear table selection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-2.5 select-none font-jersey">
        
        {/* Compact mini table preview */}
        <div className="bg-[#0B0D18] p-1.5 border border-[#2E3150]/60" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
          <PokerMiniTablePreview table={table} />
        </div>

        {/* Compact two-column grid list of parameters */}
        <div className="grid grid-cols-2 gap-1.5 text-xs bg-[#0B0D18] p-2 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
          <div className="flex flex-col">
            <span className="text-[#63657A] uppercase text-[10px]">Game Type</span>
            <span className="text-sm text-[#F3EBD8] leading-none mt-0.5">{table.gameType}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#63657A] uppercase text-[10px]">Difficulty</span>
            <span className="text-sm text-[#F29E4C] leading-none mt-0.5">{table.difficulty}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#63657A] uppercase text-[10px]">Seats</span>
            <span className="text-sm text-[#54D6D9] leading-none mt-0.5">{table.seatsFilled} / {table.maxSeats} FILLED</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#63657A] uppercase text-[10px]">Speed</span>
            <span className="text-sm text-[#D95F9A] leading-none mt-0.5">{table.speed}</span>
          </div>
          <div className="flex flex-col col-span-2 border-t border-[#2E3150]/50 pt-1.5 mt-0.5">
            <span className="text-[#63657A] uppercase text-[10px]">Stakes</span>
            <span className="text-sm text-[#66D18F] leading-none mt-0.5">{table.smallBlind.toFixed(2)} / {table.bigBlind.toFixed(2)} Blinds</span>
          </div>
          <div className="flex flex-col col-span-2 border-t border-[#2E3150]/50 pt-1.5">
            <span className="text-[#63657A] uppercase text-[10px]">Buy-In Range</span>
            <span className="text-sm text-[#F6B73C] leading-none mt-0.5">{table.minBuyIn.toFixed(2)} - {table.maxBuyIn.toFixed(2)} Coins</span>
          </div>
          <div className="flex flex-col border-t border-[#2E3150]/50 pt-1.5">
            <span className="text-[#63657A] uppercase text-[10px]">Average Pot</span>
            <span className="text-sm text-[#F3EBD8] leading-none mt-0.5">{table.averagePot.toFixed(2)}</span>
          </div>
          <div className="flex flex-col border-t border-[#2E3150]/50 pt-1.5">
            <span className="text-[#63657A] uppercase text-[10px]">Hand Speed</span>
            <span className="text-sm text-[#54D6D9] leading-none mt-0.5">{table.averageHandTime}S / DEAL</span>
          </div>
        </div>

        {/* Compact Buy-In area */}
        <div className="space-y-2 bg-[#0B0D18] p-2 border border-[#2E3150]" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
          {/* Wallet Balance Info */}
          <div className="flex items-center justify-between border-b border-[#2E3150]/50 pb-1.5 text-xs">
            <div>
              <span className="text-[#63657A] uppercase text-[9px]">YOUR WALLET BALANCE</span>
              <p className="text-sm font-jersey text-[#F6B73C] leading-none mt-0.5">{profile.chips.toFixed(2)} COINS</p>
            </div>
            <CasinoBadge variant={isAffordable ? 'success' : 'danger'} className="py-0.5 px-1 text-[9px]">
              {isAffordable ? 'FUNDS OK' : 'INSUFFICIENT'}
            </CasinoBadge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-jersey text-[11px] text-[#9A9AB5] uppercase leading-none">SELECT BUY-IN METER</span>
            <span className="font-jersey text-xs text-[#F6B73C] uppercase leading-none font-bold">
              {buyInAmount.toFixed(2)} COINS
            </span>
          </div>

          {/* Slider input */}
          {!isDisabled && (
            <input 
              type="range"
              min={table.minBuyIn}
              max={Math.min(table.maxBuyIn, profile.chips)}
              step="0.01"
              value={buyInAmount}
              onChange={handleSliderChange}
              className="w-full accent-[#F6B73C] bg-[#15182A] border border-[#2E3150] h-1.5 cursor-pointer outline-none"
            />
          )}

          {/* Calibration buttons row: MIN | dec | amount | inc | MAX */}
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <button 
              onClick={handleMin}
              disabled={isDisabled}
              aria-label="Set minimum buy-in"
              className="px-2 py-0.5 bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] text-xs hover:text-[#F3EBD8] cursor-pointer disabled:opacity-50 transition-none"
              style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}
            >
              MIN
            </button>
            <button 
              onClick={handleDecrement}
              disabled={isDisabled || buyInAmount <= table.minBuyIn}
              aria-label="Decrease buy-in"
              className="px-2.5 py-0.5 bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] text-sm hover:text-[#F3EBD8] font-bold cursor-pointer disabled:opacity-50 transition-none"
              style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}
            >
              -
            </button>
            <div className="flex-1 text-center font-bold text-sm text-[#F6B73C] bg-[#15182A]/80 border border-[#2E3150] py-0.5 leading-none">
              {buyInAmount.toFixed(2)}
            </div>
            <button 
              onClick={handleIncrement}
              disabled={isDisabled || buyInAmount >= Math.min(table.maxBuyIn, profile.chips)}
              aria-label="Increase buy-in"
              className="px-2.5 py-0.5 bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] text-sm hover:text-[#F3EBD8] font-bold cursor-pointer disabled:opacity-50 transition-none"
              style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}
            >
              +
            </button>
            <button 
              onClick={handleMax}
              disabled={isDisabled}
              aria-label="Set maximum buy-in"
              className="px-2 py-0.5 bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] text-xs hover:text-[#F3EBD8] cursor-pointer disabled:opacity-50 transition-none"
              style={{ clipPath: 'polygon(2px 0, 100% 0, 100% calc(100% - 2px), calc(100% - 2px) 100%, 0 100%, 0 2px)' }}
            >
              MAX
            </button>
          </div>

          {/* Balance After Buy-In */}
          <div className="flex items-center justify-between border-t border-[#2E3150]/50 pt-1 text-[10px] text-[#63657A]">
            <span className="uppercase">BALANCE AFTER BUY-IN:</span>
            <span className="text-[#66D18F] font-bold">{balanceAfter.toFixed(2)} COINS</span>
          </div>
        </div>

        {/* Action Buttons Column */}
        <div className="space-y-1.5 pt-0.5">
          {/* Gold primary Join button */}
          {table.isLocked ? (
            <CasinoButton variant="dark" disabled className="w-full h-9">
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>LOCKED ARENA</span>
              </div>
            </CasinoButton>
          ) : isFull ? (
            <CasinoButton variant="dark" disabled className="w-full h-9">
              <div className="flex items-center justify-center gap-2">
                <span>SEATING IS FULL (6/6)</span>
              </div>
            </CasinoButton>
          ) : !isAffordable ? (
            <CasinoButton variant="dark" disabled className="w-full h-9">
              <div className="flex items-center justify-center gap-2">
                <span>INSUFFICIENT PLAY COINS</span>
              </div>
            </CasinoButton>
          ) : (
            <CasinoButton 
              variant="gold" 
              shimmer 
              className="w-full h-9 font-jersey uppercase text-base"
              onClick={handleJoinClick}
            >
              <div className="flex items-center justify-center gap-2 text-black font-bold">
                <Play className="w-4 h-4 fill-current text-black" />
                <span>JOIN TABLE</span>
              </div>
            </CasinoButton>
          )}

          {/* Watch Table Button */}
          <CasinoButton 
            variant="dark" 
            className="w-full h-8 font-jersey uppercase text-xs border border-[#2E3150]"
            onClick={handleWatchClick}
            aria-label={`Watch match on table ${table.name}`}
          >
            <div className="flex items-center justify-center gap-2 text-[#9A9AB5]">
              <Eye className="w-3.5 h-3.5" />
              <span>WATCH TABLE</span>
            </div>
          </CasinoButton>

          {/* Toggle Favorite Button with correct V2 magenta style */}
          <CasinoButton 
            variant="dark" 
            className="w-full h-8 font-jersey uppercase text-xs border border-[#2E3150]"
            onClick={(e) => onToggleFavorite(table.id, e)}
            aria-label={isFavorite ? `Remove ${table.name} from favorites` : `Add ${table.name} to favorites`}
            aria-pressed={isFavorite}
          >
            <div className="flex items-center justify-center gap-2 text-[#9A9AB5]">
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#D95F9A] text-[#D95F9A]' : ''}`} />
              <span>{isFavorite ? 'REMOVE FAVORITE' : 'ADD TO FAVORITES'}</span>
            </div>
          </CasinoButton>
        </div>

      </div>
    </CasinoPanel>
  );
};
