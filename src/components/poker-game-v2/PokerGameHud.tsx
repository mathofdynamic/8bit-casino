import React from 'react';
import { PixelButton } from '../PixelUI';
import { Clock } from 'lucide-react';
import { PokerGameState, PokerGameActions } from './pokerGameTypes';

interface PokerGameHudProps {
  state: PokerGameState;
  actions: PokerGameActions;
  roomThemeName: string;
  onOpenThemeDrawer: () => void;
}

export const PokerGameHud: React.FC<PokerGameHudProps> = ({ state, actions, roomThemeName, onOpenThemeDrawer }) => {
  const { table, gameStage, pot, currentBet, currentHandNum, turnTimer } = state;
  if (!table) return null;

  const timerColor = turnTimer <= 2 ? 'text-red-500' : turnTimer <= 5 ? 'text-[#F29E4C]' : 'text-[#54D6D9]';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full z-10 relative mt-4 px-4">
      {/* Left Group */}
      <div className="flex flex-col gap-1 text-center md:text-left shrink-0">
        <h1 className="font-jersey text-xl md:text-2xl text-[#F3EBD8] uppercase m-0 leading-none" style={{ textShadow: '2px 2px 0 #000' }}>
          {table.name}
        </h1>
        <p className="font-jersey text-sm text-[#9A9AB5] uppercase m-0 leading-none">
          STAKES: {table.difficulty} • BLINDS: {table.smallBlind.toFixed(2)} / {table.bigBlind.toFixed(2)} COINS
        </p>
        <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
          <span className="font-jersey text-xs text-[#63657A] uppercase">{roomThemeName}</span>
          <button
            onClick={onOpenThemeDrawer}
            className="font-jersey text-xs text-[#54D6D9] hover:text-white transition-colors underline"
          >
            ROOM THEME
          </button>
        </div>
      </div>

      {/* Center Group */}
      <div className="bg-[#15182A] border-2 border-[#2E3150] px-6 py-2 flex flex-col items-center justify-center shrink-0 min-w-[200px]" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
        <div className="font-jersey text-[#F6B73C] text-lg uppercase tracking-wider">
          HAND {currentHandNum} • {gameStage.replace('_', ' ')}
        </div>
        <div className="flex gap-4 font-jersey text-sm mt-1">
          <span className="text-[#66D18F]">POT: {pot.toFixed(2)} COINS</span>
          <span className="text-[#9A9AB5]">CURRENT BET: {currentBet.toFixed(2)} COINS</span>
        </div>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-4 shrink-0">
        <div className={`font-jersey text-lg flex items-center gap-2 ${timerColor} w-16`} style={{ textShadow: '2px 2px 0 #000' }}>
          <Clock className="w-5 h-5" />
          {turnTimer}s
        </div>
        <PixelButton onClick={actions.onOpenRebuy}>
          REBUY
        </PixelButton>
        <PixelButton variant="red" onClick={actions.onExitTable}>
          STAND & EXIT
        </PixelButton>
      </div>
    </div>
  );
};
