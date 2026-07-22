import React from 'react';
import { CasinoButton, CasinoBadge } from '../../ui-v2';
import { ArrowLeft } from 'lucide-react';

interface DiceGameHeaderProps {
  onBack: () => void;
}

export const DiceGameHeader: React.FC<DiceGameHeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-[#15182A] border-2 border-[#2E3150] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 filter drop-shadow-[4px_4px_0px_#000000]">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-jersey text-xs text-[#54D6D9] uppercase tracking-widest">
            ARCADE GAME
          </span>
          <div className="flex gap-1.5 flex-wrap">
            <CasinoBadge variant="cyan">TWO DICE</CasinoBadge>
            <CasinoBadge variant="gold">MULTI-ROUND</CasinoBadge>
            <CasinoBadge variant="dark">PLAY-MONEY</CasinoBadge>
          </div>
        </div>
        <h1 className="font-jersey text-3xl md:text-4xl text-[#F6B73C] uppercase tracking-wide leading-none">
          HIGH-LOW DICE
        </h1>
        <p className="font-jersey text-sm text-[#9A9AB5] uppercase mt-1">
          Predict whether the next dice total will be higher, lower, or equal.
        </p>
      </div>

      <div className="shrink-0 self-start md:self-center">
        <CasinoButton
          type="button"
          variant="dark"
          size="md"
          onClick={onBack}
          className="px-3 py-1.5"
        >
          <div className="flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ARCADE</span>
          </div>
        </CasinoButton>
      </div>
    </header>
  );
};
