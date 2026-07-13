/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CasinoPanel, CasinoButton } from '../ui-v2';
import { GameType, SpeedType } from './pokerTypes';
import { Zap } from 'lucide-react';
import { audio } from '../../lib/audio';

interface PokerQuickJoinProps {
  onQuickJoin: (
    gameType: GameType | 'All',
    stakes: 'All' | 'Low' | 'Medium' | 'High',
    speed: SpeedType | 'All',
    seats: 'All' | 'Available' | 'NotFull'
  ) => void;
}

export const PokerQuickJoin: React.FC<PokerQuickJoinProps> = ({ onQuickJoin }) => {
  const [selectedGameType, setSelectedGameType] = useState<GameType | 'All'>('All');
  const [selectedStakes, setSelectedStakes] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedType | 'All'>('All');
  const [selectedSeats, setSelectedSeats] = useState<'All' | 'Available' | 'NotFull'>('All');

  const handleQuickJoinClick = () => {
    onQuickJoin(selectedGameType, selectedStakes, selectedSpeed, selectedSeats);
  };

  return (
    <CasinoPanel 
      title="QUICK JOIN" 
      subtitle="Best available table based on your preferences."
    >
      <div className="flex flex-col xl:flex-row xl:items-end gap-4 font-jersey">
        {/* Controls Layout - horizontal or 4-column responsive grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          
          {/* 1. Game Type */}
          <div className="space-y-1">
            <label className="block text-xs text-[#9A9AB5] uppercase tracking-wider leading-none">
              Game Type:
            </label>
            <select
              value={selectedGameType}
              onChange={(e) => { audio.playClick(); setSelectedGameType(e.target.value as GameType | 'All'); }}
              className="w-full bg-[#0B0D18] border border-[#2E3150] text-[#F3EBD8] font-jersey py-1.5 px-2.5 outline-none focus:border-[#3FF7FF] text-sm md:text-base cursor-pointer"
              style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
            >
              <option value="All">All Games</option>
              <option value="Texas Hold'em">Hold'em</option>
              <option value="Omaha">Omaha</option>
            </select>
          </div>

          {/* 2. Stakes */}
          <div className="space-y-1">
            <label className="block text-xs text-[#9A9AB5] uppercase tracking-wider leading-none">
              Stakes Level:
            </label>
            <select
              value={selectedStakes}
              onChange={(e) => { audio.playClick(); setSelectedStakes(e.target.value as 'All' | 'Low' | 'Medium' | 'High'); }}
              className="w-full bg-[#0B0D18] border border-[#2E3150] text-[#F3EBD8] font-jersey py-1.5 px-2.5 outline-none focus:border-[#3FF7FF] text-sm md:text-base cursor-pointer"
              style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
            >
              <option value="All">All Stakes</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* 3. Speed */}
          <div className="space-y-1">
            <label className="block text-xs text-[#9A9AB5] uppercase tracking-wider leading-none">
              Game Speed:
            </label>
            <select
              value={selectedSpeed}
              onChange={(e) => { audio.playClick(); setSelectedSpeed(e.target.value as SpeedType | 'All'); }}
              className="w-full bg-[#0B0D18] border border-[#2E3150] text-[#F3EBD8] font-jersey py-1.5 px-2.5 outline-none focus:border-[#3FF7FF] text-sm md:text-base cursor-pointer"
              style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
            >
              <option value="All">All Speeds</option>
              <option value="Standard">Standard</option>
              <option value="Fast">Fast</option>
              <option value="Turbo">Turbo</option>
            </select>
          </div>

          {/* 4. Seats */}
          <div className="space-y-1">
            <label className="block text-xs text-[#9A9AB5] uppercase tracking-wider leading-none">
              Seat Status:
            </label>
            <select
              value={selectedSeats}
              onChange={(e) => { audio.playClick(); setSelectedSeats(e.target.value as 'All' | 'Available' | 'NotFull'); }}
              className="w-full bg-[#0B0D18] border border-[#2E3150] text-[#F3EBD8] font-jersey py-1.5 px-2.5 outline-none focus:border-[#3FF7FF] text-sm md:text-base cursor-pointer"
              style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
            >
              <option value="All">All Seats</option>
              <option value="Available">Available</option>
              <option value="NotFull">Not Full</option>
            </select>
          </div>

        </div>

        {/* Big Action Button */}
        <div className="xl:w-48 shrink-0">
          <CasinoButton
            variant="gold"
            shimmer
            className="w-full h-[34px] !py-0"
            onClick={handleQuickJoinClick}
          >
            <div className="flex items-center justify-center gap-1.5 h-full">
              <Zap className="w-4 h-4 fill-current text-black" />
              <span>QUICK JOIN</span>
            </div>
          </CasinoButton>
        </div>
      </div>
    </CasinoPanel>
  );
};
