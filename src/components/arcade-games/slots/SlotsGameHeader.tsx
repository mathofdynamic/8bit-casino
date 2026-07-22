/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CasinoBadge, CasinoButton, CasinoPanel } from '../../ui-v2';
import { ArrowLeft } from 'lucide-react';

interface SlotsGameHeaderProps {
  onBack: () => void;
}

export const SlotsGameHeader: React.FC<SlotsGameHeaderProps> = ({ onBack }) => {
  return (
    <CasinoPanel
      chamfer={12}
      borderColor="default"
      className="w-full bg-[#15182A]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-jersey text-sm uppercase text-[#54D6D9] tracking-widest">
              ARCADE GAME
            </span>
          </div>
          <h1 className="font-jersey text-3xl md:text-4xl uppercase text-[#F3EBD8] tracking-wide leading-none">
            777 REELS
          </h1>
          <p className="font-jersey text-sm md:text-base text-[#9A9AB5] uppercase leading-tight">
            Choose a reel mode, set a play-money bet, and spin.
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <CasinoBadge variant="dark">3 OR 5 REELS</CasinoBadge>
            <CasinoBadge variant="gold">UP TO 100×</CasinoBadge>
            <CasinoBadge variant="cyan">PLAY-MONEY</CasinoBadge>
          </div>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <CasinoButton
            type="button"
            variant="dark"
            size="md"
            onClick={onBack}
            className="px-3 py-1.5"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO ARCADE</span>
            </div>
          </CasinoButton>
        </div>
      </div>
    </CasinoPanel>
  );
};
