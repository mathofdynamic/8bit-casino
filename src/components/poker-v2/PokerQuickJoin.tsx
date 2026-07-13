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
  onQuickJoin: (gameType: GameType | 'All', stakes: 'All' | 'Low' | 'Medium' | 'High', speed: SpeedType | 'All') => void;
}

export const PokerQuickJoin: React.FC<PokerQuickJoinProps> = ({ onQuickJoin }) => {
  const [selectedGameType, setSelectedGameType] = useState<GameType | 'All'>('All');
  const [selectedStakes, setSelectedStakes] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedType | 'All'>('All');

  const handleQuickJoinClick = () => {
    onQuickJoin(selectedGameType, selectedStakes, selectedSpeed);
  };

  return (
    <CasinoPanel 
      title="QUICK JOIN ENGINE" 
      subtitle="Instantly teleport into the most optimal active game slot"
      className="h-full"
    >
      <div className="flex flex-col h-full justify-between space-y-4">
        <div className="space-y-3.5">
          {/* Game Type Picker */}
          <div>
            <label className="block font-jersey text-sm text-[#9A9AB5] uppercase mb-1.5 leading-none">
              Preferred Game Mode:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['All', "Texas Hold'em", 'Omaha'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => { audio.playClick(); setSelectedGameType(type); }}
                  className={`py-1 font-jersey text-[15px] uppercase border transition-none cursor-pointer ${
                    selectedGameType === type
                      ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                      : 'bg-[#0B0D18] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                  }`}
                  style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                >
                  {type === "Texas Hold'em" ? "Hold'em" : type}
                </button>
              ))}
            </div>
          </div>

          {/* Stakes Selector */}
          <div>
            <label className="block font-jersey text-sm text-[#9A9AB5] uppercase mb-1.5 leading-none">
              Table Stakes Level:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['All', 'Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => { audio.playClick(); setSelectedStakes(level); }}
                  className={`py-1 font-jersey text-[15px] uppercase border transition-none cursor-pointer ${
                    selectedStakes === level
                      ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                      : 'bg-[#0B0D18] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                  }`}
                  style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Selection */}
          <div>
            <label className="block font-jersey text-sm text-[#9A9AB5] uppercase mb-1.5 leading-none">
              Simulated Spin/Play Speed:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['All', 'Standard', 'Fast', 'Turbo'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => { audio.playClick(); setSelectedSpeed(speed); }}
                  className={`py-1 font-jersey text-[15px] uppercase border transition-none cursor-pointer ${
                    selectedSpeed === speed
                      ? 'bg-[#1D2036] border-[#F6B73C] text-[#F6B73C] font-bold'
                      : 'bg-[#0B0D18] border-[#2E3150] text-[#9A9AB5] hover:text-[#F3EBD8]'
                  }`}
                  style={{ clipPath: 'polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px), 0 3px)' }}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Action Button */}
        <div className="pt-2">
          <CasinoButton
            variant="gold"
            shimmer
            className="w-full h-11"
            onClick={handleQuickJoinClick}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="w-5 h-5 fill-current" />
              <span>LAUNCH MATCHED SLOT</span>
            </div>
          </CasinoButton>
        </div>
      </div>
    </CasinoPanel>
  );
};
