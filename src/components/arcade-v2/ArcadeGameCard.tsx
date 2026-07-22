/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArcadeGameData, ArcadeGameId } from './arcadeTypes';
import { CasinoBadge } from '../ui-v2';
import { Play } from 'lucide-react';

interface ArcadeGameCardProps {
  game: ArcadeGameData;
  onSelectGame: (id: ArcadeGameId) => void;
}

const renderGameVisual = (id: ArcadeGameId, accent: string) => {
  switch (id) {
    case 'wheel':
      return (
        <div className="w-full h-32 bg-[#0B0D18] border border-[#2E3150] flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <svg viewBox="0 0 32 32" className="w-16 h-16" shapeRendering="crispEdges">
            <circle cx="16" cy="16" r="14" fill="#15182A" stroke="#54D6D9" strokeWidth="2" />
            <path d="M16 2 L16 30 M2 16 L30 16 M6 6 L26 26 M6 26 L26 6" stroke="#2E3150" strokeWidth="1" />
            <circle cx="16" cy="16" r="6" fill="#F6B73C" />
            <text x="16" y="19" textAnchor="middle" fill="#000000" fontSize="7" fontWeight="bold" fontFamily="Jersey 25, sans-serif">10X</text>
          </svg>
          <span className="font-jersey text-[10px] text-[#54D6D9] uppercase mt-1">16-SEGMENT SPINNER</span>
        </div>
      );
    case 'dice':
      return (
        <div className="w-full h-32 bg-[#0B0D18] border border-[#2E3150] flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <div className="flex gap-3 items-center">
            {/* Die 1 */}
            <svg viewBox="0 0 16 16" className="w-10 h-10" shapeRendering="crispEdges">
              <rect x="0" y="0" width="16" height="16" fill="#15182A" stroke="#D95F9A" strokeWidth="1" />
              <rect x="3" y="3" width="2" height="2" fill="#D95F9A" />
              <rect x="11" y="3" width="2" height="2" fill="#D95F9A" />
              <rect x="7" y="7" width="2" height="2" fill="#D95F9A" />
              <rect x="3" y="11" width="2" height="2" fill="#D95F9A" />
              <rect x="11" y="11" width="2" height="2" fill="#D95F9A" />
            </svg>
            {/* Die 2 */}
            <svg viewBox="0 0 16 16" className="w-10 h-10" shapeRendering="crispEdges">
              <rect x="0" y="0" width="16" height="16" fill="#15182A" stroke="#F6B73C" strokeWidth="1" />
              <rect x="3" y="3" width="2" height="2" fill="#F6B73C" />
              <rect x="11" y="3" width="2" height="2" fill="#F6B73C" />
              <rect x="3" y="7" width="2" height="2" fill="#F6B73C" />
              <rect x="11" y="7" width="2" height="2" fill="#F6B73C" />
              <rect x="3" y="11" width="2" height="2" fill="#F6B73C" />
              <rect x="11" y="11" width="2" height="2" fill="#F6B73C" />
            </svg>
          </div>
          <span className="font-jersey text-[10px] text-[#D95F9A] uppercase mt-1">HIGH-LOW PREDICTION</span>
        </div>
      );
    case 'scratch':
      return (
        <div className="w-full h-32 bg-[#0B0D18] border border-[#2E3150] flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <div className="grid grid-cols-3 gap-1 w-24 h-20 bg-[#15182A] border border-[#F29E4C] p-1">
            <div className="bg-[#F29E4C] flex items-center justify-center text-black font-jersey text-xs font-bold">★</div>
            <div className="bg-[#222744] flex items-center justify-center text-[#9A9AB5] font-jersey text-[10px]">?</div>
            <div className="bg-[#F29E4C] flex items-center justify-center text-black font-jersey text-xs font-bold">★</div>
            <div className="bg-[#222744] flex items-center justify-center text-[#9A9AB5] font-jersey text-[10px]">?</div>
            <div className="bg-[#F29E4C] flex items-center justify-center text-black font-jersey text-xs font-bold">★</div>
            <div className="bg-[#222744] flex items-center justify-center text-[#9A9AB5] font-jersey text-[10px]">?</div>
          </div>
          <span className="font-jersey text-[10px] text-[#F29E4C] uppercase mt-1">SCRATCH FOIL GRID</span>
        </div>
      );
    case 'pachinko':
      return (
        <div className="w-full h-32 bg-[#0B0D18] border border-[#2E3150] flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <svg viewBox="0 0 32 24" className="w-20 h-16" shapeRendering="crispEdges">
            {/* Pegs */}
            <rect x="15" y="3" width="2" height="2" fill="#9A9AB5" />
            <rect x="10" y="8" width="2" height="2" fill="#9A9AB5" />
            <rect x="20" y="8" width="2" height="2" fill="#9A9AB5" />
            <rect x="5" y="13" width="2" height="2" fill="#9A9AB5" />
            <rect x="15" y="13" width="2" height="2" fill="#9A9AB5" />
            <rect x="25" y="13" width="2" height="2" fill="#9A9AB5" />
            {/* Falling Ball */}
            <circle cx="16" cy="7" r="2" fill="#66D18F" />
            {/* Slots at bottom */}
            <rect x="2" y="19" width="6" height="3" fill="#222744" stroke="#66D18F" strokeWidth="0.5" />
            <rect x="10" y="19" width="12" height="3" fill="#66D18F" />
            <rect x="24" y="19" width="6" height="3" fill="#222744" stroke="#66D18F" strokeWidth="0.5" />
          </svg>
          <span className="font-jersey text-[10px] text-[#66D18F] uppercase mt-1">PEG BOARD CASCADE</span>
        </div>
      );
    case 'luckydraw':
      return (
        <div className="w-full h-32 bg-[#0B0D18] border border-[#2E3150] flex flex-col items-center justify-center p-2 relative overflow-hidden">
          <svg viewBox="0 0 32 24" className="w-20 h-16" shapeRendering="crispEdges">
            <rect x="4" y="4" width="24" height="16" fill="#15182A" stroke="#F6B73C" strokeWidth="1" />
            <rect x="8" y="8" width="16" height="8" fill="#F6B73C" />
            <text x="16" y="14" textAnchor="middle" fill="#000000" fontSize="6" fontWeight="bold" fontFamily="Jersey 25, sans-serif">TICKET</text>
          </svg>
          <span className="font-jersey text-[10px] text-[#F6B73C] uppercase mt-1">SCHEDULED DRAW</span>
        </div>
      );
    default:
      return null;
  }
};

export const ArcadeGameCard: React.FC<ArcadeGameCardProps> = ({
  game,
  onSelectGame,
}) => {
  const borderColors = {
    gold: 'border-[#2E3150] hover:border-[#F6B73C]',
    cyan: 'border-[#2E3150] hover:border-[#54D6D9]',
    magenta: 'border-[#2E3150] hover:border-[#D95F9A]',
    success: 'border-[#2E3150] hover:border-[#66D18F]',
    warning: 'border-[#2E3150] hover:border-[#F29E4C]',
  };

  const badgeVariants: Record<string, 'gold' | 'cyan' | 'magenta' | 'success' | 'warning'> = {
    gold: 'gold',
    cyan: 'cyan',
    magenta: 'magenta',
    success: 'success',
    warning: 'warning',
  };

  return (
    <button
      type="button"
      onClick={() => onSelectGame(game.id)}
      aria-label={`Play ${game.title}`}
      className={`group w-full text-left bg-[#15182A] border-2 ${borderColors[game.accent]} p-3 flex flex-col justify-between transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F6B73C] focus-visible:ring-inset filter drop-shadow-[2px_2px_0px_#000000]`}
      style={{
        clipPath:
          'polygon(0% 0%, calc(100% - 10px) 0%, 100% 10px, 100% 100%, 10px 100%, 0% calc(100% - 10px))',
      }}
    >
      <div className="space-y-3 w-full">
        {/* Visual Header */}
        <div className="relative">
          {renderGameVisual(game.id, game.accent)}
          <div className="absolute top-2 left-2">
            <CasinoBadge variant={badgeVariants[game.accent] || 'dark'}>
              {game.category}
            </CasinoBadge>
          </div>
          <div className="absolute top-2 right-2">
            <CasinoBadge variant="dark">
              {game.maximumPayoutLabel}
            </CasinoBadge>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="font-jersey text-2xl text-[#F3EBD8] uppercase tracking-wide group-hover:text-[#F6B73C] transition-colors leading-none">
            {game.title}
          </h3>
          <p className="font-jersey text-sm text-[#9A9AB5] uppercase leading-tight line-clamp-2 min-h-[2.5rem]">
            {game.description}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-3 border-t border-[#2E3150] mt-3 flex items-center justify-between w-full">
        <span className="font-jersey text-xs text-[#63657A] uppercase tracking-wider">
          PLAY-MONEY SESSION
        </span>
        <div className="flex items-center gap-1 font-jersey text-base text-[#F6B73C] uppercase font-bold group-hover:translate-x-1 transition-transform">
          <span>PLAY GAME</span>
          <Play className="w-4 h-4 fill-[#F6B73C]" />
        </div>
      </div>
    </button>
  );
};
