import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CasinoButton } from '../../ui-v2';

interface ScratchGameHeaderProps {
  onBack: () => void;
}

export const ScratchGameHeader: React.FC<ScratchGameHeaderProps> = ({ onBack }) => {
  return (
    <div className="bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-jersey uppercase text-[#54D6D9] tracking-widest bg-[#222744] px-2 py-0.5 border border-[#2E3150]">
            ARCADE GAME
          </span>
          <span className="text-xs font-jersey uppercase text-[#F6B73C] tracking-widest bg-[#222744] px-2 py-0.5 border border-[#2E3150]">
            3×3 CARD
          </span>
          <span className="text-xs font-jersey uppercase text-[#D95F9A] tracking-widest bg-[#222744] px-2 py-0.5 border border-[#2E3150]">
            UP TO 100×
          </span>
          <span className="text-xs font-jersey uppercase text-[#66D18F] tracking-widest bg-[#222744] px-2 py-0.5 border border-[#2E3150]">
            PLAY-MONEY
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-jersey text-[#F3EBD8] uppercase m-0 leading-none tracking-wide">
          PIXEL SCRATCHER
        </h1>
        <p className="font-jersey text-sm text-[#9A9AB5] uppercase m-0">
          Reveal the complete 3×3 card and match three symbols for a play-money payout.
        </p>
      </div>

      <div className="shrink-0">
        <CasinoButton type="button" variant="dark" onClick={onBack}>
          <div className="flex items-center gap-2 py-0.5">
            <ArrowLeft className="w-4 h-4 text-[#F3EBD8]" />
            <span>BACK TO ARCADE</span>
          </div>
        </CasinoButton>
      </div>
    </div>
  );
};
