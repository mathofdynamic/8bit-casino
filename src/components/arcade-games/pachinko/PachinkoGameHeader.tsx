/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CasinoButton, CasinoBadge } from '../../ui-v2';

interface PachinkoGameHeaderProps {
  onBack: () => void;
}

export const PachinkoGameHeader: React.FC<PachinkoGameHeaderProps> = ({ onBack }) => {
  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      <div>
        <div className="font-jersey text-xs text-[#54D6D9] uppercase tracking-widest mb-1">
          ARCADE GAME
        </div>
        <h1 className="font-jersey text-3xl md:text-4xl text-[#F6B73C] uppercase leading-none tracking-wide m-0">
          PLINKO CASCADE
        </h1>
        <p className="font-jersey text-sm text-[#9A9AB5] uppercase m-0 mt-1">
          Drop play-money balls through eight peg rows and land in multiplier slots.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <CasinoBadge variant="gold">8 PEG ROWS</CasinoBadge>
          <CasinoBadge variant="magenta">UP TO 20×</CasinoBadge>
          <CasinoBadge variant="cyan">MULTI-BALL</CasinoBadge>
          <CasinoBadge variant="dark">PLAY-MONEY</CasinoBadge>
        </div>
      </div>

      <div className="shrink-0 self-end md:self-auto">
        <CasinoButton
          type="button"
          variant="dark"
          onClick={onBack}
          size="sm"
        >
          <div className="flex items-center gap-1.5 px-1">
            <ArrowLeft className="w-4 h-4 text-[#F3EBD8]" />
            <span>BACK TO ARCADE</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
