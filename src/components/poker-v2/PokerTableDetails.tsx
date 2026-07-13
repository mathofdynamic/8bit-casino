/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PokerTable } from './pokerTypes';
import { CasinoPanel, CasinoButton, CasinoBadge } from '../ui-v2';
import { useStore } from '../../store';
import { PokerMiniTablePreview } from './PokerMiniTablePreview';
import { Lock, ArrowRight, Play } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerTableDetailsProps {
  table: PokerTable | null;
  onJoinTable: (tableId: string, buyIn: number) => void;
}

export const PokerTableDetails: React.FC<PokerTableDetailsProps> = ({
  table,
  onJoinTable,
}) => {
  const { profile } = useStore();
  const [buyIn, setBuyIn] = useState<number>(0);

  // Sync default buy-in amount when table changes
  useEffect(() => {
    if (table) {
      // Default to medium/balanced buy-in amount
      const recommended = (table.minBuyIn + table.maxBuyIn) / 2;
      setBuyIn(Number(recommended.toFixed(2)));
    }
  }, [table]);

  if (!table) {
    return (
      <CasinoPanel 
        title="TABLE DISPATCH PANEL" 
        subtitle="Select a dynamic cabinet table from the main monitor to calibrate"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center select-none h-full min-h-[300px]">
          <span className="text-[#63657A] text-5xl mb-4 leading-none">🖥️</span>
          <p className="font-jersey text-lg text-[#9A9AB5] uppercase leading-none">NO CABINET LINK ACTIVATED</p>
          <p className="font-jersey text-sm text-[#63657A] uppercase mt-2 max-w-xs leading-tight">
            Click on any available poker table from the main spreadsheet list to link telemetry and inspect active stacks.
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
    setBuyIn(Number(val.toFixed(2)));
  };

  const handleJoinClick = () => {
    if (isDisabled) return;
    onJoinTable(table.id, buyIn);
  };

  return (
    <CasinoPanel 
      title={`CABINET: ${table.name}`} 
      subtitle={table.gameType}
      borderColor="strong"
    >
      <div className="flex flex-col gap-4 select-none">
        
        {/* Row 1: Radar layout and table metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PokerMiniTablePreview table={table} />

          {/* Table Metrics */}
          <div className="flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="bg-[#0B0D18] p-2.5 border border-[#2E3150]" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                <p className="font-jersey text-xs text-[#63657A] uppercase leading-none mb-1">TABLE LOG & RULES</p>
                <p className="font-jersey text-sm text-[#9A9AB5] uppercase leading-tight">
                  {table.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0B0D18] p-2 border border-[#2E3150]/60" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                  <span className="text-[#63657A] uppercase">AVERAGE POT</span>
                  <p className="text-sm font-jersey text-[#F3EBD8] mt-0.5 leading-none">{table.averagePot.toFixed(2)} COINS</p>
                </div>
                <div className="bg-[#0B0D18] p-2 border border-[#2E3150]/60" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                  <span className="text-[#63657A] uppercase">HAND SPEED</span>
                  <p className="text-sm font-jersey text-[#54D6D9] mt-0.5 leading-none">{table.averageHandTime}S / DEAL</p>
                </div>
                <div className="bg-[#0B0D18] p-2 border border-[#2E3150]/60" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                  <span className="text-[#63657A] uppercase">SPEED TICKET</span>
                  <p className="text-sm font-jersey text-[#D95F9A] mt-0.5 leading-none">{table.speed}</p>
                </div>
                <div className="bg-[#0B0D18] p-2 border border-[#2E3150]/60" style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}>
                  <span className="text-[#63657A] uppercase">DIFFICULTY</span>
                  <p className="text-sm font-jersey text-[#F29E4C] mt-0.5 leading-none">{table.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Wallet HUD check */}
            <div className="bg-[#0b0d18] p-2 flex items-center justify-between border-l-2 border-[#F6B73C] text-xs">
              <div>
                <span className="text-[#63657A] uppercase">YOUR WALLET BALANCE</span>
                <p className="text-base font-jersey text-[#F6B73C] leading-none mt-0.5">{profile.chips.toFixed(2)} COINS</p>
              </div>
              <CasinoBadge variant={isAffordable ? 'success' : 'danger'}>
                {isAffordable ? 'FUNDS OK' : 'INSUFFICIENT'}
              </CasinoBadge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2E3150]" />

        {/* Row 2: Buy-In Calibration Controls */}
        {!table.isLocked && !isFull && isAffordable && (
          <div className="space-y-3 bg-[#0B0D18] p-3 border border-[#2E3150]" style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}>
            <div className="flex items-center justify-between">
              <span className="font-jersey text-sm text-[#9A9AB5] uppercase leading-none">BUY-IN CALIBRATION METER</span>
              <span className="font-jersey text-lg text-[#F6B73C] uppercase leading-none font-bold">
                {buyIn.toFixed(2)} COINS
              </span>
            </div>

            {/* Slider */}
            <div className="relative pt-1 flex items-center">
              <input 
                type="range"
                min={table.minBuyIn}
                max={Math.min(table.maxBuyIn, profile.chips)}
                step="0.01"
                value={buyIn}
                onChange={handleSliderChange}
                className="w-full accent-[#F6B73C] bg-[#15182A] border border-[#2E3150] h-2.5 outline-none cursor-pointer"
              />
            </div>

            {/* Quick calibration buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { audio.playClick(); setBuyIn(table.minBuyIn); }}
                className="py-1 font-jersey text-xs uppercase bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
                style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
              >
                MIN: {table.minBuyIn.toFixed(2)}
              </button>
              <button 
                onClick={() => { 
                  audio.playClick(); 
                  const half = (table.minBuyIn + table.maxBuyIn) / 2;
                  setBuyIn(Number(Math.min(half, profile.chips).toFixed(2))); 
                }}
                className="py-1 font-jersey text-xs uppercase bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
                style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
              >
                MID: {((table.minBuyIn + table.maxBuyIn) / 2).toFixed(2)}
              </button>
              <button 
                onClick={() => { audio.playClick(); setBuyIn(Number(Math.min(table.maxBuyIn, profile.chips).toFixed(2))); }}
                className="py-1 font-jersey text-xs uppercase bg-[#15182A] border border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8] cursor-pointer"
                style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
              >
                MAX: {Math.min(table.maxBuyIn, profile.chips).toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* Join Seat Action button */}
        <div className="pt-1">
          {table.isLocked ? (
            <CasinoButton variant="dark" disabled className="w-full h-11">
              <div className="flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                <span>LOCKED ARENA (INVITE ONLY)</span>
              </div>
            </CasinoButton>
          ) : isFull ? (
            <CasinoButton variant="dark" disabled className="w-full h-11">
              <div className="flex items-center justify-center gap-2">
                <span>SEATING IS CURRENTLY FULL (6/6)</span>
              </div>
            </CasinoButton>
          ) : !isAffordable ? (
            <CasinoButton variant="dark" disabled className="w-full h-11">
              <div className="flex items-center justify-center gap-2">
                <span>INSUFFICIENT PLAY COINS</span>
              </div>
            </CasinoButton>
          ) : (
            <CasinoButton 
              variant="cyan" 
              shimmer 
              className="w-full h-11"
              onClick={handleJoinClick}
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                <span>TAKE SEAT & BUY-IN</span>
              </div>
            </CasinoButton>
          )}
        </div>

      </div>
    </CasinoPanel>
  );
};
